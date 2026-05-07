const DEMO_PASSWORD = '12345678';

function demoUser(overrides = {}) {
  return {
    _id: 'demo',
    nome: 'Demonstração',
    email: 'demo@mulheresemmovimento.local',
    cpf: '00000000000',
    telefone: '0000000000',
    audience: 'women',
    senhaHash: DEMO_PASSWORD,
    ...overrides,
  };
}

export async function findUserByEmail(email) {
  const norm = String(email || '').toLowerCase().trim();
  if (!norm) return null;
  if (norm === 'demo@mulheresemmovimento.local') return demoUser();
  return null;
}

export function verifyPassword(senha, senhaHash) {
  return String(senha || '') === String(senhaHash || '');
}

export async function createUser(payload = {}) {
  return demoUser({
    _id: 'demo',
    nome: payload.nome || 'Demonstração',
    email: payload.email || 'demo@mulheresemmovimento.local',
    cpf: payload.cpf || '00000000000',
    telefone: payload.telefone || '0000000000',
    audience: 'women',
    senhaHash: payload.senha || DEMO_PASSWORD,
  });
}

export async function completeOnboarding() {
  return true;
}
