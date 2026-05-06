# mettafit

Aplicação web em **Next.js (App Router) + JavaScript** para a plataforma de
saúde digital **mettafit.site**, integrando a API da **Rapidoc Telemedicina**
(consultas e agendamentos) e o **PagSeguro / PagBank** (cobrança via cartão
e Pix).

## Funcionalidades

- Landing page e listagem de planos.
- Cadastro e login de paciente (sessão por cookie HttpOnly + JWT).
- **2 planos** disponíveis (sem psicólogos / nutricionistas):
  - **Consulta imediata avulsa** — R$ 49,90.
  - **Plano Essencial** (clínico geral 24h + agendamento com especialistas) — R$ 79,90/mês.
- Checkout com **Pix** (QR Code + copia-e-cola) e **cartão de crédito**.
- Webhook PagSeguro que confirma o pagamento e ativa o plano na Rapidoc.
- Painel "Minha conta":
  - Iniciar consulta imediata por vídeo.
  - Listar especialidades, buscar horários e agendar.
  - Listar agendamentos do paciente.

> A interface é exclusivamente para usuário final — **não há rotas
> administrativas**.

## Stack

- Next.js 14 (App Router) + React 18
- Tailwind CSS
- `jose` (JWT)
- API Rapidoc + API PagSeguro (PagBank)

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha:

| Variável | Descrição |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://mettafit.site` |
| `SESSION_SECRET` | Segredo (32+ caracteres) usado para assinar a sessão |
| `RAPIDOC_BASE_URL` | URL base da API Rapidoc |
| `RAPIDOC_API_KEY` | Token Bearer da Rapidoc |
| `RAPIDOC_PARTNER_ID` | (opcional) ID do parceiro |
| `RAPIDOC_URL` | alias aceito para `RAPIDOC_BASE_URL` em producao |
| `RAPIDOC_TOKEN` | alias aceito para `RAPIDOC_API_KEY` em producao |
| `CLIENTID` | alias aceito para `RAPIDOC_PARTNER_ID` |
| `PAGSEGURO_BASE_URL` | `https://api.pagseguro.com` |
| `PAGSEGURO_TOKEN` | Token da conta PagBank |
| `PAGSEGURO_NOTIFICATION_TOKEN` | Token usado para validar o webhook |
| `NEXT_PUBLIC_PAGBANK_PUBLIC_KEY` | Chave publica PagBank para criptografar cartao no navegador |
| `MONGODB_URI` | String de conexao MongoDB Atlas |
| `MONGODB_DB` | Nome do banco (default: mettafit) |

> O cliente Rapidoc (`lib/rapidoc.js`) usa **paths convencionais** (`/pacientes`,
> `/auth/login`, `/consultas/imediatas`, `/agendamentos`...). Ajuste os paths
> conforme a [documentação oficial][docs] da sua conta.

[docs]: https://documenter.getpostman.com/view/17451655/U16onhqm

## Desenvolvimento local

```bash
npm install
cp .env.example .env.local   # preencha as variáveis
npm run dev
```

Abra http://localhost:3000

## Build de produção

```bash
npm run build
npm run start                # respeita PORT (default: 3000)
```

## Deploy no Hostinger (Node.js)

A Hostinger oferece o painel **"Setup Node.js App"** (hPanel → Avançado).

1. **Faça upload do projeto** (ou clone via Git) para uma pasta dentro de
   `~/domains/mettafit.site/` — por exemplo, `~/domains/mettafit.site/app`.
2. No hPanel, abra **Setup Node.js App** e crie uma nova aplicação:
   - **Node.js version**: 18 ou superior
   - **Application root**: caminho do projeto
   - **Application URL**: `mettafit.site`
   - **Application startup file**: `node_modules/next/dist/bin/next` *ou* use
     `npm start` (ver passo 4).
3. Adicione todas as variáveis de ambiente listadas acima no painel.
4. Pelo SSH (ou pelo botão "Run NPM Install"):
   ```bash
   npm install
   npm run build
   ```
5. Defina o comando de inicialização para `npm run start`. A porta exposta
   pelo Passenger é entregue via `process.env.PORT` — o script `start` já
   respeita essa variável.
6. Aponte o domínio `mettafit.site` para a aplicação Node criada e habilite o
   SSL gratuito (Let's Encrypt) no painel.

### Sincronizacao com `main`

O repositório agora possui automacao em `.github/workflows/deploy-production.yml`.
Cada `push` em `main` faz:

1. `npm ci`
2. validacao de variaveis obrigatorias
3. `npm run lint`
4. `npm run build`
5. empacotamento do build `standalone`
6. upload para a Hostinger via SSH
7. troca do release ativo por symlink em `current`
8. restart da app com `tmp/restart.txt`

### Segredos do GitHub Actions

Cadastre estes secrets no repositorio:

- `NEXT_PUBLIC_SITE_URL`
- `SESSION_SECRET`
- `RAPIDOC_BASE_URL` ou `RAPIDOC_URL`
- `RAPIDOC_API_KEY` ou `RAPIDOC_TOKEN`
- `CLIENTID` (opcional, se sua conta exigir partner id)
- `PAGSEGURO_TOKEN`
- `PAGSEGURO_NOTIFICATION_TOKEN`
- `NEXT_PUBLIC_PAGBANK_PUBLIC_KEY`
- `MONGODB_URI`
- `MONGODB_DB` (opcional)
- `HOSTINGER_HOST`
- `HOSTINGER_PORT`
- `HOSTINGER_USER`
- `HOSTINGER_SSH_KEY`
- `HOSTINGER_DEPLOY_PATH`
- `PRODUCTION_HEALTHCHECK_URL` (opcional)

### Setup da Hostinger para deploy automatizado

No **Setup Node.js App**, configure:

- **Application root**: pasta `current` dentro de `HOSTINGER_DEPLOY_PATH`
- **Application startup file**: `server.js`
- **Node.js version**: 18 ou superior

Se o painel da Hostinger ja estiver com `RAPIDOC_URL`, `RAPIDOC_TOKEN` e
`CLIENTID`, o app agora aceita esses nomes sem precisar renomear as chaves.

Para pagamento com cartao (avulso ou plano), configure tambem `NEXT_PUBLIC_PAGBANK_PUBLIC_KEY`.

Estrutura esperada no servidor:

```text
<HOSTINGER_DEPLOY_PATH>/
  current -> releases/<commit-sha>
  releases/
  shared/
```

### Rollback

Para voltar ao release anterior, aponte o symlink `current` para a pasta desejada
em `releases/` e toque novamente `current/tmp/restart.txt`.

### Webhook do PagSeguro

No painel PagBank, cadastre a URL de notificação:

```
https://mettafit.site/api/webhooks/pagseguro
```

Defina o mesmo segredo em `PAGSEGURO_NOTIFICATION_TOKEN`.

## Estrutura

```
app/
  page.jsx                    # landing
  planos/page.jsx             # planos
  cadastro/, login/           # auth
  checkout/[plano]/           # checkout (Pix / cartão)
  minha-conta/                # área logada
  api/
    auth/                     # cadastro, login, logout, me
    checkout/                 # POST cria pedido (Pix/cartão); GET ?txid= polling
    health/                   # healthcheck (ping MongoDB)
    webhooks/pagseguro/       # confirmação de pagamento (cartão)
    webhooks/pix/             # confirmação de pagamento (Pix direto)
    rapidoc/                  # proxy autenticado p/ Rapidoc
components/                   # Header, Footer, PlanCard, Theme/Mobile menus
lib/
  plans.js                    # definição dos 2 planos
  auth.js                     # sessão JWT em cookie
  rapidoc.js                  # cliente Rapidoc
  pagseguro.js                # cliente PagBank (cartão)
  pix.js                      # cliente Pix direto (BCB)
  activatePlan.js             # ativação idempotente do plano
  db.js, mongodb.js           # MongoDB
```

## Próximos passos sugeridos

- Integrar o **SDK público do PagBank** no front para criptografar o cartão
  antes de enviar ao backend (atualmente o backend exige `cartao.encrypted`).
- Confirmar com a Rapidoc os paths exatos dos endpoints e ajustar
  `lib/rapidoc.js`.
- Adicionar páginas de Termos e Política de Privacidade.
- Persistir histórico de pagamentos local (MySQL na Hostinger) para
  reconciliação.
