import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getProduct } from '@/lib/products';
import {
  obterOuCriarCliente,
  criarCobrancaPix,
  criarCobrancaCartao,
  consultarPagamento,
  statusPago,
} from '@/lib/asaas';
import { dbCollections } from '@/lib/db';
import { ativarAcessoDoUsuario, marcarOrderAtivada } from '@/lib/grantAccess';

// GET /api/checkout?paymentId=... — polling de status Pix
export async function GET(req) {
  const sess = await getSession();
  if (!sess) return NextResponse.json({ erro: 'Não autenticado.' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const paymentId = searchParams.get('paymentId');
  if (!paymentId) return NextResponse.json({ erro: 'paymentId ausente' }, { status: 400 });

  try {
    const payment = await consultarPagamento(paymentId);

    if (!statusPago(payment)) {
      return NextResponse.json({ pago: false, status: payment?.status || 'PENDING' });
    }

    const { paymentOrders } = await dbCollections();
    const order = await paymentOrders.findOne({ asaasPaymentId: paymentId });

    if (order?.status === 'activated') {
      return NextResponse.json({ pago: true, ativado: true });
    }

    if (order) {
      const m = /^mf_([^_]+)_([^_]+)_/.exec(order.referenceId || '');
      const userId = order.userId || m?.[1];
      const productId = order.productId || m?.[2];
      if (userId && productId) {
        try {
          await ativarAcessoDoUsuario({
            userId,
            productId,
            provider: 'asaas',
            providerRef: `asaas:${paymentId}`,
            paymentId,
            referenceId: order.referenceId,
          });
          await marcarOrderAtivada({ filter: { asaasPaymentId: paymentId }, productId });
          return NextResponse.json({ pago: true, ativado: true });
        } catch (activErr) {
          return NextResponse.json({ pago: true, ativado: false, erro: activErr?.message });
        }
      }
    }

    return NextResponse.json({ pago: true, ativado: false });
  } catch (e) {
    return NextResponse.json({ pago: false, erro: e?.message });
  }
}

export async function POST(req) {
  const sess = await getSession();
  if (!sess) {
    return NextResponse.json({ erro: 'Faça login antes de pagar.' }, { status: 401 });
  }

  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ erro: 'JSON inválido' }, { status: 400 }); }

  const { productId, metodo, cartao } = body || {};
  const produto = getProduct(productId);
  if (!produto) return NextResponse.json({ erro: 'Produto inválido.' }, { status: 400 });
  if (!['pix', 'cartao'].includes(metodo)) return NextResponse.json({ erro: 'Método inválido.' }, { status: 400 });

  const referenceId = `mf_${sess.sub}_${produto.id}_${Date.now()}`;
  const cliente = {
    nome: sess.nome,
    email: sess.email,
    cpf: sess.cpf,
    telefone: sess.telefone,
  };

  let paymentOrders;
  try {
    ({ paymentOrders } = await dbCollections());
    await paymentOrders.insertOne({
      createdAt: new Date(),
      referenceId,
      userId: String(sess.sub),
      email: sess.email,
      cpf: sess.cpf,
      productId: produto.id,
      productNome: produto.nome,
      productTipo: produto.tipo,
      metodo,
      provider: 'asaas',
      status: 'created',
    });
  } catch {}

  try {
    const asaasCliente = await obterOuCriarCliente(cliente);
    const customerId = asaasCliente.id;

    if (metodo === 'pix') {
      const cobranca = await criarCobrancaPix({
        customerId,
        valorEmCentavos: produto.preco,
        descricao: produto.nome,
        referenceId,
      });

      try {
        if (paymentOrders) {
          await paymentOrders.updateOne(
            { referenceId },
            {
              $set: {
                updatedAt: new Date(),
                asaasPaymentId: cobranca.paymentId,
                asaasCustomerId: customerId,
                status: 'pending',
              },
            }
          );
        }
      } catch {}

      return NextResponse.json({
        paymentId: cobranca.paymentId,
        qrText: cobranca.qrText,
        qrImage: cobranca.qrImage,
      });
    }

    // Cartão
    if (!cartao?.number || !cartao?.name || !cartao?.exp || !cartao?.cvv) {
      return NextResponse.json({ erro: 'Dados do cartão incompletos.' }, { status: 400 });
    }

    const order = await criarCobrancaCartao({
      customerId,
      valorEmCentavos: produto.preco,
      descricao: produto.nome,
      referenceId,
      cartao,
      cliente,
      parcelas: cartao.parcelas || 1,
    });

    if (!statusPago(order) && order?.status !== 'AUTHORIZED') {
      try {
        if (paymentOrders) {
          await paymentOrders.updateOne(
            { referenceId },
            {
              $set: {
                updatedAt: new Date(),
                asaasPaymentId: order?.id,
                asaasCustomerId: customerId,
                status: 'refused',
                chargeStatus: order?.status,
              },
            }
          );
        }
      } catch {}
      return NextResponse.json(
        { erro: 'Pagamento recusado. Verifique os dados do cartão.' },
        { status: 402 }
      );
    }

    let ativado = false;
    try {
      await ativarAcessoDoUsuario({
        userId: sess.sub,
        productId: produto.id,
        provider: 'asaas',
        providerRef: `asaas:${order.id}`,
        paymentId: order.id,
        referenceId,
      });
      ativado = true;
    } catch {}

    try {
      if (paymentOrders) {
        await paymentOrders.updateOne(
          { referenceId },
          {
            $set: {
              updatedAt: new Date(),
              asaasPaymentId: order?.id,
              asaasCustomerId: customerId,
              status: ativado ? 'activated' : 'paid',
              chargeStatus: order?.status,
              ...(ativado ? { activationAt: new Date() } : {}),
            },
          }
        );
      }
    } catch {}

    return NextResponse.json({ paymentId: order.id, status: order.status });
  } catch (e) {
    try {
      if (!paymentOrders) ({ paymentOrders } = await dbCollections());
      await paymentOrders.updateOne(
        { referenceId },
        { $set: { updatedAt: new Date(), status: 'error', error: e?.message || 'erro' } }
      );
    } catch {}
    return NextResponse.json(
      { erro: e?.data?.errors?.[0]?.description || e?.message || 'Falha no pagamento.' },
      { status: e?.status || 500 }
    );
  }
}
