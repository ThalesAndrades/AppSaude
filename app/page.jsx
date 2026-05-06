import Link from 'next/link';
import PlanCard from '@/components/PlanCard';
import { listPlans } from '@/lib/plans';

const Sparkle = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M8 0l1.7 5.3L15 7l-5.3 1.7L8 14l-1.7-5.3L1 7l5.3-1.7L8 0z" fill="currentColor" />
  </svg>
);

const Check = () => (
  <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M4 10.5l3.5 3.5L16 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const HERO_BENEFITS = [
  'Sem fidelidade',
  'Pix instantâneo',
  'Receita digital',
  'Médicos CRM',
  'Cancele quando quiser',
  'Atendimento 24h',
];

const METRICS = [
  ['24/7', 'Disponibilidade do clínico geral'],
  ['~2 min', 'Tempo médio de espera'],
  ['+30', 'Especialidades para agendar'],
  ['100%', 'Atendimento por vídeo'],
];

const STEPS = [
  ['Crie sua conta', 'Cadastro rápido com CPF e e-mail. Sem papelada.'],
  ['Escolha o plano', 'Consulta avulsa por R$ 49,90 ou Plano Essencial por R$ 79,90/mês.'],
  ['Seja atendido', 'Pix instantâneo ou cartão. Em poucos minutos você está em consulta.'],
];

const FEATURES = [
  {
    t: 'Atendimento 24h',
    d: 'Consultas com clínico geral por vídeo, qualquer hora do dia.',
    icon: (
      <path d="M12 8v4l2.5 2.5M22 12a10 10 0 11-20 0 10 10 0 0120 0z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    t: 'Especialistas',
    d: 'Agende cardiologia, dermatologia, pediatria, ortopedia e mais.',
    icon: (
      <path d="M3 8l9-5 9 5-9 5-9-5zm0 8l9 5 9-5M3 12l9 5 9-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    t: 'Receitas e atestados',
    d: 'Prescrição e atestado digital com validade legal e QR Code.',
    icon: (
      <path d="M9 12h6M9 16h6M7 4h10a2 2 0 012 2v14l-3.5-2-3.5 2-3.5-2L5 20V6a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
];

export default function HomePage() {
  const planos = listPlans();

  return (
    <>
      {/* ============================ HERO ============================ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh-brand" aria-hidden="true" />
        <div
          className="absolute inset-0 [background-image:linear-gradient(to_right,rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_70%)]"
          aria-hidden="true"
        />
        <div className="relative section pt-20 pb-24 sm:pt-28 sm:pb-32 grid lg:grid-cols-[1.1fr_0.9fr] gap-14 items-center">
          <div className="animate-fade-in-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur ring-1 ring-ink-200 px-3 py-1 text-xs font-semibold text-brand-700 shadow-soft">
              <span className="text-brand-500"><Sparkle /></span>
              Telemedicina 100% digital
            </span>

            <h1 className="display mt-5">
              Médico online,<br />
              <span className="italic font-light text-brand-700">do seu jeito.</span>
            </h1>
            <p className="lead mt-6 max-w-xl">
              Atendimento por vídeo com clínico geral 24h e agendamento com
              especialistas. Pague só pelo que usar — ou tenha consultas
              ilimitadas a partir de <strong className="text-ink-900">R$ 79,90/mês</strong>.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/planos" className="btn-primary no-underline">
                Ver planos
                <span aria-hidden="true">→</span>
              </Link>
              <Link href="/cadastro" className="btn-outline btn-lg no-underline">
                Criar conta grátis
              </Link>
            </div>

            <ul className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-5 text-sm text-ink-700">
              {HERO_BENEFITS.map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 grid place-items-center">
                    <Check />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Visual: prescription preview / mock */}
          <div className="relative hidden lg:block animate-fade-in-up" style={{ animationDelay: '120ms' }}>
            <div className="absolute -inset-8 bg-mesh-brand blur-2xl opacity-70" aria-hidden="true" />
            <div className="relative rounded-3xl border border-ink-200/80 bg-white shadow-lift p-2">
              {/* Window chrome */}
              <div className="flex items-center gap-1.5 px-3 py-2">
                <span className="w-2.5 h-2.5 rounded-full bg-ink-200" />
                <span className="w-2.5 h-2.5 rounded-full bg-ink-200" />
                <span className="w-2.5 h-2.5 rounded-full bg-ink-200" />
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-ink-950 to-ink-800 p-6 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 grid place-items-center font-display text-lg">D</div>
                  <div>
                    <p className="text-sm font-semibold">Dra. Marina Costa</p>
                    <p className="text-xs text-white/60">Clínica geral · CRM 12345-SP</p>
                  </div>
                  <span className="ml-auto badge-brand bg-brand-400/15 text-brand-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
                    Em atendimento
                  </span>
                </div>
                <div className="mt-5 aspect-video rounded-xl bg-gradient-to-br from-brand-700/40 to-ink-900 grid place-items-center text-white/60 text-sm">
                  <div className="flex flex-col items-center gap-2">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>Sala de vídeo segura</span>
                  </div>
                </div>
                <div className="mt-4 flex justify-between text-xs">
                  <span className="text-white/60">Tempo de espera</span>
                  <span className="text-white font-semibold">~2 min</span>
                </div>
              </div>
            </div>

            {/* Floating chip */}
            <div className="absolute -left-6 bottom-10 rounded-2xl bg-white shadow-lift border border-ink-200 p-4 flex items-center gap-3 max-w-[260px] animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <div className="w-10 h-10 rounded-xl bg-accent-100 text-accent-700 grid place-items-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-ink-900">Receita digital pronta</p>
                <p className="text-xs text-ink-500">com validade legal e QR Code</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============= SOCIAL PROOF / METRICS ============= */}
      <section className="border-y border-ink-200/70 bg-white">
        <div className="section py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {METRICS.map(([n, l]) => (
            <div key={l}>
              <p className="font-display text-3xl font-semibold tracking-tight text-ink-950">{n}</p>
              <p className="text-sm text-ink-600 mt-1">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============= PLANS ============= */}
      <section id="planos" className="section py-24">
        <div className="max-w-2xl">
          <p className="eyebrow">Planos</p>
          <h2 className="display-2 mt-3">
            Pague pelo que usar.
            <br />
            <span className="text-text-muted font-normal italic">Ou tenha tudo, todo mês.</span>
          </h2>
          <p className="lead mt-4">
            Sem fidelidade, sem letras miúdas. Cancele a qualquer momento — você
            mantém o atendimento até o fim do ciclo já pago.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 mt-12">
          {planos.map((p) => (
            <PlanCard key={p.id} plan={p} destaque={p.id === 'essencial'} />
          ))}
        </div>
      </section>

      {/* ============= HOW IT WORKS ============= */}
      <section id="como-funciona" className="bg-gradient-to-b from-ink-50/60 to-white border-y border-ink-200/70">
        <div className="section py-24">
          <div className="max-w-2xl">
            <p className="eyebrow">Como funciona</p>
            <h2 className="display-2 mt-3">Três passos. Atendimento em minutos.</h2>
          </div>
          <ol className="mt-12 grid md:grid-cols-3 gap-6">
            {STEPS.map(([t, d], i) => (
              <li key={t} className="card-hover relative">
                <span className="absolute -top-3 left-6 badge-brand bg-white border border-ink-200">
                  Passo {i + 1}
                </span>
                <h3 className="mt-2 font-display text-xl font-semibold text-ink-950">{t}</h3>
                <p className="text-sm text-ink-600 mt-2 leading-relaxed">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============= FEATURES ============= */}
      <section className="section py-24">
        <div className="max-w-2xl">
          <p className="eyebrow">Atendimento</p>
          <h2 className="display-2 mt-3">Tudo o que você precisa, em um só lugar.</h2>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {FEATURES.map(({ t, d, icon }) => (
            <div key={t} className="card-hover">
              <div className="w-11 h-11 rounded-xl bg-brand-100 text-brand-700 grid place-items-center mb-5">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">{icon}</svg>
              </div>
              <h3 className="font-display text-xl font-semibold text-ink-950">{t}</h3>
              <p className="text-sm text-ink-600 mt-2 leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============= CTA ============= */}
      <section className="section pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-ink-950 text-white p-10 sm:p-14">
          <div
            className="absolute inset-0 opacity-50"
            style={{
              background:
                'radial-gradient(50% 60% at 90% 0%, rgba(16,185,129,0.45) 0%, transparent 60%),' +
                'radial-gradient(40% 60% at 0% 100%, rgba(251,191,36,0.30) 0%, transparent 60%)',
            }}
            aria-hidden="true"
          />
          <div className="relative max-w-2xl">
            <h2 className="display-2 text-white">Pronto pra falar com um médico?</h2>
            <p className="lead text-white/70 mt-4">
              Crie sua conta em menos de um minuto. Você só paga quando decidir
              ser atendido.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/cadastro" className="btn bg-white text-ink-950 hover:bg-ink-100 no-underline">
                Criar conta grátis
                <span aria-hidden="true">→</span>
              </Link>
              <Link href="/planos" className="btn bg-white/10 text-white hover:bg-white/15 no-underline">
                Ver planos
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
