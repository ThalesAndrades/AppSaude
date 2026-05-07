'use client';

import Link from 'next/link';
import Logo from '@/components/Logo';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  const ano = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-ink-200/80 bg-gradient-to-b from-white to-ink-50/60">
      <div className="section py-14">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 text-sm text-ink-600 max-w-xs leading-relaxed">
              Cursos e mentorias com experiência interna premium: objetiva, prática e feita para mulheres.
            </p>
          </div>

          <FooterCol title="Produto">
            <FooterLink href="/planos">Produtos</FooterLink>
            <FooterLink href="/#como-funciona">Como funciona</FooterLink>
            <FooterLink href="/cadastro">Criar conta</FooterLink>
          </FooterCol>

          <FooterCol title="Empresa">
            <FooterLink href="/termos">Termos de uso</FooterLink>
            <FooterLink href="/privacidade">Privacidade</FooterLink>
            <FooterLink href="mailto:contato@mettafit.site">Contato</FooterLink>
          </FooterCol>

          <FooterCol title="Experiência">
            <li className="text-ink-600 leading-relaxed">
              Área interna mobile-first, rápida e clara.
            </li>
            <li className="text-ink-600 leading-relaxed">
              Pagamentos via Pix ou cartão.
            </li>
          </FooterCol>
        </div>

        <div className="mt-12 pt-6 border-t border-ink-200/70 flex flex-col sm:flex-row gap-3 justify-between text-xs text-ink-500">
          <p>© {ano} Mulheres em Movimento. Todos os direitos reservados.</p>
          <div className="flex items-center gap-3">
            <p>Plataforma exclusiva para mulheres.</p>
            {pathname === '/' && (
              <Link
                href="/admin"
                aria-label="Admin"
                className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-ink-200/80 bg-white/60 text-ink-400 no-underline transition-colors hover:text-ink-700 hover:border-ink-300"
              >
                ?
              </Link>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-500">{title}</h4>
      <ul className="mt-4 space-y-2 text-sm">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }) {
  return (
    <li>
      <Link
        href={href}
        className="text-ink-700 hover:text-ink-950 no-underline transition-colors"
      >
        {children}
      </Link>
    </li>
  );
}
