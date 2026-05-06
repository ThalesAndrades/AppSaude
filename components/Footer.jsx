import Link from 'next/link';
import Logo from '@/components/Logo';

export default function Footer() {
  const ano = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-ink-200/80 bg-gradient-to-b from-white to-ink-50/60">
      <div className="section py-14">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 text-sm text-ink-600 max-w-xs leading-relaxed">
              Saúde digital simples, humana e acessível. Atendimento por vídeo,
              agendamento com especialistas e prescrição digital.
            </p>
          </div>

          <FooterCol title="Produto">
            <FooterLink href="/planos">Planos</FooterLink>
            <FooterLink href="/#como-funciona">Como funciona</FooterLink>
            <FooterLink href="/cadastro">Criar conta</FooterLink>
          </FooterCol>

          <FooterCol title="Empresa">
            <FooterLink href="/termos">Termos de uso</FooterLink>
            <FooterLink href="/privacidade">Privacidade</FooterLink>
            <FooterLink href="mailto:contato@mettafit.site">Contato</FooterLink>
          </FooterCol>

          <FooterCol title="Atendimento">
            <li className="text-ink-600 leading-relaxed">
              Médicos habilitados com CRM ativo.
            </li>
            <li className="text-ink-600 leading-relaxed">
              Pagamentos via Pix ou cartão de crédito.
            </li>
          </FooterCol>
        </div>

        <div className="mt-12 pt-6 border-t border-ink-200/70 flex flex-col sm:flex-row gap-3 justify-between text-xs text-ink-500">
          <p>© {ano} Mettafit. Todos os direitos reservados.</p>
          <p>
            Os atendimentos médicos são prestados por profissionais habilitados,
            inscritos no respectivo conselho profissional.
          </p>
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
