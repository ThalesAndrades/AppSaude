import { getMongoDb } from '@/lib/mongodb';

const COLLECTIONS = {
  users: 'users',
  paymentOrders: 'payment_orders',
  webhookEvents: 'webhook_events',
  planActivations: 'plan_activations',
};

let indexesPromise = null;

/**
 * Cria/garante todos os índices necessários. É idempotente; o MongoDB
 * ignora chamadas redundantes. Cacheia a Promise para que cada processo
 * Node execute essa rotina apenas uma vez.
 *
 * Chame de qualquer entry-point onde a primeira leitura/escrita acontece
 * (ex: `dbCollections()` invoca isso por baixo).
 */
export function ensureIndexes() {
  if (indexesPromise) return indexesPromise;
  indexesPromise = (async () => {
    const db = await getMongoDb();

    const users = db.collection(COLLECTIONS.users);
    const paymentOrders = db.collection(COLLECTIONS.paymentOrders);
    const webhookEvents = db.collection(COLLECTIONS.webhookEvents);
    const planActivations = db.collection(COLLECTIONS.planActivations);

    await Promise.all([
      // users: lookup por email, cpf; lookup por beneficiaryUuid
      users.createIndex({ email: 1 }, { unique: true, name: 'uniq_email' }),
      users.createIndex(
        { cpf: 1 },
        {
          unique: true,
          name: 'uniq_cpf',
          partialFilterExpression: { cpf: { $type: 'string' } },
        }
      ),
      users.createIndex(
        { rapidocBeneficiaryUuid: 1 },
        {
          name: 'rapidoc_beneficiary',
          sparse: true,
        }
      ),

      // paymentOrders: webhooks buscam por referenceId / asaasPaymentId
      paymentOrders.createIndex(
        { referenceId: 1 },
        { unique: true, name: 'uniq_referenceId' }
      ),
      paymentOrders.createIndex(
        { asaasPaymentId: 1 },
        { name: 'asaasPaymentId', sparse: true }
      ),
      paymentOrders.createIndex(
        { userId: 1, createdAt: -1 },
        { name: 'user_recent' }
      ),

      // planActivations: histórico
      planActivations.createIndex(
        { userId: 1, createdAt: -1 },
        { name: 'user_recent' }
      ),
      planActivations.createIndex(
        { beneficiaryUuid: 1 },
        { name: 'beneficiaryUuid', sparse: true }
      ),

      // webhookEvents: TTL de 90 dias para não inchar a coleção
      webhookEvents.createIndex(
        { receivedAt: 1 },
        { name: 'ttl_90d', expireAfterSeconds: 60 * 60 * 24 * 90 }
      ),
      webhookEvents.createIndex(
        { provider: 1, receivedAt: -1 },
        { name: 'provider_recent' }
      ),
    ]);

    return true;
  })().catch((e) => {
    // Em caso de falha, limpa o cache pra próxima chamada poder tentar
    // novamente (ex: race condition na primeira requisição).
    indexesPromise = null;
    throw e;
  });

  return indexesPromise;
}

export async function dbCollections() {
  const db = await getMongoDb();
  // Dispara em background no primeiro acesso; não bloqueia a request,
  // mas garante que rode pelo menos uma vez por processo.
  ensureIndexes().catch(() => {});
  return {
    users: db.collection(COLLECTIONS.users),
    paymentOrders: db.collection(COLLECTIONS.paymentOrders),
    webhookEvents: db.collection(COLLECTIONS.webhookEvents),
    planActivations: db.collection(COLLECTIONS.planActivations),
  };
}
