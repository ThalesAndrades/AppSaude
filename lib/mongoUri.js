/**
 * Validação defensiva da MONGODB_URI.
 *
 * Pega 95% dos erros de configuração ANTES do driver tentar conectar
 * (ex.: senha não URL-encoded, host vazio, esquema errado, caractere
 * proibido vazando para dentro do host).
 *
 * Também expõe um sanitizador para nunca logar a senha.
 */

const VALID_SCHEMES = ['mongodb://', 'mongodb+srv://'];
// Caracteres reservados em userinfo segundo RFC 3986 que QUEBRAM o parser
// se aparecerem crus na senha (precisam ser percent-encoded).
const RESERVED_IN_PASSWORD = ['@', '/', '?', '#', '[', ']', ':', '<', '>'];
// Caracteres jamais permitidos em hostname DNS.
const INVALID_HOST_CHARS = /[<>"`\\^{}|\s]/;

export function sanitizeMongoUri(uri) {
  if (typeof uri !== 'string') return '<não definido>';
  // Remove qualquer coisa entre `:` e `@` no userinfo.
  return uri.replace(/(\/\/[^:/@]+:)([^@]*)(@)/, '$1***$3');
}

/**
 * @returns {{ ok: true } | { ok: false, error: string, hint?: string }}
 */
export function validateMongoUri(rawUri) {
  if (!rawUri || typeof rawUri !== 'string') {
    return { ok: false, error: 'MONGODB_URI ausente ou vazia.' };
  }

  const uri = rawUri.trim();
  const scheme = VALID_SCHEMES.find((s) => uri.startsWith(s));
  if (!scheme) {
    return {
      ok: false,
      error: `MONGODB_URI deve começar com "mongodb://" ou "mongodb+srv://" (recebido: "${uri.slice(0, 16)}...").`,
    };
  }

  const rest = uri.slice(scheme.length);
  if (!rest) {
    return { ok: false, error: 'MONGODB_URI termina logo após o esquema — falta host.' };
  }

  // Separa userinfo (antes do último `@` ANTES da primeira `/`) do hostpath.
  const pathStart = rest.indexOf('/');
  const authority = pathStart === -1 ? rest : rest.slice(0, pathStart);
  const lastAt = authority.lastIndexOf('@');

  let userinfo = '';
  let hostport = authority;
  if (lastAt !== -1) {
    userinfo = authority.slice(0, lastAt);
    hostport = authority.slice(lastAt + 1);
  }

  if (userinfo) {
    const colonIdx = userinfo.indexOf(':');
    const password = colonIdx === -1 ? '' : userinfo.slice(colonIdx + 1);
    const offending = RESERVED_IN_PASSWORD.filter((c) => password.includes(c));
    if (offending.length) {
      return {
        ok: false,
        error: `Senha do MongoDB contém caracteres não-encodados: ${offending.join(' ')}.`,
        hint:
          'URL-encode a senha. Ex.: node -e "console.log(encodeURIComponent(process.argv[1]))" \'SUA_SENHA\'',
      };
    }
  }

  if (!hostport) {
    return { ok: false, error: 'MONGODB_URI sem host após o "@".' };
  }
  if (INVALID_HOST_CHARS.test(hostport)) {
    return {
      ok: false,
      error: `Host do MongoDB tem caracteres inválidos: "${hostport}".`,
      hint:
        'Provável causa: a senha contém um caractere especial (>, <, @, /, etc.) que vazou para dentro do host. URL-encode a senha.',
    };
  }

  // mongodb+srv não permite porta no host.
  if (scheme === 'mongodb+srv://' && /:\d+/.test(hostport)) {
    return {
      ok: false,
      error: 'mongodb+srv:// não aceita porta no host (a porta vem do registro SRV).',
    };
  }

  return { ok: true };
}
