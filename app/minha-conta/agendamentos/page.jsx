'use client';
import { useEffect, useState } from 'react';

function ConfirmModal({ onConfirm, onCancel }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      <div className="absolute inset-0 bg-bg/60 backdrop-blur-sm" onClick={onCancel} aria-hidden="true" />
      <div className="relative w-full max-w-sm glass-card p-6 animate-fade-in-up">
        <h3 id="confirm-title" className="font-display text-xl font-semibold text-text-strong">
          Cancelar agendamento?
        </h3>
        <p className="text-sm text-text-muted mt-2">
          Esta ação não pode ser desfeita. O horário ficará disponível para outros pacientes.
        </p>
        <div className="mt-6 flex gap-3">
          <button onClick={onCancel} className="btn-outline flex-1">
            Manter
          </button>
          <button
            onClick={onConfirm}
            className="btn flex-1 bg-red-600 text-white hover:bg-red-700"
          >
            Cancelar consulta
          </button>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    SCHEDULED: { label: 'Agendado', cls: 'badge-brand' },
    PENDING: { label: 'Pendente', cls: 'badge-accent' },
    CANCELLED: { label: 'Cancelado', cls: 'badge-ink' },
    COMPLETED: { label: 'Concluído', cls: 'badge-ink' },
  };
  const s = map[String(status).toUpperCase()] || { label: status, cls: 'badge-ink' };
  return <span className={s.cls}>{s.label}</span>;
}

export default function AgendamentosPage() {
  const [especialidades, setEspecialidades] = useState([]);
  const [meusAgs, setMeusAgs] = useState([]);
  const [esp, setEsp] = useState('');
  const [espNome, setEspNome] = useState('');
  const [data, setData] = useState('');
  const [horarios, setHorarios] = useState([]);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [confirmado, setConfirmado] = useState(null);
  const [cancelando, setCancelando] = useState(null);
  const [cancelMsg, setCancelMsg] = useState('');
  const [carregandoInicial, setCarregandoInicial] = useState(true);
  const [agendando, setAgendando] = useState(null);

  async function recarregarAgs() {
    const ags = await fetch('/api/rapidoc/agendamentos').then((r) => r.json()).catch(() => ({}));
    setMeusAgs(ags?.agendamentos || []);
  }

  useEffect(() => {
    (async () => {
      try {
        const [e] = await Promise.all([
          fetch('/api/rapidoc/especialidades').then((r) => r.json()),
          recarregarAgs(),
        ]);
        setEspecialidades(e?.especialidades || []);
      } catch {
        setErro('Não foi possível carregar os dados. Recarregue a página.');
      } finally {
        setCarregandoInicial(false);
      }
    })();
  }, []);

  function onChangeEsp(value) {
    setEsp(value);
    const found = especialidades.find((s) => s.uuid === value);
    setEspNome(found?.nome || '');
    setHorarios([]);
  }

  async function buscarHorarios() {
    setHorarios([]);
    setErro('');
    setCarregando(true);
    const params = new URLSearchParams({ specialtyUuid: esp, dateInitial: data, dateFinal: data });
    const r = await fetch(`/api/rapidoc/horarios?${params}`);
    const j = await r.json().catch(() => ({}));
    setCarregando(false);
    if (!r.ok) { setErro(j?.erro || 'Erro ao buscar horários.'); return; }
    if ((j?.horarios || []).length === 0) {
      setErro('Nenhum horário disponível nesta data. Tente outra data.');
      return;
    }
    setHorarios(j?.horarios || []);
  }

  async function agendar(availabilityUuid) {
    setErro('');
    setAgendando(availabilityUuid);
    const r = await fetch('/api/rapidoc/agendamentos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ specialtyUuid: esp, availabilityUuid, especialidadeNome: espNome }),
    });
    const j = await r.json().catch(() => ({}));
    setAgendando(null);
    if (!r.ok) { setErro(j?.erro || 'Falha ao agendar.'); return; }
    setConfirmado(j);
    setHorarios([]);
    await recarregarAgs();
  }

  async function confirmarCancelamento(uuid) {
    setCancelando(null);
    setErro('');
    setCancelMsg('');
    const r = await fetch(`/api/rapidoc/agendamentos/${encodeURIComponent(uuid)}`, { method: 'DELETE' });
    if (!r.ok && r.status !== 204) {
      const j = await r.json().catch(() => ({}));
      setErro(j?.erro || 'Falha ao cancelar agendamento.');
      return;
    }
    setCancelMsg('Agendamento cancelado com sucesso.');
    await recarregarAgs();
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6 sm:space-y-8">
      {cancelando && (
        <ConfirmModal
          onConfirm={() => confirmarCancelamento(cancelando)}
          onCancel={() => setCancelando(null)}
        />
      )}

      <header>
        <p className="eyebrow">Agendamentos</p>
        <h1 className="display-2 mt-2">Marque uma consulta.</h1>
        <p className="lead mt-3 max-w-2xl">
          Escolha a especialidade, a data e o horário disponível.
        </p>
      </header>

      {/* Nova consulta */}
      <div className="card">
        <h2 className="font-semibold text-ink-950">Nova consulta</h2>
        <div className="mt-4 grid sm:grid-cols-[1fr_180px_auto] gap-3">
          <div>
            <label className="label" htmlFor="especialidade">Especialidade</label>
            <select
              id="especialidade"
              className="input mt-1.5"
              value={esp}
              onChange={(e) => onChangeEsp(e.target.value)}
              disabled={carregandoInicial}
            >
              <option value="">Selecione uma especialidade</option>
              {especialidades.map((s) => (
                <option key={s.uuid} value={s.uuid}>{s.nome}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="data-consulta">Data</label>
            <input
              id="data-consulta"
              type="date"
              className="input mt-1.5"
              min={today}
              value={data}
              onChange={(e) => { setData(e.target.value); setHorarios([]); }}
            />
          </div>
        </div>

        <button
          onClick={buscarHorarios}
          disabled={!esp || !data || carregando}
          className="btn-primary mt-4 w-full sm:w-auto"
        >
          {carregando ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Buscando…
            </span>
          ) : 'Buscar horários'}
        </button>

        {erro && (
          <div role="alert" className="mt-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-4 py-3 text-sm text-red-700 dark:text-red-400">
            {erro}
          </div>
        )}

        {horarios.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-ink-700">Horários disponíveis</h3>
            <div className="mt-3 grid sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {horarios.map((h) => (
                <button
                  key={h.uuid}
                  onClick={() => agendar(h.uuid)}
                  className="rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm text-ink-800 hover:border-brand-500 hover:bg-brand-50 hover:text-brand-800 transition"
                >
                  <div className="font-semibold">{h.from}</div>
                  <div className="text-xs text-ink-500">{h.data}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sucesso */}
      {confirmado && (
        <div role="status" className="card border-brand-200 dark:border-brand-500/30 bg-brand-50 dark:bg-brand-500/10">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-500 text-white grid place-items-center shrink-0">
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M4 10.5l3.5 3.5L16 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-brand-900 dark:text-brand-300">Consulta agendada!</p>
              <p className="text-sm text-brand-700 dark:text-brand-400 mt-0.5">
                {confirmado.especialidade}
                {confirmado.data ? ` · ${confirmado.data}` : ''}
                {confirmado.from ? ` · ${confirmado.from}` : ''}
                {confirmado.to ? `–${confirmado.to}` : ''}
              </p>
            </div>
          </div>
        </div>
      )}

      {cancelMsg && (
        <div role="status" className="card border-ink-200">
          <p className="text-sm text-ink-700">{cancelMsg}</p>
        </div>
      )}

      {/* Meus agendamentos */}
      <div className="card">
        <h2 className="font-semibold text-ink-950">Meus agendamentos</h2>
        {carregandoInicial ? (
          <div className="mt-4 space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="skeleton h-16 w-full rounded-xl" />
            ))}
          </div>
        ) : meusAgs.length === 0 ? (
          <p className="text-sm text-ink-600 mt-3">
            Você ainda não tem agendamentos. Marque um acima.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-line">
            {meusAgs.map((a) => (
              <li key={a.uuid} className="py-4 flex justify-between gap-4 items-center">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <strong className="text-ink-950 truncate">{a.especialidade}</strong>
                    <span className="badge-ink text-[10px]">{a.status}</span>
                  </div>
                  <p className="text-sm text-ink-600 mt-0.5 truncate">
                    {a.label}
                    {a.profissional ? ` · ${a.profissional}` : ''}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  {a.url && (
                    <a
                      href={a.url}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-outline btn-sm no-underline"
                    >
                      Entrar na sala
                    </a>
                  )}
                  {!['CANCELLED', 'COMPLETED'].includes(String(a.status).toUpperCase()) && (
                    <button
                      onClick={() => setCancelando(a.uuid)}
                      className="btn-ghost btn-sm text-red-500 hover:bg-red-500/10"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
