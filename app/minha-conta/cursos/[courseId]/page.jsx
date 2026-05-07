import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/currentUser';
import { listUserEntitlements } from '@/lib/entitlements';
import { getCourse } from '@/lib/courses';
import { listProgressByLessonIds } from '@/lib/progress';

function canAccessCourse(courseId, entitlements) {
  const set = new Set(entitlements.map((e) => e.productId));
  if (courseId === 'jornada') return set.has('jornada') || set.has('bundle');
  return set.has(courseId);
}

export default async function CursoEntryPage({ params }) {
  const courseId = params?.courseId;
  const user = await getCurrentUser();
  if (!user) redirect('/login?next=/minha-conta');

  const course = getCourse(courseId);
  if (!course) redirect('/minha-conta/biblioteca');

  const entitlements = await listUserEntitlements(String(user._id)).catch(() => []);
  if (!canAccessCourse(courseId, entitlements)) redirect('/planos');

  const lessonIds = course.modulos.flatMap((m) => m.aulas.map((a) => a.id));
  const progress = await listProgressByLessonIds(String(user._id), lessonIds).catch(() => []);
  const completed = new Set(progress.filter((p) => p.status === 'completed').map((p) => p.lessonId));

  const nextLessonId =
    lessonIds.find((id) => !completed.has(id)) || lessonIds[lessonIds.length - 1];

  redirect(`/minha-conta/cursos/${encodeURIComponent(courseId)}/aula/${encodeURIComponent(nextLessonId)}`);
}

