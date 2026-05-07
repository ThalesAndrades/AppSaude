export async function obterOuCriarCliente() {
  return { id: 'mock_customer_123' };
}

export async function criarCobrancaPix() {
  return {
    paymentId: 'mock_payment_123',
    qrcode: 'mock_qrcode_base64',
    copiaECola: 'mock_copia_cola',
    status: 'PENDING',
  };
}

export async function criarCobrancaCartao() {
  return {
    id: 'mock_payment_123',
    status: 'CONFIRMED',
  };
}

export async function consultarPagamento() {
  return {
    id: 'mock_payment_123',
    status: 'CONFIRMED',
    externalReference: 'mf_demo_jornada_123456',
  };
}

export function statusPago(status) {
  return status === 'CONFIRMED' || status === 'RECEIVED';
}