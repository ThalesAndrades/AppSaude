export const client = { db: () => ({}) };
export const db = client.db();

export async function pingMongoDb() {
  return true;
}
