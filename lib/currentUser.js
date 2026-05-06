import { ObjectId } from 'mongodb';
import { getSession } from '@/lib/auth';
import { dbCollections } from '@/lib/db';

export async function getCurrentUser() {
  const sess = await getSession();
  if (!sess?.sub) return null;
  const { users } = await dbCollections();

  const sub = String(sess.sub);
  const _id =
    ObjectId.isValid(sub) && String(new ObjectId(sub)) === sub
      ? new ObjectId(sub)
      : sub;

  return users.findOne({ _id });
}
