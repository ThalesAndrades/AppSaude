import Link from 'next/link';
import { getCurrentUser } from '@/lib/currentUser';
import { listRecentPurchases } from '@/lib/entitlements';

export default async function ContaPage() {
  const user = await getCurrentUser();
  const compras = user ? await listRecentPurchases(String(user._id), 8).catch(() => []) : [];
  const onboardingOk = Boolean(user?.onboarding?.completedAt);

  return (
    <div className="space-y-8">
      <header>
        <p className="eyebrow">Conta</p>
        <h1 className="display-2 mt-2">Seus dados</h1>
        <p className="lead mt-3 max-w-2xl">
          Configure sua experiência e acompanhe seu histórico de compras.
        </p>
      </header>

      <section className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-display text-lg font-semibold text-ink-950">Perfil</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-ink-500">Nome</dt>
              <dd className="text-ink-900 font-medium text-right">{user?.nome}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-500">E-mail</dt>
              <dd className="text-ink-900 font-medium text-right">{user?.email}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-500">Celular</dt>
              <dd className="text-ink-900 font-medium text-right">{user?.telefone || '—'}</dd>
            </div>
          </dl>

          <div className="mt-6">
            <Link href="/minha-conta/boas-vindas" className="btn-outline no-underline">
              {onboardingOk ? 'Reajustar experiência' : 'Configurar experiência'}
            </Link>
          </div>
        </div>

        <div className="card">
          <h2 className="font-display text-lg font-semibold text-ink-950">Compras recentes</h2>
          {!compras.length ? (
            <p className="text-sm text-ink-600 mt-3">
              Nenhuma compra encontrada ainda.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {compras.map((c) => (
                <li key={c.referenceId} className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink-900 truncate">
                      {c.productNome || c.planoNome || 'Compra'}
                    </p>
                    <p className="text-xs text-ink-500 mt-0.5">
                      {new Date(c.createdAt).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <span className="badge-ink">{c.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

