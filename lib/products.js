export const PRODUCTS = {
  // LIVROS
  livro1: {
    id: 'livro1',
    slug: 'livro1',
    tipo: 'livro',
    nome: 'Mulheres que Correm com os Lobos',
    headline: 'Releitura moderna dos arquétipos femininos.',
    preco: 8900,
    precoLabel: 'R$ 89',
    parcelamentoLabel: 'ou 3× sem juros',
    destaque: true,
    promise: 'Uma jornada simbólica para reconectar com sua essência.',
    includes: [
      'Edição especial com capítulos extras',
      'Guia de leitura exclusivo',
      'Acesso à comunidade de leitura',
      'Workbook de reflexões',
    ],
    outcomes: [
      'Reconexão com sua intuição',
      'Empoderamento pessoal',
      'Comunidade de apoio',
      'Transformação interior',
    ],
  },
  livro2: {
    id: 'livro2',
    slug: 'livro2',
    tipo: 'livro',
    nome: 'O Poder da Ação',
    headline: 'Transforme seus sonhos em realidade.',
    preco: 7900,
    precoLabel: 'R$ 79',
    parcelamentoLabel: 'ou 3× sem juros',
    destaque: false,
    promise: 'Metodologia prática para alcançar seus objetivos.',
    includes: [
      'Livro físico com capa dura',
      'Planner anual digital',
      'Vídeos motivacionais',
      'Acesso ao grupo exclusivo',
    ],
    outcomes: [
      'Clareza de propósito',
      'Ação consistente',
      'Resultados mensuráveis',
      'Autoconfiança renovada',
    ],
  },
  // DIGITAL
  digital1: {
    id: 'digital1',
    slug: 'digital1',
    tipo: 'digital',
    nome: 'Despertar Feminino',
    headline: 'Programa de 21 dias para reconectar com sua essência.',
    preco: 29700,
    precoLabel: 'R$ 297',
    parcelamentoLabel: 'ou 12× sem juros',
    destaque: true,
    promise: 'Transforme sua relação consigo mesma em 21 dias.',
    includes: [
      '21 vídeos guiados',
      'Meditações diárias',
      'Jornal de transformação',
      'Suporte via WhatsApp',
    ],
    outcomes: [
      'Autoestima elevada',
      'Conexão interior',
      'Paz mental',
      'Empoderamento real',
    ],
  },
  digital2: {
    id: 'digital2',
    slug: 'digital2',
    tipo: 'digital',
    nome: 'Círculo de Mulheres',
    headline: 'Comunidade online de apoio e crescimento.',
    preco: 9700,
    precoLabel: 'R$ 97',
    parcelamentoLabel: 'ou 3× sem juros',
    destaque: false,
    promise: 'Encontre sua tribu e cresça juntas.',
    includes: [
      'Acesso vitalício ao grupo',
      'Encontros mensais ao vivo',
      'Biblioteca de recursos',
      'Descontos em eventos',
    ],
    outcomes: [
      'Rede de apoio',
      'Networking autêntico',
      'Aprendizado colaborativo',
      'Amizades verdadeiras',
    ],
  },
  // EVENTOS
  evento1: {
    id: 'evento1',
    slug: 'evento1',
    tipo: 'evento',
    nome: 'Retiro de Inverno',
    headline: 'Fim de semana de imersão e transformação.',
    preco: 129700,
    precoLabel: 'R$ 1.297',
    parcelamentoLabel: 'ou 12× sem juros',
    destaque: true,
    promise: 'Desconecte para reconectar com sua essência.',
    includes: [
      'Alojamento compartilhado',
      'Todas as refeições',
      'Workshops exclusivos',
      'Materiais didáticos',
    ],
    outcomes: [
      'Renovação interior',
      'Conexões profundas',
      'Clareza de propósito',
      'Energia renovada',
    ],
  },
  evento2: {
    id: 'evento2',
    slug: 'evento2',
    tipo: 'evento',
    nome: 'Workshop de Dança Circular',
    headline: 'Libere seu corpo e sua energia feminina.',
    preco: 29700,
    precoLabel: 'R$ 297',
    parcelamentoLabel: 'ou 6× sem juros',
    destaque: false,
    promise: 'Dance sua verdade e libere bloqueios.',
    includes: [
      'Aula de 4 horas',
      'Meditação ativa',
      'Roda de compartilhamento',
      'Manual de práticas',
    ],
    outcomes: [
      'Liberação emocional',
      'Conexão corporal',
      'Alegria espontânea',
      'Energia vitalizada',
    ],
  },
  // VIAGENS
  viagem1: {
    id: 'viagem1',
    slug: 'viagem1',
    tipo: 'viagem',
    nome: 'Viagem à Índia Sagrada',
    headline: 'Peregrinação espiritual pelos lugares mais sagrados.',
    preco: 0,
    precoLabel: 'Sob consulta',
    parcelamentoLabel: 'Consulte condições',
    destaque: true,
    promise: 'Transformação profunda em terras sagradas.',
    includes: [
      'Guiamento espiritual',
      'Acomodação especial',
      'Refeições vegetarianas',
      'Transporte local',
    ],
    outcomes: [
      'Iluminação interior',
      'Conexão com o divino',
      'Renovação completa',
      'Memórias inesquecíveis',
    ],
    exclusivo: true,
  },
  viagem2: {
    id: 'viagem2',
    slug: 'viagem2',
    tipo: 'viagem',
    nome: 'Cruzeiro pelo Mediterrâneo',
    headline: 'Navegue pelos mares da sabedoria antiga.',
    preco: 0,
    precoLabel: 'Sob consulta',
    parcelamentoLabel: 'Consulte condições',
    destaque: false,
    promise: 'Uma jornada de descoberta e conexão.',
    includes: [
      'Cabine privativa',
      'Todas as refeições',
      'Workshops a bordo',
      'Excursões guiadas',
    ],
    outcomes: [
      'Expansão de consciência',
      'Novas perspectivas',
      'Conexões profundas',
      'Rejuvenescimento',
    ],
    exclusivo: true,
  },
};

export function listProducts() {
  return Object.values(PRODUCTS);
}

export function getProduct(idOrSlug) {
  if (!idOrSlug) return null;
  const key = String(idOrSlug);
  if (PRODUCTS[key]) return PRODUCTS[key];
  return (
    Object.values(PRODUCTS).find((p) => p.slug === key) ||
    Object.values(PRODUCTS).find((p) => p.id === key) ||
    null
  );
}

export function listProductsBySegment(segment) {
  return Object.values(PRODUCTS).filter((p) => p.tipo === segment);
}

export function getSegments() {
  return [
    { id: 'livros', nome: 'Livros', descricao: 'Literatura empoderadora' },
    { id: 'digital', nome: 'Digital', descricao: 'Conteúdo online e comunidades' },
    { id: 'eventos', nome: 'Eventos', descricao: 'Encontros presenciais' },
    { id: 'viagem', nome: 'Viagens em Movimento', descricao: 'Experiências únicas pelo mundo' },
  ];
}