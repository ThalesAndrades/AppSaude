import { redirect } from 'next/navigation';
import CoursePlayer from '@/components/CoursePlayer';
import { getCurrentUser } from '@/lib/currentUser';
import { listUserEntitlements } from '@/lib/entitlements';
import { getCourse, getLesson } from '@/lib/courses';
import { listProgressByLessonIds } from '@/lib/progress';

function canAccessCourse(courseId, entitlements) {
  const set = new Set(entitlements.map((e) => e.productId));
  if (courseId === 'jornada') return set.has('jornada') || set.has('bundle');
  return set.has(courseId);
}

export default async function AulaPage({ params }) {
  const courseId = params?.courseId;
  const lessonId = params?.lessonId;

  const user = await getCurrentUser();
  if (!user) redirect('/login?next=/minha-conta');

  const course = getCourse(courseId);
  if (!course) redirect('/minha-conta/biblioteca');

  const entitlements = await listUserEntitlements(String(user._id)).catch(() => []);
  if (!canAccessCourse(courseId, entitlements)) redirect('/planos');

  const found = getLesson(courseId, lessonId);
  if (!found) redirect(`/minha-conta/cursos/${encodeURIComponent(courseId)}`);

  const allLessonIds = course.modulos.flatMap((m) => m.aulas.map((a) => a.id));
  const progress = await listProgressByLessonIds(String(user._id), allLessonIds).catch(() => []);
  const completedLessonIds = progress.filter((p) => p.status === 'completed').map((p) => p.lessonId);

  return (
    <div className="space-y-6">
      <CoursePlayer
        courseId={courseId}
        courseName={course.nome}
        moduloId={found.modulo.id}
        lesson={found.aula}
        modulos={course.modulos}
        completedLessonIds={completedLessonIds}
      />
    </div>
  );
}

