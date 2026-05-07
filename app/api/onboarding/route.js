import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { completeOnboarding } from '@/lib/users';

export async function POST(req) {
  const sess = await getSession();
  if (!sess) return NextResponse.json({ erro: 'Não autenticado.' }, { status: 401 });

  let body;
  try { body = await req.json(); } catch { body = null; }

  const objetivo = body?.objetivo || null;
  const nivel = body?.nivel || null;

  try {
    await completeOnboarding(sess.sub, { objetivo, nivel });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ erro: e?.message || 'erro' }, { status: 500 });
  }
}

