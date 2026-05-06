import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/currentUser';
import {
  realizarAgendamento,
  lerConsultasDoBeneficiario,
  isEspecialidadePermitida,
} from '@/lib/rapidoc';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ erro: 'Não autenticado.' }, { status: 401 });
  if (!user.rapidocBeneficiaryUuid) {
    return NextResponse.json({ agendamentos: [] });
  }

  try {
    const lista = await lerConsultasDoBeneficiario(user.rapidocBeneficiaryUuid);
    const agendamentos = (Array.isArray(lista) ? lista : []).map((a) => ({
      uuid: a.uuid,
      especialidade: a.specialty?.name || '',
      especialidadeUuid: a.specialty?.uuid,
      status: a.status,
      profissional: a.professional?.name || '',
      data: a.detail?.date || '',
      from: a.detail?.from || '',
      to: a.detail?.to || '',
      label: a.detail ? `${a.detail.date} ${a.detail.from}–${a.detail.to}` : '',
      url: a.beneficiaryUrl || '',
    }));
    return NextResponse.json({ agendamentos });
  } catch (e) {
    return NextResponse.json(
      { erro: e?.userMessage || e?.data?.message || e?.message || 'Falha ao listar agendamentos.' },
      { status: e?.status || 500 }
    );
  }
}

export async function POST(req) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ erro: 'Não autenticado.' }, { status: 401 });
  if (!user.rapidocBeneficiaryUuid) {
    return NextResponse.json(
      { erro: 'Plano não ativo. Conclua o pagamento para agendar.' },
      { status: 402 }
    );
  }

  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ erro: 'JSON inválido' }, { status: 400 }); }

  const {
    specialtyUuid,
    availabilityUuid,
    beneficiaryMedicalReferralUuid,
    especialidadeNome,
  } = body || {};

  if (!specialtyUuid || !availabilityUuid) {
    return NextResponse.json({ erro: 'Informe especialidade e horário.' }, { status: 400 });
  }
  if (especialidadeNome && !isEspecialidadePermitida(especialidadeNome)) {
    return NextResponse.json(
      { erro: 'Esta especialidade não está disponível no momento.' },
      { status: 400 }
    );
  }

  try {
    const ag = await realizarAgendamento({
      beneficiaryUuid: user.rapidocBeneficiaryUuid,
      specialtyUuid,
      availabilityUuid,
      beneficiaryMedicalReferralUuid,
      approveAdditionalPayment: true,
    });
    return NextResponse.json({
      uuid: ag?.uuid,
      especialidade: ag?.specialty?.name,
      data: ag?.detail?.date,
      from: ag?.detail?.from,
      to: ag?.detail?.to,
      url: ag?.beneficiaryUrl,
      status: ag?.status,
    });
  } catch (e) {
    return NextResponse.json(
      { erro: e?.userMessage || e?.data?.message || e?.message || 'Falha ao agendar.' },
      { status: e?.status || 500 }
    );
  }
}
