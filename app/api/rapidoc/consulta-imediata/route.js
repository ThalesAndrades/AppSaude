import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/currentUser';
import { solicitarAtendimento } from '@/lib/rapidoc';

export async function POST() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ erro: 'Não autenticado.' }, { status: 401 });
  if (!user.rapidocBeneficiaryUuid) {
    return NextResponse.json(
      { erro: 'Plano não ativo. Conclua o pagamento para iniciar consultas.' },
      { status: 402 }
    );
  }

  try {
    const resp = await solicitarAtendimento(user.rapidocBeneficiaryUuid);
    const url = resp?.url || resp?.beneficiaryUrl || null;
    return NextResponse.json({ url, raw: resp });
  } catch (e) {
    return NextResponse.json(
      { erro: e?.userMessage || e?.data?.message || e?.message || 'Falha ao iniciar consulta.' },
      { status: e?.status || 500 }
    );
  }
}
