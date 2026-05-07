export const COURSES = {
  jornada: {
    id: 'jornada',
    nome: 'Jornada da Mulher Confiante',
    descricao: 'Uma trilha prática para clareza, rotina e autoconfiança — sem perfeccionismo.',
    modulos: [
      {
        id: 'm1',
        nome: 'Boas-vindas e Fundamentos',
        aulas: [
          {
            id: 'm1-a1',
            nome: 'Como usar a plataforma (em 7 minutos)',
            duracao: '07:12',
            videoEmbedUrl: null,
            texto: 'Você vai organizar sua evolução por passos pequenos. Assista, aplique e marque como concluído.',
          },
          {
            id: 'm1-a2',
            nome: 'O método: clareza → rotina → consistência',
            duracao: '12:40',
            videoEmbedUrl: null,
            texto: 'Aqui você entende a lógica do método e por que ele funciona na vida real: foco no essencial, sem culpa.',
          },
        ],
      },
      {
        id: 'm2',
        nome: 'Clareza sem ansiedade',
        aulas: [
          {
            id: 'm2-a1',
            nome: 'Mapa de prioridades (o que entra / o que sai)',
            duracao: '14:05',
            videoEmbedUrl: null,
            texto: 'Vamos escolher 1–2 prioridades reais. Sem lista infinita. Sem autoexigência.',
          },
          {
            id: 'm2-a2',
            nome: 'Decisão sem travar: seu critério pessoal',
            duracao: '10:18',
            videoEmbedUrl: null,
            texto: 'Você cria um critério simples para decidir com mais segurança e menos dúvida.',
          },
        ],
      },
      {
        id: 'm3',
        nome: 'Rotina que cabe na sua agenda',
        aulas: [
          {
            id: 'm3-a1',
            nome: 'Seu plano de 30 dias (passo a passo)',
            duracao: '16:22',
            videoEmbedUrl: null,
            texto: 'Você sai com um roteiro claro: o que fazer, quando fazer e como ajustar sem abandonar.',
          },
          {
            id: 'm3-a2',
            nome: 'Consistência sem culpa',
            duracao: '09:11',
            videoEmbedUrl: null,
            texto: 'Sem perfeição. Você aprende a manter o ritmo mesmo quando a semana aperta.',
          },
        ],
      },
    ],
  },
};

export function getCourse(courseId) {
  if (!courseId) return null;
  return COURSES[String(courseId)] || null;
}

export function listCourses() {
  return Object.values(COURSES);
}

export function getLesson(courseId, lessonId) {
  const course = getCourse(courseId);
  if (!course) return null;
  for (const m of course.modulos) {
    const aula = m.aulas.find((a) => a.id === lessonId);
    if (aula) return { course, modulo: m, aula };
  }
  return null;
}

export function firstLessonId(courseId) {
  const course = getCourse(courseId);
  const first = course?.modulos?.[0]?.aulas?.[0]?.id;
  return first || null;
}