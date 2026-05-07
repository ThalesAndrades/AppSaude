import { NextResponse } from 'next/server';
import { consultarPagamento, statusPago } from '@/lib/asaas';
import { dbCollections } from '@/lib/db';
import { ativarAcessoDoUsuario, marcarOrderAtivada } from '@/lib/grantAccess';

const PAID_EVENTS = new Set(['PAYMENT_CONFIRMED', 'PAYMENT_RECEIVED']);

export async function POST(req) {
  // Asaas envia access_token no header para validação
  const headerToken = req.headers.get('asaas-access-token');
  const expected = process.env.ASAAS_API_KEY;
  if (expected && headerToken && headerToken !== expected) {
    return NextResponse.json({ erro: 'forbidden' }, { status: 403 });
  }

  let payload;
  try { payload = await req.json(); } catch { payload = null; }

  const event = payload?.event;
  const paymentId = payload?.payment?.id;

  try {
    const { webhookEvents } = await dbCollections();
    await webhookEvents.insertOne({
      provider: 'asaas',
      receivedAt: new Date(),
      event: event || null,
      paymentId: paymentId || null,
      payload,
    });
  } catch {}

  if (!PAID_EVENTS.has(event) || !paymentId) {
    return NextResponse.json({ ok: true });
  }

  try {
    const payment = await consultarPagamento(paymentId);
    if (!statusPago(payment)) return NextResponse.json({ ok: true });

    const ref = payment.externalReference || '';
    const m = /^mf_([^_]+)_([^_]+)_/.exec(ref);
    if (!m) return NextResponse.json({ ok: true });

    const [, userId, productId] = m;
    await ativarAcessoDoUsuario({
      userId,
      productId,
      provider: 'asaas',
      providerRef: `asaas:${paymentId}`,
      paymentId,
      referenceId: ref,
    });

    await marcarOrderAtivada({
      filter: { $or: [{ asaasPaymentId: paymentId }, { referenceId: ref }] },
      productId,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    try {
      const { webhookEvents } = await dbCollections();
      await webhookEvents.insertOne({
        provider: 'asaas',
        receivedAt: new Date(),
        paymentId,
        error: e?.message || 'erro',
      });
    } catch {}
    return NextResponse.json({ erro: e?.message || 'erro' }, { status: 500 });
  }
}
