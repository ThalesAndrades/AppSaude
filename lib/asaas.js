function cfg() {
  const baseUrl = (process.env.ASAAS_BASE_URL || 'https://www.asaas.com/api/v3').replace(/\/$/, '');
  const apiKey = process.env.ASAAS_API_KEY;
  if (!apiKey) throw new Error('ASAAS_API_KEY ausente. Configure a chave da API Asaas.');
  return { baseUrl, apiKey };
}

async function api(path, { method = 'GET', body, query } = {}) {
  const { baseUrl, apiKey } = cfg();
  const url = new URL(baseUrl + path);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v));
    }
  }
  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      access_token: apiKey,
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = { raw: text }; }
  if (!res.ok) {
    const msg = data?.errors?.[0]?.description || data?.message || '';
    const err = new Error(msg || `Asaas ${method} ${path} falhou: ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export async function obterOuCriarCliente({ nome, email, cpf, telefone }) {
  const cpfLimpo = String(cpf || '').replace(/\D/g, '');
  const existing = await api('/customers', { query: { cpfCnpj: cpfLimpo, limit: 1 } });
  if (existing?.data?.length > 0) return existing.data[0];
  const telLimpo = String(telefone || '').replace(/\D/g, '');
  return api('/customers', {
    method: 'POST',
    body: {
      name: String(nome || '').trim(),
      email: String(email || '').toLowerCase().trim(),
      cpfCnpj: cpfLimpo,
      mobilePhone: telLimpo || undefined,
      notificationDisabled: true,
    },
  });
}

export async function criarCobrancaPix({ customerId, valorEmCentavos, descricao, referenceId }) {
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 1);
  const charge = await api('/payments', {
    method: 'POST',
    body: {
      customer: customerId,
      billingType: 'PIX',
      value: Number((valorEmCentavos / 100).toFixed(2)),
      dueDate: dueDate.toISOString().split('T')[0],
      description: descricao || 'Mettafit',
      externalReference: referenceId,
    },
  });
  let qr = null;
  try { qr = await api(`/payments/${charge.id}/pixQrCode`); } catch {}
  return {
    paymentId: charge.id,
    qrText: qr?.payload || null,
    qrImage: qr?.encodedImage ? `data:image/png;base64,${qr.encodedImage}` : null,
    expiresAt: qr?.expirationDate || null,
    status: charge.status,
  };
}

export async function criarCobrancaCartao({
  customerId, valorEmCentavos, descricao, referenceId,
  cartao, cliente, parcelas = 1,
}) {
  const telLimpo = String(cliente.telefone || '').replace(/\D/g, '');
  const cpfLimpo = String(cliente.cpf || '').replace(/\D/g, '');
  const cepLimpo = String(cartao.cep || '').replace(/\D/g, '').padEnd(8, '0').slice(0, 8);
  const exp = String(cartao.exp || '').trim();
  const expMatch = /^(\d{2})\s*\/\s*(\d{2,4})$/.exec(exp);
  if (!expMatch) throw new Error('Data de validade inválida. Use MM/AA.');
  const expiryMonth = expMatch[1];
  const expiryYear = expMatch[2].length === 2 ? `20${expMatch[2]}` : expMatch[2];
  return api('/payments', {
    method: 'POST',
    body: {
      customer: customerId,
      billingType: 'CREDIT_CARD',
      value: Number((valorEmCentavos / 100).toFixed(2)),
      dueDate: new Date().toISOString().split('T')[0],
      description: descricao || 'Mettafit',
      externalReference: referenceId,
      installmentCount: parcelas > 1 ? parcelas : undefined,
      installmentValue: parcelas > 1
        ? Number((valorEmCentavos / 100 / parcelas).toFixed(2))
        : undefined,
      creditCard: {
        holderName: String(cartao.name || '').trim(),
        number: String(cartao.number || '').replace(/\D/g, ''),
        expiryMonth,
        expiryYear,
        ccv: String(cartao.cvv || '').replace(/\D/g, ''),
      },
      creditCardHolderInfo: {
        name: String(cliente.nome || '').trim(),
        email: String(cliente.email || '').toLowerCase().trim(),
        cpfCnpj: cpfLimpo,
        postalCode: cepLimpo || '00000000',
        addressNumber: cartao.numero || '0',
        mobilePhone: telLimpo || undefined,
      },
    },
  });
}

export async function consultarPagamento(paymentId) {
  return api(`/payments/${encodeURIComponent(paymentId)}`);
}

export function statusPago(payment) {
  return payment?.status === 'CONFIRMED' || payment?.status === 'RECEIVED';
}
