import Link from 'next/link';
import Logo from '@/components/Logo';

export default function AuthShell({ title, subtitle, footer, children }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] grid lg:grid-cols-2">
      {/* LEFT: brand panel (desktop only) */}
      <aside className="relative hidden lg:flex flex-col justify-between bg-ink-950 text-white p-12 overflow-hidden">
        <div
          className="absolute inset-0 opacity-90"
          style={{
            background:
              'radial-gradient(60% 60% at 80% 0%, rgba(204,152,53,0.32) 0%, transparent 60%),' +
              'radial-gradient(50% 60% at 0% 100%, rgba(138,95,62,0.26) 0%, transparent 60%)',
          }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-grid-faint-dark bg-[size:40px_40px] opacity-30" aria-hidden="true" />
        <div className="relative">
          <Link href="/" className="no-underline inline-block text-white">
            <Logo />
          </Link>
        </div>
        <div className="relative max-w-md">
          <p className="font-display text-3xl leading-tight font-medium">
            “Eu parei de me cobrar por tudo. Agora eu tenho clareza, um plano e eu sigo.”
          </p>
          <div className="mt-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-700 grid place-items-center text-sm font-display font-semibold">
              R
            </div>
            <div className="text-sm">
              <p className="font-semibold">Renata</p>
              <p className="text-white/60">Aluna</p>
            </div>
          </div>
        </div>
        <div className="relative text-xs text-white/50">
          © {new Date().getFullYear()} Mulheres em Movimento
        </div>
      </aside>

      {/* RIGHT: form */}
      <section className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Link href="/" className="no-underline">
              <Logo />
            </Link>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-ink-950">
            {title}
          </h1>
          {subtitle && <p className="mt-2 text-ink-600">{subtitle}</p>}
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-6 text-sm text-ink-600">{footer}</div>}
        </div>
      </section>
    </div>
  );
}
