import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/currentUser';
import { listUserEntitlements } from '@/lib/entitlements';

export async function GET() {
  const u = await getCurrentUser();
  if (!u) return NextResponse.json({ erro: 'Não autenticado' }, { status: 401 });
  const entitlements = await listUserEntitlements(String(u._id)).catch(() => []);
  return NextResponse.json({
    user: {
      sub: String(u._id),
      nome: u.nome,
      email: u.email,
      cpf: u.cpf,
      telefone: u.telefone,
      audience: u.audience || null,
      onboardingCompletedAt: u.onboarding?.completedAt || null,
      entitlements: entitlements.map((e) => e.productId),
    },
  });
}
