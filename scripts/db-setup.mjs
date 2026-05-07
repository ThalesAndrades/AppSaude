#!/usr/bin/env node
/**
 * Garante todos os índices do MongoDB. Idempotente — safe para rodar
 * em todo deploy. Útil pra garantir que produção está com schema atualizado.
 *
 * Uso:
 *   MONGODB_URI=... npm run db:setup
 */
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'mettafit';

if (!uri) {
  console.error('MONGODB_URI ausente.');
  process.exit(1);
}

const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 8000,
  socketTimeoutMS: 30000,
});

try {
  console.log(`Conectando em ${dbName}…`);
  await client.connect();
  const db = client.db(dbName);

  const users = db.collection('users');
  const paymentOrders = db.collection('payment_orders');
  const webhookEvents = db.collection('webhook_events');
  const entitlements = db.collection('entitlements');
  const courseProgress = db.collection('course_progress');

  const created = await Promise.all([
    users.createIndex({ email: 1 }, { unique: true, name: 'uniq_email' }),
    users.createIndex(
      { cpf: 1 },
      {
        unique: true,
        name: 'uniq_cpf',
        partialFilterExpression: { cpf: { $type: 'string' } },
      }
    ),
    users.createIndex({ audience: 1 }, { name: 'audience' }),

    paymentOrders.createIndex(
      { referenceId: 1 },
      { unique: true, name: 'uniq_referenceId' }
    ),
    paymentOrders.createIndex({ orderId: 1 }, { name: 'orderId', sparse: true }),
    paymentOrders.createIndex({ txid: 1 }, { name: 'txid', sparse: true }),
    paymentOrders.createIndex(
      { userId: 1, createdAt: -1 },
      { name: 'user_recent' }
    ),

    entitlements.createIndex(
      { userId: 1, productId: 1 },
      { unique: true, name: 'uniq_user_product' }
    ),
    entitlements.createIndex(
      { userId: 1, activatedAt: -1 },
      { name: 'user_recent' }
    ),

    courseProgress.createIndex(
      { userId: 1, lessonId: 1 },
      { unique: true, name: 'uniq_user_lesson' }
    ),
    courseProgress.createIndex(
      { userId: 1, updatedAt: -1 },
      { name: 'user_recent' }
    ),

    webhookEvents.createIndex(
      { receivedAt: 1 },
      { name: 'ttl_90d', expireAfterSeconds: 60 * 60 * 24 * 90 }
    ),
    webhookEvents.createIndex(
      { provider: 1, receivedAt: -1 },
      { name: 'provider_recent' }
    ),
  ]);

  console.log(`✔ ${created.length} índices garantidos.`);
} catch (e) {
  console.error('Falha ao setar índices:', e?.message || e);
  process.exit(1);
} finally {
  await client.close();
}
