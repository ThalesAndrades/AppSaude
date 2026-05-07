export async function createSession() {}
export async function getSession() {
  return {
    sub: 'demo',
    nome: 'Demonstração',
    email: 'demo@mulheresemmovimento.local',
    cpf: '',
    telefone: '',
    audience: 'women',
  };
}
export function clearSession() {}