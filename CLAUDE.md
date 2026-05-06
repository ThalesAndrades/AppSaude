# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**mettafit** is a Next.js 14 (App Router) digital health platform at mettafit.site. It sells two telemedicine plans, handles payment via PagSeguro/PagBank (credit card) and Pix (PSP direct), and activates access through the Rapidoc Telemedicina API.

## Commands

```bash
npm install              # install dependencies
npm run dev              # local dev server at http://localhost:3000
npm run build            # production build (standalone output)
npm run start            # start production server (respects $PORT)
npm run lint             # ESLint via next lint
npm run verify:env       # validate required env vars
npm run db:setup         # create MongoDB indexes
```

No test framework is configured — there are no unit/integration test commands.

## Environment Setup

Copy `.env.example` to `.env.local`. Required variables:

| Variable | Purpose |
|---|---|
| `SESSION_SECRET` | 32+ char secret for JWT signing |
| `RAPIDOC_BASE_URL` / `RAPIDOC_URL` | Rapidoc API base URL |
| `RAPIDOC_API_KEY` / `RAPIDOC_TOKEN` | Rapidoc Bearer token |
| `RAPIDOC_PARTNER_ID` / `CLIENTID` | Rapidoc partner ID |
| `PAGSEGURO_TOKEN` | PagBank API token |
| `PAGSEGURO_NOTIFICATION_TOKEN` | Webhook validation secret |
| `NEXT_PUBLIC_PAGBANK_PUBLIC_KEY` | PagBank public key (frontend card encryption) |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `MONGODB_DB` | Database name (default: `mettafit`) |
| `NEXT_PUBLIC_SITE_URL` | Public site URL (used in webhook registration) |
| `PIX_BASE_URL`, `PIX_OAUTH_URL`, `PIX_CLIENT_ID`, `PIX_CLIENT_SECRET`, `PIX_CHAVE` | Pix PSP credentials |

## Architecture

### Auth Flow

Session is a JWT stored in an HttpOnly cookie (`mf_session`), signed with `SESSION_SECRET` using HS256 (`lib/auth.js`). There is no third-party auth provider. `lib/currentUser.js` is a helper to get the session user in Server Components and Route Handlers.

### Plans

Defined in `lib/plans.js`. Two plans only:
- `imediata` — R$49,90 one-time, single immediate consultation
- `essencial` — R$79,90/month recurring, unlimited GP + specialist scheduling

The plan ID (`imediata` / `essencial`) maps to Rapidoc's `paymentType`/`serviceType` via `mapPlanoToServiceConfig()` in `lib/rapidoc.js`.

### Payment Flow

1. User reaches `/checkout/[plano]` — either `pix` or `cartao` payment method
2. Frontend calls `POST /api/checkout` with `{ planoId, metodo, cartao? }`
3. A `payment_orders` document is inserted in MongoDB with `status: 'pending'`
4. **Pix**: charge is created via PSP direct API (`lib/pix.js`, BCB standard). Frontend polls `GET /api/checkout?txid=...` to detect payment.
5. **Card**: order is created via PagSeguro Orders API (`lib/pagseguro.js`). Card must arrive pre-encrypted by the PagBank JS SDK (`cartao.encrypted`).
6. PagSeguro webhook (`POST /api/webhooks/pagseguro`) confirms payment → calls `ativarPlanoDoUsuario()`.
7. **Plan activation** (`lib/activatePlan.js`): creates a Rapidoc beneficiary (if not yet existing), stores `rapidocBeneficiaryUuid` on the user document, records a `plan_activations` entry.

### Rapidoc Integration (`lib/rapidoc.js`)

Rapidoc uses a **B2B beneficiary model** (Tema v2 API). The app is responsible for user auth — Rapidoc only knows users as beneficiaries identified by UUID. Key operations:
- `adicionarBeneficiario()` — called once at plan activation
- `solicitarAtendimento(uuid)` — returns a URL to open for immediate video consultation
- `lerEspecialidades()`, `lerDisponibilidade()`, `realizarAgendamento()` — scheduling flow for the Essencial plan
- Specialties `PSICOLOGIA`, `PSICOLOGO`, `PSIQUIATRIA`, `NUTRICAO`, `NUTRICIONISTA` are filtered out (not offered)

The Rapidoc proxy routes under `app/api/rapidoc/` forward authenticated requests from the logged-in area.

### MongoDB Collections (`lib/db.js`)

- `users` — patient accounts; indexes on `email` (unique), `cpf` (unique, partial), `rapidocBeneficiaryUuid` (sparse)
- `payment_orders` — one document per checkout attempt; indexed by `referenceId`, `orderId`, `txid`, and `userId`
- `plan_activations` — audit log of each activation event
- `webhook_events` — raw webhook payloads with 90-day TTL

`dbCollections()` is the single entry point — it calls `ensureIndexes()` lazily in the background on first access.

### Pix Integration (`lib/pix.js`)

Direct PSP API (BCB standard), not PagSeguro. Uses OAuth2 client credentials. Optionally supports mTLS via `PIX_CERT_PATH` (PFX/P12 or PEM+KEY). Token is cached in-process with a 30-second expiry buffer.

### Deployment

`next.config.mjs` sets `output: 'standalone'`. CI/CD via `.github/workflows/deploy-production.yml` builds and deploys to Hostinger on every push to `main`. The server expects the Passenger-injected `PORT` env var.
