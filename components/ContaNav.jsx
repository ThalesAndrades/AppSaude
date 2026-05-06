'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  {
    href: '/minha-conta',
    label: 'Início',
    shortLabel: 'Início',
    exact: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M3 11l9-8 9 8M5 10v10a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: '/minha-conta/consulta-imediata',
    label: 'Consulta imediata',
    shortLabel: 'Consulta',
    exact: false,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: '/minha-conta/agendamentos',
    label: 'Agendamentos',
    shortLabel: 'Agenda',
    exact: false,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M8 2v4M16 2v4M3 9h18M5 5h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function isActive(pathname, href, exact) {
  return exact ? pathname === href : pathname.startsWith(href);
}

export function ContaNavSidebar() {
  const pathname = usePathname();

  return (
    <nav className="mt-4 glass-card p-2">
      {NAV_ITEMS.map(({ href, label, exact, icon }) => {
        const active = isActive(pathname, href, exact);
        return (
          <Link
            key={href}
            href={href}
            className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm no-underline transition-colors ${
              active
                ? 'bg-brand-500/10 text-brand-700 dark:text-brand-300 font-medium'
                : 'text-text hover:text-text-strong hover:bg-line/50'
            }`}
          >
            <span
              className={`transition-colors ${
                active
                  ? 'text-brand-600 dark:text-brand-400'
                  : 'text-text-muted group-hover:text-brand-600 dark:group-hover:text-brand-400'
              }`}
            >
              {icon}
            </span>
            <span>{label}</span>
          </Link>
        );
      })}

      <div className="mt-1 pt-1 border-t border-line">
        <form action="/api/auth/logout" method="post">
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogoutIcon />
            Sair
          </button>
        </form>
      </div>
    </nav>
  );
}

export function ContaNavMobile() {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-line bg-surface/90 backdrop-blur-xl"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Navegação principal"
    >
      <div className="flex">
        {NAV_ITEMS.map(({ href, shortLabel, exact, icon }) => {
          const active = isActive(pathname, href, exact);
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center gap-1 pt-3 pb-2.5 text-[11px] font-medium no-underline transition-colors ${
                active
                  ? 'text-brand-600 dark:text-brand-400'
                  : 'text-text-muted hover:text-text-strong'
              }`}
            >
              <span className={`transition-transform duration-200 ${active ? 'scale-110' : ''}`}>
                {icon}
              </span>
              {shortLabel}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
