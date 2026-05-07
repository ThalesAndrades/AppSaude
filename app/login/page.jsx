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

  async function onGoogleDemo() {
    setErro('');
    setLoading(true);
    const r = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'demo@mulheresemmovimento.local', senha: '12345678' }),
    });
    const data = await r.json().catch(() => ({}));
    setLoading(false);
    if (!r.ok) {
      setErro(data?.erro || 'Não foi possível entrar com Google (demo).');
      return;
    }
    router.push(next);
    router.refresh();
  }

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
      subtitle="Acesse sua área interna e continue sua jornada."
      footer={
        <>
          Não tem conta?{' '}
          <Link href="/cadastro" className="font-medium text-brand-600 dark:text-brand-400">
            Criar conta grátis
          </Link>
        </>
      }
    >
      <div className="space-y-4">
        <button
          type="button"
          onClick={onGoogleDemo}
          disabled={loading}
          className="btn-outline w-full btn-lg flex items-center justify-center gap-3"
          aria-label="Entrar com Google (demo)"
        >
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#FFC107" d="M43.6 20.2H42V20H24v8h11.3C33.7 33.1 29.3 36 24 36 17.4 36 12 30.6 12 24S17.4 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.7-.4-3.8z" />
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.2 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.6 8.5 6.3 14.7z" />
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.1 35.2 26.7 36 24 36c-5.3 0-9.8-3-11.6-7.4l-6.5 5C9.1 39.5 16 44 24 44z" />
            <path fill="#1976D2" d="M43.6 20.2H42V20H24v8h11.3c-1.2 3-3.6 5.2-6.5 6.6l.1.1 6.2 5.2C38.7 36.6 44 31.8 44 24c0-1.3-.1-2.7-.4-3.8z" />
          </svg>
          Entrar com Google (demo)
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-line" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-surface px-3 text-text-muted">ou</span>
          </div>
        </div>

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
      </div>
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
