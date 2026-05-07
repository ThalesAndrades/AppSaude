'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

export default function CoursePlayer({
  courseId,
  courseName,
  moduloId,
  lesson,
  modulos,
  completedLessonIds = [],
}) {
  const initialCompleted = useMemo(() => new Set(completedLessonIds), [completedLessonIds]);
  const [completed, setCompleted] = useState(initialCompleted);
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState('');

  async function marcarConcluida() {
    setErro('');
    setSaving(true);
    const r = await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lessonId: lesson.id }),
    });
    const data = await r.json().catch(() => ({}));
    setSaving(false);
    if (!r.ok) {
      setErro(data?.erro || 'Não foi possível salvar seu progresso.');
      return;
    }
    setCompleted((prev) => new Set([...prev, lesson.id]));
  }

  const isDone = completed.has(lesson.id);

  return (
    <div className="grid lg:grid-cols-[320px_1fr] gap-6 lg:gap-8">
      <aside className="card p-4 lg:sticky lg:top-24 h-fit">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
          Curso
        </p>
        <h2 className="font-display text-lg font-semibold text-ink-950 mt-1">
          {courseName}
        </h2>

        <nav className="mt-5 space-y-3" aria-label="Conteúdo do curso">
          {modulos.map((m) => (
            <div key={m.id} className="rounded-xl border border-line bg-surface">
              <div className="px-3 py-2.5 border-b border-line">
                <p className="text-sm font-semibold text-ink-900">{m.nome}</p>
              </div>
              <div className="p-2">
                {m.aulas.map((a) => {
                  const active = a.id === lesson.id;
                  const done = completed.has(a.id);
                  return (
                    <Link
                      key={a.id}
                      href={`/minha-conta/cursos/${encodeURIComponent(courseId)}/aula/${encodeURIComponent(a.id)}`}
                      className={`flex items-start gap-3 px-3 py-2.5 rounded-lg no-underline transition-colors ${
                        active
                          ? 'bg-brand-500/10 text-brand-700 dark:text-brand-300'
                          : 'text-text hover:bg-line/50 hover:text-text-strong'
                      }`}
                    >
                      <span
                        className={`mt-0.5 w-5 h-5 rounded-full grid place-items-center text-[11px] font-semibold ${
                          done ? 'bg-brand-500 text-white' : 'bg-line text-text-muted'
                        }`}
                        aria-hidden="true"
                      >
                        {done ? '✓' : '•'}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-medium truncate">{a.nome}</span>
                        {a.duracao && (
                          <span className="block text-xs text-text-muted mt-0.5">{a.duracao}</span>
                        )}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      <section className="min-w-0">
        <header>
          <p className="eyebrow">Aula</p>
          <h1 className="display-2 mt-2">{lesson.nome}</h1>
          {lesson.duracao && (
            <p className="text-sm text-text-muted mt-2">Duração estimada: {lesson.duracao}</p>
          )}
        </header>

        <div className="card mt-6 overflow-hidden">
          <div className="aspect-video rounded-xl bg-gradient-to-br from-ink-950 to-ink-800 grid place-items-center text-white/70">
            <div className="text-center px-6">
              <p className="font-semibold">Vídeo</p>
              <p className="text-sm text-white/60 mt-1">
                Substitua por um embed (YouTube/Vimeo) ou player próprio quando o conteúdo estiver pronto.
              </p>
            </div>
          </div>

          <div className="mt-6 prose prose-stone max-w-none">
            <p>{lesson.texto}</p>
          </div>

          {erro && (
            <div role="alert" className="mt-6 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-4 py-3 text-sm text-red-700 dark:text-red-400">
              {erro}
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={marcarConcluida}
              disabled={saving || isDone}
              className={isDone ? 'btn-outline btn-lg' : 'btn-primary btn-lg'}
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Salvando…
                </span>
              ) : isDone ? 'Concluída ✓' : 'Marcar como concluída'}
            </button>
            <Link href="/minha-conta/biblioteca" className="btn-outline btn-lg no-underline">
              Voltar à biblioteca
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

