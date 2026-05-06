import { ObjectId } from 'mongodb';
import { adicionarBeneficiario, mapPlanoToServiceConfig } from '@/lib/rapidoc';
import { dbCollections } from '@/lib/db';
import { setBeneficiaryUuid } from '@/lib/users';

/**
 * Ativa o plano do usuário criando o beneficiário na Rapidoc (se ainda
 * não existir) e marcando `planoAtivo`/`rapidocBeneficiaryUuid`.
 *
 * Idempotente: se o beneficiário já existe, apenas atualiza o plano.
 */
export async function ativarPlanoDoUsuario({ userId, planoId, providerRef }) {
  const { users, planActivations } = await dbCollections();

  let user = null;
  try {
    user = await users.findOne({ _id: new ObjectId(userId) });
  } catch {
    user = await users.findOne({ _id: userId });
  }
  if (!user) {
    const err = new Error('Usuário não encontrado.');
    err.status = 404;
    throw err;
  }

  let beneficiaryUuid = user.rapidocBeneficiaryUuid || null;
  let rapidocResp = null;

  if (!beneficiaryUuid) {
    const cfg = mapPlanoToServiceConfig(planoId);
    const benef = await adicionarBeneficiario({
      name: user.nome,
      cpf: user.cpf,
      birthday: user.dataNascimento,
      phone: user.telefone || undefined,
      email: user.email,
      paymentType: cfg.paymentType,
      serviceType: cfg.serviceType,
      general: `mettafit:${planoId}:${providerRef || ''}`,
    });
    beneficiaryUuid = benef?.uuid || null;
    rapidocResp = benef;
  }

  if (beneficiaryUuid) {
    await setBeneficiaryUuid(user._id, beneficiaryUuid, planoId);
  }

  try {
    await planActivations.insertOne({
      createdAt: new Date(),
      userId: String(user._id),
      planoId,
      providerRef: providerRef || null,
      beneficiaryUuid,
      rapidocResp,
    });
  } catch {}

  return { beneficiaryUuid, user };
}

export async function marcarOrderAtivada({ filter, beneficiaryUuid }) {
  const { paymentOrders } = await dbCollections();
  try {
    await paymentOrders.updateOne(filter, {
      $set: {
        updatedAt: new Date(),
        status: 'activated',
        activationAt: new Date(),
        beneficiaryUuid,
      },
    });
  } catch {}
}
