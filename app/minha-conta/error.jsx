'use client';

export default function ContaError({ reset }) {
  return (
    <div className="card text-center py-12">
      <p className="font-display text-4xl font-semibold text-red-400/60">Erro</p>
      <h2 className="display-3 mt-3">Não foi possível carregar</h2>
      <p className="text-text-muted mt-2">Tente recarregar a página.</p>
      <button onClick={reset} className="btn-primary mt-6">
        Tentar novamente
      </button>
    </div>
  );
}
