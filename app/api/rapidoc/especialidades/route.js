import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { lerEspecialidades, isEspecialidadePermitida } from '@/lib/rapidoc';

export async function GET() {
  const sess = await getSession();
  if (!sess) return NextResponse.json({ erro: 'Não autenticado.' }, { status: 401 });

  try {
    const data = await lerEspecialidades();
    const lista = Array.isArray(data) ? data : [];
    const filtrada = lista
      .filter((e) => isEspecialidadePermitida(e?.name))
      .map((e) => ({ uuid: e.uuid, nome: e.name }));
    return NextResponse.json({ especialidades: filtrada });
  } catch (e) {
    return NextResponse.json(
      { erro: e?.userMessage || e?.data?.message || e?.message || 'Falha ao listar especialidades.' },
      { status: e?.status || 500 }
    );
  }
}
