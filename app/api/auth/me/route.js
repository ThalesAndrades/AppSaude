import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/currentUser';

export async function GET() {
  const u = await getCurrentUser();
  if (!u) return NextResponse.json({ erro: 'Não autenticado' }, { status: 401 });
  return NextResponse.json({
    user: {
      sub: String(u._id),
      nome: u.nome,
      email: u.email,
      cpf: u.cpf,
      telefone: u.telefone,
      planoAtivo: u.planoAtivo || null,
      beneficiaryUuid: u.rapidocBeneficiaryUuid || null,
    },
  });
}
