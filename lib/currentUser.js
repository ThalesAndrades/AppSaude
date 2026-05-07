export async function getCurrentUser() {
  return {
    _id: 'demo',
    nome: 'Demonstração',
    email: 'demo@mulheresemmovimento.local',
    cpf: '',
    telefone: '',
    audience: 'women',
    onboarding: { completedAt: new Date() },
  };
}