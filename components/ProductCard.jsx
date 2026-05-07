import Link from 'next/link';

const Check = () => (
  <svg className="shrink-0 mt-0.5 w-4 h-4 text-brand-600" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M4 10.5l3.5 3.5L16 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function ProductCard({ product }) {
  const destaque = Boolean(product.destaque);
  const ctaLabel =
    product.tipo === 'mentoria' ? 'Entrar na mentoria' : 'Garantir acesso';

  return (
    <article
      className={`relative flex flex-col rounded-3xl p-7 transition-all duration-300 ${
        destaque
          ? 'bg-ink-950 text-white shadow-lift ring-1 ring-ink-900/10 -translate-y-0 hover:-translate-y-1'
          : 'bg-white text-ink-900 border border-ink-200/80 shadow-card hover:-translate-y-0.5 hover:shadow-lift'
      }`}
    >
      {destaque && (
        <>
          <div
            className="pointer-events-none absolute inset-0 rounded-3xl opacity-[0.18] mix-blend-screen"
            style={{
              background:
                'radial-gradient(60% 50% at 80% 0%, rgba(204,152,53,0.45) 0%, transparent 60%),' +
                'radial-gradient(60% 50% at 0% 100%, rgba(191,152,110,0.30) 0%, transparent 60%)',
            }}
            aria-hidden="true"
          />
          <span className="badge-accent self-start">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-500 animate-pulse motion-reduce:animate-none" />
            Mais escolhido
          </span>
        </>
      )}

      <div className="relative">
        <p className={`text-xs font-semibold uppercase tracking-[0.14em] ${destaque ? 'text-white/60' : 'text-ink-500'}`}>
          {product.tipo}
        </p>
        <h3 className={`font-display text-2xl font-semibold tracking-tight ${destaque ? 'mt-3' : 'mt-2'}`}>
          {product.nome}
        </h3>
        <p className={`mt-2 text-sm leading-relaxed ${destaque ? 'text-white/70' : 'text-ink-600'}`}>
          {product.headline}
        </p>

        <div className="mt-6 flex items-baseline gap-1">
          <span className="text-4xl font-display font-semibold tracking-tight">
            {product.precoLabel}
          </span>
          <span className={destaque ? 'text-white/60 text-sm' : 'text-ink-500 text-sm'}>
            {product.parcelamentoLabel}
          </span>
        </div>

        <ul className="mt-6 space-y-3 text-sm">
          {product.includes.map((b) => (
            <li key={b} className="flex gap-2.5">
              <Check />
              <span className={destaque ? 'text-white/85' : 'text-ink-700'}>{b}</span>
            </li>
          ))}
        </ul>

        <Link
          href={`/checkout/${product.id}`}
          aria-label={`${ctaLabel} — ${product.nome}`}
          className={`mt-8 w-full no-underline ${
            destaque ? 'btn btn-lg bg-white text-ink-950 hover:bg-ink-100' : 'btn-primary btn-lg'
          }`}
        >
          {ctaLabel}
          <span aria-hidden="true">→</span>
        </Link>

        <p className={`mt-3 text-xs text-center ${destaque ? 'text-white/50' : 'text-ink-500'}`}>
          Pix ou cartão · acesso imediato após confirmação
        </p>
      </div>
    </article>
  );
}
