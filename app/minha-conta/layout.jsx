import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { getCurrentUser } from '@/lib/currentUser';
import { ContaNavSidebar, ContaNavMobile } from '@/components/ContaNav';

export default async function ContaLayout({ children }) {
  const sess = await getSession();
  if (!sess) redirect('/login?next=/minha-conta');

  const user = await getCurrentUser();
  const planoAtivo = Boolean(user?.rapidocBeneficiaryUuid);
  const inicial = (user?.nome || user?.email || sess.email || '?').trim().charAt(0).toUpperCase();
  const planoLabel = user?.planoAtivo === 'essencial' ? 'Essencial' : 'Avulso';

  return (
    <div className="bg-bg min-h-[calc(100vh-4rem)]">
      <div className="section py-8 sm:py-10 grid md:grid-cols-[260px_1fr] gap-6 md:gap-8 pb-24 md:pb-10">
        <aside className="md:sticky md:top-20 h-fit">
          <div className="card p-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white grid place-items-center font-display text-lg font-semibold shrink-0">
                {inicial}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-text-strong truncate">
                  {user?.nome || sess.email}
                </p>
                <p className="text-xs text-text-muted truncate">{user?.email || sess.email}</p>
              </div>
            </div>
            <div className="mt-4">
              {planoAtivo ? (
                <span className="badge-brand">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                  Plano ativo · {planoLabel}
                </span>
              ) : (
                <span className="badge-ink">Sem plano ativo</span>
              )}
            </div>
          </div>

          <div className="hidden md:block">
            <ContaNavSidebar />
          </div>
        </aside>

        <section className="min-w-0">{children}</section>
      </div>

      <ContaNavMobile />
    </div>
  );
}
