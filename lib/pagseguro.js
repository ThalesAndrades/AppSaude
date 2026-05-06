/**
 * Cliente PagSeguro / PagBank — API de Orders.
 * Doc: https://dev.pagbank.uol.com.br/reference/charge
 *
 * Cobrança via cartão de crédito apenas. Pix é processado via Pix direto
 * (PSP), em `lib/pix.js`.
 */

function cfg() {
  const baseUrl = (process.env.PAGSEGURO_BASE_URL || 'https://api.pagseguro.com').replace(/\/$/, '');
  const token = process.env.PAGSEGURO_TOKEN;
  if (!token) {
    throw new Error('PAGSEGURO_TOKEN ausente. Configure o token PagBank.');
  }
  return { baseUrl, token };
}

async function api(path, { method = 'GET', body } = {}) {
  const { baseUrl, token } = cfg();
  const res = await fetch(baseUrl + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }
  if (!res.ok) {
    const err = new Error(
      `PagSeguro ${method} ${path} falhou: ${res.status} ${res.statusText}`
    );
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

function notificationUrl() {
  const site = process.env.NEXT_PUBLIC_SITE_URL || '';
  return site ? `${site.replace(/\/$/, '')}/api/webhooks/pagseguro` : undefined;
}

function buildCustomer({ nome, email, cpf, telefone }) {
  const customer = { name: nome, email };
  if (cpf) customer.tax_id = String(cpf).replace(/\D/g, '');
  if (telefone) {
    const digits = String(telefone).replace(/\D/g, '');
    if (digits.length >= 10) {
      customer.phones = [
        {
          country: '55',
          area: digits.slice(0, 2),
          number: digits.slice(2),
          type: 'MOBILE',
        },
      ];
    }
  }
  return customer;
}

export async function criarPedidoCartao({
  referenceId,
  cliente,
  valorEmCentavos,
  descricao,
  cartao,
  parcelas = 1,
  recorrente = false,
}) {
  if (!cartao?.encrypted) {
    throw new Error('Cartão criptografado (cartao.encrypted) é obrigatório.');
  }
  const body = {
    reference_id: referenceId,
    customer: buildCustomer(cliente),
    items: [
      {
        name: descricao,
        quantity: 1,
        unit_amount: valorEmCentavos,
      },
    ],
    notification_urls: [notificationUrl()].filter(Boolean),
    charges: [
      {
        reference_id: referenceId,
        description: descricao,
        amount: { value: valorEmCentavos, currency: 'BRL' },
        ...(recorrente ? { recurring: { type: 'INITIAL' } } : {}),
        payment_method: {
          type: 'CREDIT_CARD',
          installments: parcelas,
          capture: true,
          card: {
            encrypted: cartao.encrypted,
            holder: { name: cartao.holder },
            store: false,
          },
        },
      },
    ],
  };
  return api('/orders', { method: 'POST', body });
}

export async function consultarPedido(orderId) {
  return api(`/orders/${encodeURIComponent(orderId)}`);
}

export function statusPagoDoPedido(order) {
  if (!order) return false;
  const charges = order.charges || [];
  return charges.some((c) => c.status === 'PAID');
}
