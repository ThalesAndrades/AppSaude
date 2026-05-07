import { NextResponse } from 'next/server';
import { createSession } from '@/lib/auth';
import { findUserByEmail, verifyPassword } from '@/lib/users';

export async function POST(req) {
  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ erro: 'JSON inválido' }, { status: 400 }); }
  const { email, senha } = body || {};
  if (!email || !senha) return NextResponse.json({ erro: 'Informe e-mail e senha.' }, { status: 400 });

  try {
    const user = await findUserByEmail(email);
    if (!user || !verifyPassword(senha, user.senhaHash)) {
      return NextResponse.json({ erro: 'E-mail ou senha incorretos.' }, { status: 401 });
    }
    if (user.audience !== 'women') {
      return NextResponse.json(
        { erro: 'Este acesso é exclusivo para mulheres.' },
        { status: 403 }
      );
    }

    await createSession({
      sub: String(user._id),
      nome: user.nome || '',
      email: user.email,
      cpf: user.cpf || '',
      telefone: user.telefone || '',
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { erro: e?.message || 'Falha ao entrar.' },
      { status: 500 }
    );
  }
}
