const recommended = ['NEXT_PUBLIC_SITE_URL'];
const missing = recommended.filter((key) => !process.env[key]);

if (missing.length) {
  console.warn(`Variáveis recomendadas ausentes: ${missing.join(', ')}`);
}

console.log('Ambiente validado com sucesso.');
