import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/currentUser';
import { lerDisponibilidade, isoDateToBR } from '@/lib/rapidoc';

export async function GET(req) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ erro: 'Não autenticado.' }, { status: 401 });
  if (!user.rapidocBeneficiaryUuid) {
    return NextResponse.json(
      { erro: 'Plano não ativo.' },
      { status: 402 }
    );
  }

  const { searchParams } = new URL(req.url);
  const specialtyUuid = searchParams.get('specialtyUuid') || searchParams.get('especialidadeId');
  const dateInitialIso = searchParams.get('dateInitial') || searchParams.get('data');
  const dateFinalIso = searchParams.get('dateFinal') || dateInitialIso;

  if (!specialtyUuid || !dateInitialIso) {
    return NextResponse.json({ erro: 'Informe especialidade e data.' }, { status: 400 });
  }

  try {
    const lista = await lerDisponibilidade({
      specialtyUuid,
      dateInitial: isoDateToBR(dateInitialIso),
      dateFinal: isoDateToBR(dateFinalIso),
      beneficiaryUuid: user.rapidocBeneficiaryUuid,
    });
    const horarios = (Array.isArray(lista) ? lista : []).map((h) => ({
      uuid: h.uuid,
      data: h.date,
      from: h.from,
      to: h.to,
      label: `${h.date} ${h.from}–${h.to}`,
    }));
    return NextResponse.json({ horarios });
  } catch (e) {
    return NextResponse.json(
      { erro: e?.userMessage || e?.data?.message || e?.message || 'Falha ao listar horários.' },
      { status: e?.status || 500 }
    );
  }
}
