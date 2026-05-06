'use client';
import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AuthShell from '@/components/AuthShell';

function LoginForm() {
  const router = useRouter();
  const next = useSearchParams().get('next') || '/minha-conta';
  const [form, setForm] = useState({ email: '', senha: '' });
  const [senhaVis, setSenhaVis] = useState(false);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    setErro('');
    setLoading(true);
    const r = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await r.json().catch(() => ({}));
    setLoading(false);
    if (!r.ok) {
      setErro(data?.erro || 'E-mail ou senha incorretos.');
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <AuthShell
      title="Bem-vindo de volta"
      subtitle="Acesse sua conta para falar com um médico."
      footer={
        <>
          Não tem conta?{' '}
          <Link href="/cadastro" className="font-medium text-brand-600 dark:text-brand-400">
            Criar conta grátis
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="label" htmlFor="email">E-mail</label>
          <input
            id="email"
            className="input mt-1.5"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={set('email')}
          />
        </div>

        <div>
          <label className="label" htmlFor="senha">Senha</label>
          <div className="relative mt-1.5">
            <input
              id="senha"
              className="input pr-11"
              type={senhaVis ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={form.senha}
              onChange={set('senha')}
            />
            <button
              type="button"
              onClick={() => setSenhaVis((v) => !v)}
              aria-label={senhaVis ? 'Ocultar senha' : 'Mostrar senha'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-strong transition-colors"
            >
              {senhaVis ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
                </svg>
              )}
            </button>
          </div>
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
              Entrando…
            </span>
          ) : 'Entrar'}
        </button>
      </form>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="section py-20 text-text-muted">Carregando…</div>}>
      <LoginForm />
    </Suspense>
  );
}
