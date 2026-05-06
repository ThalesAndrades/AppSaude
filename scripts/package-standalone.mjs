import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';

const releaseDir = 'release';
const standaloneDir = '.next/standalone';
const staticDir = '.next/static';

if (!existsSync(standaloneDir)) {
  console.error('Build standalone nao encontrado. Rode "npm run build" antes de empacotar.');
  process.exit(1);
}

rmSync(releaseDir, { recursive: true, force: true });
mkdirSync(`${releaseDir}/.next`, { recursive: true });

cpSync(standaloneDir, releaseDir, { recursive: true });

if (existsSync(staticDir)) {
  cpSync(staticDir, `${releaseDir}/.next/static`, { recursive: true });
}

if (existsSync('public')) {
  cpSync('public', `${releaseDir}/public`, { recursive: true });
}

console.log(`Pacote standalone gerado em ${releaseDir}/`);
