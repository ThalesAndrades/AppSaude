export function dbCollections() {
  return Promise.resolve({
    users: { findOne: () => Promise.resolve(null), updateOne: () => Promise.resolve() },
    paymentOrders: { findOne: () => Promise.resolve(null), updateOne: () => Promise.resolve(), insertOne: () => Promise.resolve() },
    entitlements: { findOne: () => Promise.resolve(null), updateOne: () => Promise.resolve(), insertOne: () => Promise.resolve() },
    courseProgress: { findOne: () => Promise.resolve(null), updateOne: () => Promise.resolve(), insertOne: () => Promise.resolve() },
    webhookEvents: { insertOne: () => Promise.resolve() },
  });
}

export function ensureIndexes() {
  return Promise.resolve();
}