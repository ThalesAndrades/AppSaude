/**
 * Cliente Pix direto via PSP — segue o padrão BCB
 * (Manual de Padrões para Iniciação do Pix, API v2 / DICT-COB).
 *
 * Compatível com BB, Itaú, Bradesco, Inter, Sicoob, EFI etc — parametrizado
 * por `PIX_BASE_URL` (ex: https://api.bb.com.br/pix/v2).
 *
 * Auth: OAuth2 client_credentials, opcionalmente com mTLS (PFX/P12 ou PEM).
 *
 * Endpoints utilizados:
 *  - POST {oauth}/token                        — obtém access_token
 *  - PUT  {base}/cob/{txid}                    — cria cobrança imediata
 *  - GET  {base}/cob/{txid}                    — consulta
 *  - GET  {base}/loc/{locId}/qrcode            — emite QR (texto + PNG)
 */

import { readFileSync } from 'node:fs';
import { Agent } from 'undici';
import { randomBytes } from 'node:crypto';

let cachedToken = null; // { access_token, expiresAt }
let cachedDispatcher = null;

function cfg() {
  const baseUrl = (process.env.PIX_BASE_URL || '').replace(/\/$/, '');
  const oauthUrl = (process.env.PIX_OAUTH_URL || '').trim();
  const clientId = process.env.PIX_CLIENT_ID;
  const clientSecret = process.env.PIX_CLIENT_SECRET;
  const chave = process.env.PIX_CHAVE;
  const oauthScope = process.env.PIX_OAUTH_SCOPE || 'cob.write cob.read pix.read';

  if (!baseUrl || !oauthUrl || !clientId || !clientSecret || !chave) {
    throw new Error(
      'Integração Pix não configurada. Defina PIX_BASE_URL, PIX_OAUTH_URL, ' +
        'PIX_CLIENT_ID, PIX_CLIENT_SECRET e PIX_CHAVE.'
    );
  }
  return { baseUrl, oauthUrl, clientId, clientSecret, chave, oauthScope };
}

function dispatcher() {
  if (cachedDispatcher !== null) return cachedDispatcher;
  const certPath = process.env.PIX_CERT_PATH;
  if (!certPath) {
    cachedDispatcher = undefined;
    return undefined;
  }
  const passphrase = process.env.PIX_CERT_PASSPHRASE || undefined;
  const isPfx = /\.(pfx|p12)$/i.test(certPath);
  const certBuf = readFileSync(certPath);
  const connect = isPfx
    ? { pfx: certBuf, passphrase }
    : {
        cert: certBuf,
        key: readFileSync(process.env.PIX_KEY_PATH || ''),
        passphrase,
      };
  cachedDispatcher = new Agent({ connect });
  return cachedDispatcher;
}

async function getAccessToken() {
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt - 30_000 > now) {
    return cachedToken.access_token;
  }
  const { oauthUrl, clientId, clientSecret, oauthScope } = cfg();
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const res = await fetch(oauthUrl, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: `grant_type=client_credentials&scope=${encodeURIComponent(oauthScope)}`,
    dispatcher: dispatcher(),
    cache: 'no-store',
  });
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }
  if (!res.ok || !data?.access_token) {
    const err = new Error(
      `OAuth Pix falhou: ${res.status} ${res.statusText} ${data?.error_description || ''}`.trim()
    );
    err.status = res.status;
    err.data = data;
    throw err;
  }
  cachedToken = {
    access_token: data.access_token,
    expiresAt: now + Number(data.expires_in || 600) * 1000,
  };
  return cachedToken.access_token;
}

async function pixApi(path, { method = 'GET', body, query } = {}) {
  const { baseUrl } = cfg();
  const token = await getAccessToken();
  const url = new URL(baseUrl + path);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null && v !== '') {
        url.searchParams.set(k, String(v));
      }
    }
  }
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    dispatcher: dispatcher(),
    cache: 'no-store',
  });
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }
  if (!res.ok) {
    const msg = data?.detail || data?.message || data?.title || '';
    const err = new Error(
      msg
        ? `Pix ${method} ${path} falhou: ${msg}`
        : `Pix ${method} ${path} falhou: ${res.status} ${res.statusText}`
    );
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

// txid: alfanumérico, 26-35 caracteres (BCB)
export function gerarTxid(prefix = 'mf') {
  const safe = String(prefix).replace(/[^a-zA-Z0-9]/g, '').slice(0, 6) || 'mf';
  const rnd = randomBytes(16).toString('hex');
  return (safe + rnd).slice(0, 35);
}

// PUT /cob/{txid}
export async function criarCobrancaImediata({
  txid,
  valorEmCentavos,
  descricao,
  expiraEmSegundos = 1800,
  devedor, // { cpf, nome } | { cnpj, nome }
  referenceId,
}) {
  if (!txid) txid = gerarTxid();
  if (!valorEmCentavos || valorEmCentavos < 1) {
    throw new Error('valorEmCentavos inválido.');
  }
  const { chave } = cfg();
  const valor = (valorEmCentavos / 100).toFixed(2);

  const body = {
    calendario: { expiracao: Number(expiraEmSegundos) },
    valor: { original: valor },
    chave,
    solicitacaoPagador: descricao || 'Pagamento mettafit',
  };
  if (devedor?.cpf) {
    body.devedor = { cpf: String(devedor.cpf).replace(/\D/g, ''), nome: devedor.nome || '' };
  } else if (devedor?.cnpj) {
    body.devedor = { cnpj: String(devedor.cnpj).replace(/\D/g, ''), nome: devedor.nome || '' };
  }
  if (referenceId) {
    body.infoAdicionais = [{ nome: 'referenceId', valor: String(referenceId).slice(0, 200) }];
  }

  const cob = await pixApi(`/cob/${encodeURIComponent(txid)}`, { method: 'PUT', body });

  let qrcode = null;
  const locId = cob?.loc?.id;
  if (locId) {
    try {
      qrcode = await pixApi(`/loc/${encodeURIComponent(locId)}/qrcode`);
    } catch {
      qrcode = null;
    }
  }

  return {
    txid: cob?.txid || txid,
    locId: locId || null,
    pixCopiaECola: cob?.pixCopiaECola || qrcode?.qrcode || null,
    imagemQrcode: qrcode?.imagemQrcode || null,
    expiracao: cob?.calendario?.expiracao,
    criacao: cob?.calendario?.criacao,
    status: cob?.status,
    raw: cob,
  };
}

export async function consultarCobranca(txid) {
  return pixApi(`/cob/${encodeURIComponent(txid)}`);
}

export function statusPagoDaCobranca(cob) {
  return cob?.status === 'CONCLUIDA';
}
