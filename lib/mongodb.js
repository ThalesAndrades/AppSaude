import { MongoClient } from 'mongodb';
import { sanitizeMongoUri, validateMongoUri } from './mongoUri.js';

const CLIENT_OPTIONS = {
  maxPoolSize: 20,
  minPoolSize: 0,
  serverSelectionTimeoutMS: 8000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
  retryWrites: true,
};

let clientPromise = globalThis.__metta_mongoClientPromise || null;

export function getMongoClient() {
  if (clientPromise) return clientPromise;

  const uri = process.env.MONGODB_URI;
  const check = validateMongoUri(uri);
  if (!check.ok) {
    const hint = check.hint ? ` Dica: ${check.hint}` : '';
    throw new Error(`MONGODB_URI invalida: ${check.error}${hint}`);
  }

  const client = new MongoClient(uri, CLIENT_OPTIONS);
  clientPromise = client.connect().catch((err) => {
    clientPromise = null;
    if (process.env.NODE_ENV !== 'production') {
      globalThis.__metta_mongoClientPromise = null;
    }
    const safeMessage = (err?.message || 'erro desconhecido').replace(uri, sanitizeMongoUri(uri));
    const wrapped = new Error(`Falha ao conectar no MongoDB: ${safeMessage}`);
    wrapped.cause = err;
    throw wrapped;
  });

  if (process.env.NODE_ENV !== 'production') {
    globalThis.__metta_mongoClientPromise = clientPromise;
  }

  return clientPromise;
}

export async function getMongoDb() {
  const client = await getMongoClient();
  const dbName = process.env.MONGODB_DB || 'mettafit';
  return client.db(dbName);
}

export async function pingMongoDb() {
  const db = await getMongoDb();
  const r = await db.command({ ping: 1 });
  return Boolean(r?.ok);
}
