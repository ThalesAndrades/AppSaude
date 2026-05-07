import { validateMongoUri } from '../lib/mongoUri.js';

const required = [
  ['NEXT_PUBLIC_SITE_URL'],
  ['SESSION_SECRET'],
  ['ASAAS_API_KEY'],
  ['MONGODB_URI'],
];

const missing = required.filter((group) => !group.some((key) => process.env[key]));

if (missing.length) {
  console.error(`Variaveis ausentes: ${missing.map((group) => group.join(' ou ')).join(', ')}`);
  process.exit(1);
}

if (String(process.env.SESSION_SECRET).length < 32) {
  console.error('SESSION_SECRET precisa ter ao menos 32 caracteres.');
  process.exit(1);
}

const mongoCheck = validateMongoUri(process.env.MONGODB_URI);
if (!mongoCheck.ok) {
  console.error(`MONGODB_URI invalida: ${mongoCheck.error}`);
  if (mongoCheck.hint) console.error(`Dica: ${mongoCheck.hint}`);
  process.exit(1);
}

console.log('Ambiente validado com sucesso.');
