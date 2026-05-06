export const PLANS = {
  imediata: {
    id: 'imediata',
    nome: 'Consulta Imediata Avulsa',
    preco: 4990,
    precoLabel: 'R$ 49,90',
    descricao: 'Atendimento por vídeo com clínico geral, sem agendamento.',
    beneficios: [
      'Consulta imediata por vídeo (24h)',
      'Atestado e prescrição digital quando aplicável',
      'Pagamento único, sem mensalidade',
    ],
    recorrente: false,
  },
  essencial: {
    id: 'essencial',
    nome: 'Plano Essencial',
    preco: 7990,
    precoLabel: 'R$ 79,90',
    descricao: 'Clínico geral 24h e agendamento com especialistas.',
    beneficios: [
      'Consultas ilimitadas com clínico geral',
      'Agendamento com médicos especialistas',
      'Atestados e prescrições digitais',
      'Histórico de atendimento',
    ],
    recorrente: true,
  },
};

export function getPlan(id) {
  return PLANS[id] || null;
}

export function listPlans() {
  return Object.values(PLANS);
}
