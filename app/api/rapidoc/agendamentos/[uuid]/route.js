import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { cancelarAgendamento } from '@/lib/rapidoc';

export async function DELETE(_req, { params }) {
  const sess = await getSession();
  if (!sess) return NextResponse.json({ erro: 'Não autenticado.' }, { status: 401 });

  const uuid = params?.uuid;
  if (!uuid) return NextResponse.json({ erro: 'UUID ausente.' }, { status: 400 });

  try {
    await cancelarAgendamento(uuid);
    return new NextResponse(null, { status: 204 });
  } catch (e) {
    return NextResponse.json(
      { erro: e?.userMessage || e?.data?.message || e?.message || 'Falha ao cancelar.' },
      { status: e?.status || 500 }
    );
  }
}

