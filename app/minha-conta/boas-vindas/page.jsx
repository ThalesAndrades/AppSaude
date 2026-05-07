'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function BoasVindasPage() {
  const router = useRouter();
  const [objetivo, setObjetivo] = useState('clareza');
  const [nivel, setNivel] = useState('iniciante');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  async function salvar(e) {
    e.preventDefault();
    setErro('');
    setLoading(true);
    const r = await fetch('/api/onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ objetivo, nivel }),
    });
    const data = await r.json().catch(() => ({}));
    setLoading(false);
    if (!r.ok) {
      setErro(data?.erro || 'Não foi possível salvar.');
      return;
    }
    router.push('/minha-conta');
    router.refresh();
  }

  return (
    <div className="max-w-2xl">
      <p className="eyebrow">Boas-vindas</p>
      <h1 className="display-2 mt-2">Vamos ajustar a sua experiência.</h1>
      <p className="lead mt-3">
        Duas escolhas rápidas para organizar o seu caminho e te entregar o que é mais útil agora.
      </p>

      <form onSubmit={salvar} className="card mt-8 space-y-4">
        <div>
          <label className="label" htmlFor="objetivo">Seu objetivo agora</label>
          <select
            id="objetivo"
            className="input mt-1.5"
            value={objetivo}
            onChange={(e) => setObjetivo(e.target.value)}
          >
            <option value="clareza">Clareza e direção</option>
            <option value="rotina">Rotina e constância</option>
            <option value="autoconfianca">Autoconfiança</option>
            <option value="produtividade">Produtividade sem culpa</option>
          </select>
        </div>

        <div>
          <label className="label" htmlFor="nivel">Seu nível</label>
          <select
            id="nivel"
            className="input mt-1.5"
            value={nivel}
            onChange={(e) => setNivel(e.target.value)}
          >
            <option value="iniciante">Iniciante (quero começar leve)</option>
            <option value="intermediario">Intermediária (já tentei antes)</option>
            <option value="avancado">Avançada (quero refinamento)</option>
          </select>
        </div>

        {erro && (
          <div role="alert" className="rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-4 py-3 text-sm text-red-700 dark:text-red-400">
            {erro}
          </div>
        )}

        <button className="btn-primary w-full btn-lg" disabled={loading}>
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Salvando…
            </span>
          ) : 'Continuar'}
        </button>
      </form>
    </div>
  );
}

