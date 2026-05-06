'use client';
import { useState } from 'react';

export default function ConsultaImediataPage() {
  const [estado, setEstado] = useState('idle');
  const [erro, setErro] = useState('');
  const [url, setUrl] = useState('');

  async function iniciar() {
    setEstado('iniciando');
    setErro('');
    const r = await fetch('/api/rapidoc/consulta-imediata', { method: 'POST' });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
      setEstado('erro');
      setErro(data?.erro || 'Não foi possível iniciar a consulta.');
      return;
    }
    if (!data?.url) {
      setEstado('erro');
      setErro('Não foi possível obter a URL da consulta. Tente novamente.');
      return;
    }
    setUrl(data.url);
    setEstado('pronto');
  }

  function reiniciar() {
    setEstado('idle');
    setErro('');
    setUrl('');
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow">Consulta imediata</p>
        <h1 className="display-2 mt-2">Falar com um clínico geral, agora.</h1>
        <p className="lead mt-3 max-w-2xl">
          Atendimento por vídeo com um médico habilitado. Tenha câmera e microfone
          disponíveis.
        </p>
      </header>

      {estado === 'idle' && (
        <div className="card">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="flex-1">
              <h2 className="font-display text-xl font-semibold text-text-strong">
                Pronto para começar?
              </h2>
              <p className="text-sm text-text-muted mt-1">
                A consulta será gravada conforme política da plataforma. Tempo
                médio de espera: poucos minutos.
              </p>
            </div>
            <button onClick={iniciar} className="btn-primary btn-lg sm:shrink-0">
              Iniciar consulta
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      )}

      {estado === 'iniciando' && (
        <div className="card">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
            <p className="text-ink-700">Conectando à sala de atendimento…</p>
          </div>
          <div className="space-y-3">
            <div className="skeleton h-4 w-2/3 rounded" />
            <div className="skeleton h-4 w-1/2 rounded" />
            <div className="skeleton h-56 w-full rounded-2xl" />
          </div>
        </div>
      )}

      {estado === 'pronto' && (
        <div className="card">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <span className="badge-brand">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
                Sala pronta
              </span>
              <p className="text-sm text-ink-600">
                Aguarde o médico na sala abaixo.
              </p>
            </div>
          </div>
          <div className="mt-5 aspect-video w-full overflow-hidden rounded-2xl border border-ink-200 bg-ink-950">
            <iframe
              src={url}
              title="Consulta imediata — sala de vídeo"
              className="w-full h-full"
              allow="camera; microphone; fullscreen; display-capture; autoplay"
            />
          </div>
          <p className="mt-3 text-xs text-text-muted">
            A consulta é gravada conforme política da plataforma. Receitas e atestados
            serão enviados por e-mail ao final do atendimento.
          </p>
        </div>
      )}

      {estado === 'erro' && (
        <div role="alert" className="card border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10">
          <p className="font-semibold text-red-900 dark:text-red-300">Não foi possível iniciar</p>
          <p className="text-sm text-red-700 dark:text-red-400 mt-1">{erro}</p>
          <div className="mt-4 flex gap-3">
            <button onClick={iniciar} className="btn-primary btn-sm">
              Tentar novamente
            </button>
            <button onClick={reiniciar} className="btn-outline btn-sm">
              Voltar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
