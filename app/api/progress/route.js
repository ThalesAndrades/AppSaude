import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { markLessonCompleted } from '@/lib/progress';

export async function POST(req) {
  const sess = await getSession();
  if (!sess) return NextResponse.json({ erro: 'Não autenticado.' }, { status: 401 });

  let body;
  try { body = await req.json(); } catch { body = null; }

  const lessonId = body?.lessonId;
  if (!lessonId) return NextResponse.json({ erro: 'lessonId ausente.' }, { status: 400 });

  try {
    await markLessonCompleted(sess.sub, lessonId);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ erro: e?.message || 'erro' }, { status: 500 });
  }
}

