'use client';

export default function GlobalError({ reset }) {
  return (
    <div className="section py-24 text-center">
      <p className="font-display text-6xl font-semibold text-red-400/60 select-none">Ops</p>
      <h1 className="display-2 mt-4">Algo deu errado</h1>
      <p className="lead mt-4 max-w-md mx-auto">
        Ocorreu um erro inesperado. Isso já foi registrado — tente novamente.
      </p>
      <button onClick={reset} className="btn-primary btn-lg mt-10">
        Tentar novamente
      </button>
    </div>
  );
}
