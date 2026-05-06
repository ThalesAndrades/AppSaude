import Link from 'next/link';
import { getCurrentUser } from '@/lib/currentUser';

export default async function ContaHome({ searchParams }) {
  const user = await getCurrentUser();
  const sucesso = searchParams?.sucesso === '1';
  const planoAtivo = Boolean(user?.rapidocBeneficiaryUuid);
  const primeiroNome = user?.nome?.split(' ')[0] || 'paciente';

  return (
    <div className="space-y-8">
      {sucesso && (
        <div role="status" className="card border-brand-300 bg-brand-50">
          <div className="flex gap-3 items-start">
            <span className="w-8 h-8 rounded-full bg-brand-500 text-white grid place-items-center shrink-0">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path d="M4 10.5l3.5 3.5L16 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <div>
              <p className="font-semibold text-brand-900">Pagamento confirmado.</p>
              <p className="text-sm text-brand-800/80 mt-0.5">
                Seu plano está ativo. Você já pode iniciar uma consulta.
              </p>
            </div>
          </div>
        </div>
      )}

      <header>
        <p className="eyebrow">Olá, {primeiroNome}</p>
        <h1 className="display-2 mt-2">Pronto pra cuidar de você hoje?</h1>
        <p className="lead mt-3 max-w-2xl">
          {planoAtivo
            ? 'Inicie uma consulta com clínico geral em poucos minutos ou agende com um especialista.'
            : 'Para começar a falar com um médico, ative um plano abaixo.'}
        </p>
      </header>

      <div className="grid sm:grid-cols-2 gap-5">
        <Link
          href={planoAtivo ? '/minha-conta/consulta-imediata' : '/planos'}
          className={`relative overflow-hidden rounded-2xl p-7 no-underline group transition-all duration-300 ${
            planoAtivo
              ? 'bg-ink-950 text-white hover:shadow-lift hover:-translate-y-0.5'
              : 'bg-white border border-ink-200 hover:border-ink-300 hover:shadow-lift hover:-translate-y-0.5'
          }`}
        >
          {planoAtivo && (
            <div
              className="absolute inset-0 opacity-50"
              style={{
                background:
                  'radial-gradient(60% 60% at 100% 0%, rgba(16,185,129,0.45) 0%, transparent 60%)',
              }}
              aria-hidden="true"
            />
          )}
          <div className="relative">
            <div className={`w-11 h-11 rounded-xl grid place-items-center mb-5 ${planoAtivo ? 'bg-white/10 text-white' : 'bg-brand-100 text-brand-700'}`}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className={`font-display text-xl font-semibold ${planoAtivo ? 'text-white' : 'text-ink-950'}`}>
              Consulta imediata
            </h2>
            <p className={`text-sm mt-2 ${planoAtivo ? 'text-white/70' : 'text-ink-600'}`}>
              Atendimento agora com clínico geral por vídeo. Tempo médio: poucos minutos.
            </p>
            <span className={`mt-5 inline-flex items-center gap-2 text-sm font-semibold ${planoAtivo ? 'text-brand-300 group-hover:text-brand-200' : 'text-brand-700'}`}>
              {planoAtivo ? 'Iniciar agora' : 'Ativar plano'} →
            </span>
          </div>
        </Link>

        <Link
          href={planoAtivo ? '/minha-conta/agendamentos' : '/planos'}
          className="card-hover no-underline"
        >
          <div className="w-11 h-11 rounded-xl bg-accent-100 text-accent-700 grid place-items-center mb-5">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M8 2v4M16 2v4M3 9h18M5 5h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="font-display text-xl font-semibold text-ink-950">
            Agendamentos
          </h2>
          <p className="text-sm text-ink-600 mt-2">
            Marque consulta com clínico geral ou especialistas. Veja seus
            agendamentos.
          </p>
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-700">
            Ver opções →
          </span>
        </Link>
      </div>

      {!planoAtivo && (
        <div className="card border-accent-200 bg-gradient-to-br from-accent-50 to-white">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="flex-1">
              <h3 className="font-display text-lg font-semibold text-ink-950">
                Ative um plano para começar
              </h3>
              <p className="text-sm text-ink-700 mt-1">
                Plano Essencial por R$ 79,90/mês com consultas ilimitadas, ou
                consulta avulsa por R$ 49,90.
              </p>
            </div>
            <Link href="/planos" className="btn-primary no-underline">
              Ver planos →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
