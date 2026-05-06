import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { ObjectId } from 'mongodb';
import { dbCollections } from '@/lib/db';

const KEY_LEN = 64;
const SCRYPT_N = 16384;

export function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const derived = scryptSync(String(password), salt, KEY_LEN, { N: SCRYPT_N });
  return `scrypt$${SCRYPT_N}$${salt}$${derived.toString('hex')}`;
}

export function verifyPassword(password, stored) {
  if (!stored || typeof stored !== 'string') return false;
  const parts = stored.split('$');
  if (parts.length !== 4 || parts[0] !== 'scrypt') return false;
  const N = Number(parts[1]);
  const salt = parts[2];
  const expected = Buffer.from(parts[3], 'hex');
  const derived = scryptSync(String(password), salt, expected.length, { N });
  if (derived.length !== expected.length) return false;
  return timingSafeEqual(derived, expected);
}

function normalizeEmail(email) {
  return String(email || '').toLowerCase().trim();
}

function normalizeDigits(value) {
  return String(value || '').replace(/\D/g, '');
}

function toObjectIdOrString(id) {
  if (id instanceof ObjectId) return id;
  if (typeof id === 'string' && ObjectId.isValid(id) && String(new ObjectId(id)) === id) {
    return new ObjectId(id);
  }
  return id;
}

export async function findUserByEmail(email) {
  const { users } = await dbCollections();
  return users.findOne({ email: normalizeEmail(email) });
}

export async function findUserById(id) {
  const { users } = await dbCollections();
  return users.findOne({ _id: toObjectIdOrString(id) });
}

export async function createUser({ nome, email, cpf, telefone, dataNascimento, senha }) {
  const { users } = await dbCollections();

  const doc = {
    nome: String(nome || '').trim(),
    email: normalizeEmail(email),
    cpf: normalizeDigits(cpf),
    telefone: normalizeDigits(telefone),
    dataNascimento, // YYYY-MM-DD
    senhaHash: hashPassword(senha),
    rapidocBeneficiaryUuid: null,
    planoAtivo: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const r = await users.insertOne(doc);
  return { ...doc, _id: r.insertedId };
}

export async function setBeneficiaryUuid(userId, uuid, planoId) {
  const { users } = await dbCollections();
  return users.updateOne(
    { _id: toObjectIdOrString(userId) },
    {
      $set: {
        rapidocBeneficiaryUuid: uuid,
        planoAtivo: planoId,
        updatedAt: new Date(),
      },
    }
  );
}
