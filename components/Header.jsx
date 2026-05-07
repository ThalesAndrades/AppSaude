import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { isDemoAuthBypassEnabled } from '@/lib/demoAuth';
import Logo from '@/components/Logo';
import ThemeToggle from '@/components/ThemeToggle';
import MobileMenu from '@/components/MobileMenu';

export default async function Header() {
  let user = null;
  try {
    user = await getSession();
  } catch {
    user = null;
  }
  const demoBypass = isDemoAuthBypassEnabled();
  const isLoggedIn = demoBypass ? false : Boolean(user);

  return (
    <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-xl border-b border-line/70">
      <div className="section h-16 flex items-center justify-between gap-3">
        <Link href="/" aria-label="Mulheres em Movimento — início" className="no-underline">
          <Logo />
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-sm" aria-label="Principal">
          <Link
            href="/planos"
            className="px-3 py-2 rounded-lg text-text hover:text-text-strong hover:bg-line/40 no-underline"
          >
            Produtos
          </Link>
          <Link
            href="/#como-funciona"
            className="px-3 py-2 rounded-lg text-text hover:text-text-strong hover:bg-line/40 no-underline"
          >
            Como funciona
          </Link>
          <span className="inline-block w-px h-5 bg-line mx-2" aria-hidden="true" />
          {isLoggedIn ? (
            <Link href="/minha-conta" className="btn-primary btn-sm no-underline">
              Minha conta
              <span aria-hidden="true">→</span>
            </Link>
          ) : (
            <>
              <Link
                href={demoBypass ? '/minha-conta' : '/login'}
                className="px-3 py-2 rounded-lg text-text hover:text-text-strong hover:bg-line/40 no-underline"
              >
                Entrar
              </Link>
              <Link href={demoBypass ? '/minha-conta' : '/cadastro'} className="btn-primary btn-sm no-underline">
                Criar conta
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <MobileMenu isLoggedIn={isLoggedIn} demoBypass={demoBypass} />
        </div>
      </div>
    </header>
  );
}
