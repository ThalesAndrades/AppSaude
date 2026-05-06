/**
 * Cliente da API Rapidoc Telemedicina — Tema v2.
 *
 * Documentação: https://documenter.getpostman.com/view/17451655/U16onhqm
 *
 * Modelo: B2B baseado em "beneficiaries" identificados por UUID.
 * Não há autenticação de paciente — a sessão é responsabilidade da app.
 * O "plano" é definido pelo serviceType no momento da criação do beneficiário.
 */

const TEMA_CONTENT_TYPE = 'application/vnd.rapidoc.tema-v2+json';

function requireEnv() {
  const baseUrlRaw = process.env.RAPIDOC_BASE_URL || process.env.RAPIDOC_URL;
  const tokenRaw = process.env.RAPIDOC_API_KEY || process.env.RAPIDOC_TOKEN;
  const clientId = process.env.RAPIDOC_PARTNER_ID || process.env.CLIENTID;

  if (!baseUrlRaw || !tokenRaw || !clientId) {
    throw new Error(
      'Integração Rapidoc não configurada. Defina RAPIDOC_BASE_URL/URL, ' +
        'RAPIDOC_API_KEY/TOKEN e RAPIDOC_PARTNER_ID/CLIENTID.'
    );
  }

  // Normaliza baseUrl: remove barra final e remove sufixo /tema se presente,
  // já que os paths internos sempre incluem /tema/api/...
  const baseUrl = baseUrlRaw.replace(/\/$/, '').replace(/\/tema$/, '');
  const token = String(tokenRaw).replace(/^Bearer\s+/i, '').trim();

  return { baseUrl, token, clientId };
}

function extractError(data) {
  if (!data) return null;
  if (typeof data === 'string') return data;
  return (
    data.message ||
    data.error_description ||
    data.error?.message ||
    data.errors?.[0]?.message ||
    null
  );
}

async function call(path, { method = 'GET', body, query } = {}) {
  const { baseUrl, token, clientId } = requireEnv();
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
      Accept: TEMA_CONTENT_TYPE,
      'Content-Type': TEMA_CONTENT_TYPE,
      Authorization: `Bearer ${token}`,
      clientId,
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });

  if (res.status === 204) return null;

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }

  if (!res.ok) {
    const userMessage = extractError(data);
    const err = new Error(
      userMessage
        ? `Rapidoc ${method} ${path} falhou: ${userMessage}`
        : `Rapidoc ${method} ${path} falhou: ${res.status} ${res.statusText}`
    );
    err.status = res.status;
    err.data = data;
    err.userMessage = userMessage;
    throw err;
  }
  return data;
}

// ---------- Helpers de domínio ----------

// Mapeia plano interno -> paymentType/serviceType da Rapidoc.
// imediata: avulsa, clínico geral.
// essencial: recorrente, clínico geral + especialistas.
export function mapPlanoToServiceConfig(planoId) {
  if (planoId === 'imediata') {
    return { paymentType: 'A', serviceType: 'G' };
  }
  if (planoId === 'essencial') {
    return { paymentType: 'S', serviceType: 'GS' };
  }
  return { paymentType: 'S', serviceType: 'G' };
}

// Converte "YYYY-MM-DD" (input HTML) -> "DD/MM/YYYY" (formato Rapidoc).
export function isoDateToBR(iso) {
  if (!iso) return '';
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso));
  if (!m) return iso;
  return `${m[3]}/${m[2]}/${m[1]}`;
}

// ---------- Beneficiários ----------

// POST /tema/api/beneficiaries — recebe array
// Devolve { success, message, beneficiaries: [{cpf, uuid}] }
export async function adicionarBeneficiarios(lista) {
  const arr = Array.isArray(lista) ? lista : [lista];
  return call('/tema/api/beneficiaries', { method: 'POST', body: arr });
}

export async function adicionarBeneficiario(b) {
  const resp = await adicionarBeneficiarios([b]);
  return resp?.beneficiaries?.[0] || null;
}

export function lerBeneficiarios() {
  return call('/tema/api/beneficiaries');
}

export function lerBeneficiarioPorCpf(cpf) {
  const c = String(cpf).replace(/\D/g, '');
  return call(`/tema/api/beneficiaries/${encodeURIComponent(c)}`);
}

export function atualizarBeneficiario(uuid, dados) {
  return call(`/tema/api/beneficiaries/${encodeURIComponent(uuid)}`, {
    method: 'PUT',
    body: dados,
  });
}

export function inativarBeneficiario(uuid) {
  return call(`/tema/api/beneficiaries/${encodeURIComponent(uuid)}`, {
    method: 'DELETE',
  });
}

export function reativarBeneficiario(uuid) {
  return call(`/tema/api/beneficiaries/${encodeURIComponent(uuid)}/reactivate`, {
    method: 'PUT',
  });
}

// GET /tema/api/beneficiaries/:uuid/request-appointment
// Retorna { success, url } — abrir em webview/iframe.
export function solicitarAtendimento(uuid) {
  return call(
    `/tema/api/beneficiaries/${encodeURIComponent(uuid)}/request-appointment`
  );
}

export function lerConsultasDoBeneficiario(uuid) {
  return call(
    `/tema/api/beneficiaries/${encodeURIComponent(uuid)}/appointments`
  );
}

export function lerEncaminhamentosDoBeneficiario(uuid) {
  return call(
    `/tema/api/beneficiaries/${encodeURIComponent(uuid)}/medical-referrals`
  );
}

// ---------- Encaminhamentos ----------

export function lerEncaminhamentos() {
  return call('/tema/api/beneficiary-medical-referrals');
}

// ---------- Agendamento ----------

export function lerEspecialidades() {
  return call('/tema/api/specialties');
}

// dateInitial / dateFinal: "DD/MM/YYYY"
export function lerDisponibilidade({
  specialtyUuid,
  dateInitial,
  dateFinal,
  beneficiaryUuid,
}) {
  return call('/tema/api/specialty-availability', {
    query: { specialtyUuid, dateInitial, dateFinal, beneficiaryUuid },
  });
}

// POST /tema/api/appointments
export function realizarAgendamento({
  beneficiaryUuid,
  availabilityUuid,
  specialtyUuid,
  beneficiaryMedicalReferralUuid,
  approveAdditionalPayment = true,
}) {
  const body = {
    beneficiaryUuid,
    availabilityUuid,
    specialtyUuid,
  };
  if (beneficiaryMedicalReferralUuid) {
    body.beneficiaryMedicalReferralUuid = beneficiaryMedicalReferralUuid;
  } else {
    body.approveAdditionalPayment = Boolean(approveAdditionalPayment);
  }
  return call('/tema/api/appointments', { method: 'POST', body });
}

export function lerAgendamentos() {
  return call('/tema/api/appointments');
}

export function lerAgendamentoPorUuid(uuid) {
  return call(`/tema/api/appointments/${encodeURIComponent(uuid)}`);
}

export function cancelarAgendamento(uuid) {
  return call(`/tema/api/appointments/${encodeURIComponent(uuid)}`, {
    method: 'DELETE',
  });
}

// ---------- Planos ----------

export function lerPlanos() {
  return call('/tema/api/plans');
}

// ---------- Filtro de especialidades não habilitadas ----------

export const ESPECIALIDADES_BLOQUEADAS = new Set([
  'PSICOLOGIA',
  'PSICOLOGO',
  'PSIQUIATRIA',
  'NUTRICAO',
  'NUTRICIONISTA',
]);

export function isEspecialidadePermitida(nome) {
  if (!nome) return true;
  const norm = String(nome)
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  return ![...ESPECIALIDADES_BLOQUEADAS].some((b) => norm.includes(b));
}
