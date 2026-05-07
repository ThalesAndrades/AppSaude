import Link from 'next/link';

export default async function ContaHome({ searchParams }) {
  const sucesso = searchParams?.sucesso === '1';

  return (
    <div className="space-y-8">
      {sucesso && (
        <div role="status" className="card border-brand-300 bg-brand-50">
          <div className="flex gap-3 items-start">
            <div className="w-6 h-6 rounded-full bg-brand-500 text-white grid place-items-center text-xs">✓</div>
            <div>
              <p className="font-semibold text-brand-900">Pagamento confirmado.</p>
              <p className="text-sm text-brand-800/80 mt-0.5">
                Seu acesso foi liberado. Bem-vinda à sua área interna.
              </p>
            </div>
          </div>
        </div>
      )}

      <header>
        <p className="eyebrow">Bem-vinda</p>
        <h1 className="display-2 mt-2">Seu espaço de transformação</h1>
        <p className="lead mt-3 max-w-2xl">
          Aqui você encontra tudo o que precisa para sua jornada de crescimento e empoderamento.
        </p>
      </header>

      <div className="grid sm:grid-cols-2 gap-5">
        <Link
          href="/minha-conta/biblioteca"
          className="card-hover no-underline"
        >
          <div className="w-11 h-11 rounded-xl bg-brand-100 text-brand-700 grid place-items-center mb-5">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M4 6h16M4 12h16M4 18h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </div>
          <h2 className="font-display text-xl font-semibold text-ink-950">
            Biblioteca
          </h2>
          <p className="text-sm text-ink-600 mt-2">
            Acesse seus conteúdos liberados, marque aulas concluídas e retome de onde parou.
          </p>
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-700">
            Entrar →
          </span>
        </Link>

        <Link
          href="/minha-conta/conta"
          className="card-hover no-underline"
        >
          <div className="w-11 h-11 rounded-xl bg-accent-100 text-accent-700 grid place-items-center mb-5">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M20 21a8 8 0 10-16 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M12 13a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="font-display text-xl font-semibold text-ink-950">
            Minha Conta
          </h2>
          <p className="text-sm text-ink-600 mt-2">
            Configure sua experiência e acompanhe seu histórico de compras.
          </p>
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-700">
            Abrir →
          </span>
        </Link>
      </div>

      <div className="card border-accent-200 bg-gradient-to-br from-accent-50 to-white">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="flex-1">
            <h3 className="font-display text-lg font-semibold text-ink-950">
              Pronta para sua próxima transformação?
            </h3>
            <p className="text-sm text-ink-700 mt-1">
              Explore nosso catálogo completo e descubra novas possibilidades para seu crescimento.
            </p>
          </div>
          <Link href="/planos" className="btn-primary no-underline">
            Explorar catálogo →
          </Link>
        </div>
      </div>
    </div>
  );
}
