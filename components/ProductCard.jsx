import Link from 'next/link';

const Check = () => (
  <svg className="shrink-0 mt-0.5 w-4 h-4 text-brand-700 dark:text-accent-300" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M4 10.5l3.5 3.5L16 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function ProductCard({ product }) {
  const destaque = Boolean(product.destaque);
  const ctaLabel = product.tipo === 'mentoria' ? 'Entrar na mentoria' : 'Garantir acesso';

  const tipoLabel =
    product.tipo === 'livro'
      ? 'Livro'
      : product.tipo === 'digital'
        ? 'Digital'
        : product.tipo === 'evento'
          ? 'Evento'
          : product.tipo === 'viagem'
            ? 'Viagem'
            : String(product.tipo || '');

  return (
    <article
      className={`relative flex flex-col rounded-3xl p-7 border transition-[transform,box-shadow,border-color,background-color] duration-300 ease-out hover:-translate-y-0.5 ${
        destaque
          ? 'bg-ink-950 text-white border-ink-900/10 shadow-[var(--shadow-3)] dark:bg-surface dark:text-text-strong dark:border-line'
          : 'bg-surface text-text-strong border-line shadow-[var(--shadow-2)] hover:shadow-[var(--shadow-3)]'
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
            <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />
            Mais escolhido
          </span>
        </>
      )}

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <p
            className={`text-xs font-semibold uppercase tracking-[0.14em] ${
              destaque ? 'text-white/60 dark:text-text-muted' : 'text-text-muted'
            }`}
          >
            {tipoLabel}
          </p>
          <div
            className={`h-11 w-11 rounded-2xl border grid place-items-center ${
              destaque
                ? 'bg-white/10 border-white/15 text-white dark:bg-surface-2 dark:border-line dark:text-text-strong'
                : 'bg-surface-2 border-line text-text-strong'
            }`}
            aria-hidden="true"
          >
            <ProductIcon product={product} />
          </div>
        </div>
        <h3 className={`font-display text-2xl font-semibold tracking-tight ${destaque ? 'mt-3' : 'mt-2'}`}>
          {product.nome}
        </h3>
        <p className={`mt-2 text-sm leading-relaxed ${destaque ? 'text-white/70 dark:text-text-muted' : 'text-text-muted'}`}>
          {product.headline}
        </p>

        <div className="mt-6 flex items-baseline gap-1">
          <span className="text-4xl font-display font-semibold tracking-tight">
            {product.precoLabel}
          </span>
          <span className={destaque ? 'text-white/60 dark:text-text-muted text-sm' : 'text-text-muted text-sm'}>
            {product.parcelamentoLabel}
          </span>
        </div>

        <ul className="mt-6 space-y-3 text-sm">
          {product.includes.map((b) => (
            <li key={b} className="flex gap-2.5">
              <Check />
              <span className={destaque ? 'text-white/85 dark:text-text' : 'text-text'}>{b}</span>
            </li>
          ))}
        </ul>

        <Link
          href={`/checkout/${product.id}`}
          aria-label={`${ctaLabel} — ${product.nome}`}
          className={`mt-8 w-full no-underline ${
            destaque
              ? 'btn btn-lg bg-white text-ink-950 hover:bg-ink-100 dark:bg-ink-900 dark:text-white dark:hover:bg-ink-800'
              : 'btn-primary btn-lg'
          }`}
        >
          {ctaLabel}
          <span aria-hidden="true">→</span>
        </Link>

        <p className={`mt-3 text-xs text-center ${destaque ? 'text-white/50 dark:text-text-muted' : 'text-text-muted'}`}>
          Pix ou cartão · acesso imediato após confirmação
        </p>
      </div>
    </article>
  );
}

function ProductIcon({ product }) {
  const id = String(product?.id || '');
  const tipo = String(product?.tipo || '');
  if (tipo === 'livro') return <IconBook variant={id} />;
  if (tipo === 'digital') return <IconDigital variant={id} />;
  if (tipo === 'evento') return <IconEvent variant={id} />;
  if (tipo === 'viagem') return <IconTravel variant={id} />;
  return <IconSpark />;
}

function IconBook({ variant }) {
  if (variant === 'livro1') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M5 4.5h9a3 3 0 013 3v12H8a3 3 0 00-3 3V4.5z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="M8 19.5h11V7.5a3 3 0 00-3-3H8v15z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" opacity="0.7" />
        <path d="M10 9.25c.9-.9 2.3-.9 3.2 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M6 4.5h12v15H7.5A1.5 1.5 0 006 21V4.5z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M9 8h6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M9 12h6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" opacity="0.75" />
    </svg>
  );
}

function IconDigital({ variant }) {
  if (variant === 'digital2') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M16 11a4 4 0 10-8 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M4 20v-1a5 5 0 015-5h6a5 5 0 015 5v1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 10a3 3 0 016 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" opacity="0.7" />
      </svg>
    );
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M6 7h12v9H6V7z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M9 19h6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M9 10h6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" opacity="0.75" />
    </svg>
  );
}

function IconEvent({ variant }) {
  if (variant === 'evento2') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M7 3v3M17 3v3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M5 7h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="M8.5 13.5c1.2 1.2 2.4 1.2 3.6 0s2.4-1.2 3.6 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M7 3v3M17 3v3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M5 7h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M8 12h8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" opacity="0.75" />
    </svg>
  );
}

function IconTravel({ variant }) {
  if (variant === 'viagem2') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M3 16l9-4 9 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 12V4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M8.5 8.5L12 4l3.5 4.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" opacity="0.75" />
        <path d="M6 19h12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 21c4-4 7-7.5 7-11a7 7 0 10-14 0c0 3.5 3 7 7 11z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M12 11.5a2 2 0 100-4 2 2 0 000 4z" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function IconSpark() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 2l1.5 6.5L20 12l-6.5 1.5L12 20l-1.5-6.5L4 12l6.5-3.5L12 2z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}
