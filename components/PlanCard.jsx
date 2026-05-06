import Link from 'next/link';

const Check = () => (
  <svg className="shrink-0 mt-0.5 w-4 h-4 text-brand-600" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M4 10.5l3.5 3.5L16 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function PlanCard({ plan, destaque = false }) {
  const ctaLabel = plan.recorrente ? 'Assinar plano' : 'Comprar consulta';

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
                'radial-gradient(60% 50% at 80% 0%, rgba(16,185,129,0.6) 0%, transparent 60%),' +
                'radial-gradient(60% 50% at 0% 100%, rgba(251,191,36,0.45) 0%, transparent 60%)',
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
        <h3 className={`font-display text-2xl font-semibold tracking-tight ${destaque ? '' : 'mt-0'} ${destaque ? 'mt-3' : ''}`}>
          {plan.nome}
        </h3>
        <p className={`mt-2 text-sm leading-relaxed ${destaque ? 'text-white/70' : 'text-ink-600'}`}>
          {plan.descricao}
        </p>

        <div className="mt-6 flex items-baseline gap-1">
          <span className="text-4xl font-display font-semibold tracking-tight">
            {plan.precoLabel}
          </span>
          <span className={destaque ? 'text-white/60 text-sm' : 'text-ink-500 text-sm'}>
            {plan.recorrente ? '/mês' : ' · cobrança única'}
          </span>
        </div>

        <ul className="mt-6 space-y-3 text-sm">
          {plan.beneficios.map((b) => (
            <li key={b} className="flex gap-2.5">
              <Check />
              <span className={destaque ? 'text-white/85' : 'text-ink-700'}>{b}</span>
            </li>
          ))}
        </ul>

        <Link
          href={`/checkout/${plan.id}`}
          aria-label={`${ctaLabel} — ${plan.nome}`}
          className={`mt-8 w-full no-underline ${
            destaque ? 'btn btn-lg bg-white text-ink-950 hover:bg-ink-100' : 'btn-primary btn-lg'
          }`}
        >
          {ctaLabel}
          <span aria-hidden="true">→</span>
        </Link>

        <p className={`mt-3 text-xs text-center ${destaque ? 'text-white/50' : 'text-ink-500'}`}>
          Pix ou cartão · sem fidelidade · cancele quando quiser
        </p>
      </div>
    </article>
  );
}
