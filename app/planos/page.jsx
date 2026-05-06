import PlanCard from '@/components/PlanCard';
import { listPlans } from '@/lib/plans';

export const metadata = { title: 'Planos' };

export default function PlanosPage() {
  const planos = listPlans();
  return (
    <div className="relative">
      <div className="absolute inset-x-0 top-0 h-[420px] bg-mesh-brand pointer-events-none" aria-hidden="true" />

      <div className="relative section py-20">
        <div className="max-w-2xl">
          <p className="eyebrow">Planos</p>
          <h1 className="display-2 mt-3">Saúde digital sob medida.</h1>
          <p className="lead mt-4">
            Pague pelo que usar com a consulta avulsa, ou tenha consultas
            ilimitadas com o Plano Essencial. Sem fidelidade.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-12">
          {planos.map((p) => (
            <PlanCard key={p.id} plan={p} destaque={p.id === 'essencial'} />
          ))}
        </div>

        <div className="mt-12 sm:mt-16 grid md:grid-cols-2 gap-5 sm:gap-6">
          <div className="glass-card">
            <h3 className="font-display text-xl font-semibold text-text-strong">Pagamento</h3>
            <p className="text-sm text-text-muted mt-2 leading-relaxed">
              Pix instantâneo ou cartão de crédito. Cobrança recorrente apenas no
              Plano Essencial — você cancela quando quiser.
            </p>
          </div>
          <div className="glass-card">
            <h3 className="font-display text-xl font-semibold text-text-strong">Cobertura</h3>
            <p className="text-sm text-text-muted mt-2 leading-relaxed">
              Atendimento por vídeo com clínico geral 24h, prescrição e atestado
              digital. Especialistas via agendamento. Atendimento com
              psicólogos e nutricionistas indisponível no momento.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
