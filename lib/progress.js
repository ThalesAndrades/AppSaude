export async function listProgressByLessonIds() {
  return [
    { lessonId: 'm1-a1', status: 'completed', updatedAt: new Date() },
    { lessonId: 'm1-a2', status: 'completed', updatedAt: new Date() },
  ];
}

export async function markLessonCompleted() {
  return true;
}