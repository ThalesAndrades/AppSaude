'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

function prefersReducedMotion() {
  if (typeof window === 'undefined') return true;
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? true;
}

export default function NewsRotator() {
  const items = useMemo(
    () => [
      {
        tag: 'Viagens',
        title: 'Cruzeiro Mulheres em Movimento 2027',
        date: '6 à 13 de Fevereiro de 2027',
        desc: 'Lista de interesse aberta para o próximo grupo exclusivo.',
        href: '/interesse-viagens',
      },
      {
        tag: 'Eventos',
        title: 'Roda do Sagrado Feminino',
        date: 'Próxima abertura',
        desc: 'Encontros presenciais com práticas e conexão em grupo.',
        href: '/planos#eventos',
      },
      {
        tag: 'Digital',
        title: 'Nova trilha: Energia e Autoconfiança',
        date: 'Atualização',
        desc: 'Conteúdos curtos e diretos para aplicar no dia a dia.',
        href: '/planos#digital',
      },
      {
        tag: 'Comunidade',
        title: 'Círculo de Mulheres — agenda do mês',
        date: 'Sempre em evolução',
        desc: 'Planejamento de encontros e desafios para manter consistência.',
        href: '/minha-conta',
      },
      {
        tag: 'Livros',
        title: 'Curadoria: leituras essenciais',
        date: 'Atualizado',
        desc: 'Seleção de livros que sustentam a jornada com profundidade.',
        href: '/planos#livros',
      },
    ],
    []
  );

  const [cursor, setCursor] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (paused) return;
    const t = window.setInterval(() => setCursor((c) => (c + 1) % items.length), 3000);
    return () => window.clearInterval(t);
  }, [items.length, paused]);

  const visible = useMemo(() => {
    const a = items[cursor % items.length];
    const b = items[(cursor + 1) % items.length];
    const c = items[(cursor + 2) % items.length];
    return [a, b, c];
  }, [cursor, items]);

  return (
    <section className="section py-16" aria-label="Notícias e novidades">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="eyebrow">Novidades</p>
          <h2 className="display-3 mt-3">O que está em movimento agora</h2>
          <p className="lead mt-3 text-text-muted">
            Atualizações rápidas com foco no que importa: lançamentos, agenda e oportunidades.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="btn-outline btn-sm" onClick={() => setCursor((c) => (c - 1 + items.length) % items.length)}>
            ←
          </button>
          <button className="btn-outline btn-sm" onClick={() => setCursor((c) => (c + 1) % items.length)}>
            →
          </button>
        </div>
      </div>

      <div
        className="mt-10 grid gap-4 md:grid-cols-3"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {visible.map((n, idx) => (
          <Link
            key={`${n.title}-${idx}`}
            href={n.href}
            className={`no-underline rounded-3xl border bg-surface px-6 py-6 transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-0.5 ${
              idx === 0 ? 'border-brand-200 dark:border-brand-500/30 shadow-[var(--shadow-3)]' : 'border-line shadow-[var(--shadow-2)] hover:shadow-[var(--shadow-3)]'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <span className={`badge ${idx === 0 ? 'bg-brand-100 text-brand-800 dark:bg-brand-500/15 dark:text-brand-300' : 'bg-surface-2 text-text-muted'}`}>
                {n.tag}
              </span>
              <span className="text-xs text-text-muted">{n.date}</span>
            </div>
            <div className="mt-4 text-lg font-semibold text-text-strong leading-tight">{n.title}</div>
            <div className="mt-2 text-sm text-text-muted leading-relaxed">{n.desc}</div>
            <div className="mt-5 text-sm font-semibold text-brand-700 dark:text-brand-300">Ver detalhes →</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
