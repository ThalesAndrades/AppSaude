import { NextResponse } from 'next/server';
import { createSession } from '@/lib/auth';
import { createUser, findUserByEmail } from '@/lib/users';

export async function POST(req) {
  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ erro: 'JSON inválido' }, { status: 400 }); }

  const { nome, email, cpf, telefone, dataNascimento, senha, souMulher } = body || {};
  if (!nome || !email || !cpf || !telefone || !senha) {
    return NextResponse.json({ erro: 'Preencha todos os campos.' }, { status: 400 });
  }
  if (souMulher !== true) {
    return NextResponse.json(
      { erro: 'Esta plataforma é exclusiva para mulheres. Confirme para continuar.' },
      { status: 400 }
    );
  }
  if (String(senha).length < 8) {
    return NextResponse.json({ erro: 'Senha deve ter ao menos 8 caracteres.' }, { status: 400 });
  }

  const cpfLimpo = String(cpf).replace(/\D/g, '');
  const telLimpo = String(telefone).replace(/\D/g, '');
  const emailNorm = String(email).toLowerCase().trim();

  try {
    const existente = await findUserByEmail(emailNorm);
    if (existente) {
      return NextResponse.json({ erro: 'E-mail já cadastrado.' }, { status: 409 });
    }

    const user = await createUser({
      nome,
      email: emailNorm,
      cpf: cpfLimpo,
      telefone: telLimpo,
      dataNascimento,
      senha,
    });

    await createSession({
      sub: String(user._id),
      nome: user.nome,
      email: user.email,
      cpf: user.cpf,
      telefone: user.telefone,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e?.code === 11000) {
      return NextResponse.json({ erro: 'E-mail ou CPF já cadastrado.' }, { status: 409 });
    }
    return NextResponse.json(
      { erro: e?.message || 'Falha ao criar conta.' },
      { status: 500 }
    );
  }
}
