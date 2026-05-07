'use client';
import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AuthShell from '@/components/AuthShell';

function maskCpf(v) {
  return v.replace(/\D/g, '').slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function maskPhone(v) {
  const d = v.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 10) {
    return d.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2');
  }
  return d.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2');
}

function CadastroForm() {
  const router = useRouter();
  const next = useSearchParams().get('next') || '/minha-conta';
  const [form, setForm] = useState({
    nome: '', email: '', cpf: '', telefone: '', dataNascimento: '', senha: '',
  });
  const [souMulher, setSouMulher] = useState(false);
  const [senhaVis, setSenhaVis] = useState(false);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const setMask = (k, fn) => (e) => setForm((f) => ({ ...f, [k]: fn(e.target.value) }));

  async function onSubmit(e) {
    e.preventDefault();
    setErro('');
    setLoading(true);

    const payload = {
      ...form,
      cpf: form.cpf.replace(/\D/g, ''),
      telefone: form.telefone.replace(/\D/g, ''),
      souMulher,
    };

    const r = await fetch('/api/auth/cadastro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await r.json().catch(() => ({}));
    setLoading(false);
    if (!r.ok) {
      setErro(data?.erro || 'Não foi possível criar sua conta. Tente novamente.');
      return;
    }
    router.push(next);
  }

  const senhaOk = form.senha.length >= 8;

  return (
    <AuthShell
      title="Criar sua conta"
      subtitle="Um espaço seguro e exclusivo para mulheres."
      footer={
        <>
          Já tem cadastro?{' '}
          <Link href="/login" className="font-medium text-brand-600 dark:text-brand-400">
            Entrar
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="label" htmlFor="nome">Nome completo</label>
          <input
            id="nome"
            className="input mt-1.5"
            autoComplete="name"
            required
            value={form.nome}
            onChange={set('nome')}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label" htmlFor="cpf">CPF</label>
            <input
              id="cpf"
              className="input mt-1.5 font-mono"
              inputMode="numeric"
              autoComplete="off"
              placeholder="000.000.000-00"
              required
              value={form.cpf}
              onChange={setMask('cpf', maskCpf)}
            />
          </div>
          <div>
            <label className="label" htmlFor="dataNascimento">Nascimento</label>
            <input
              id="dataNascimento"
              className="input mt-1.5"
              type="date"
              autoComplete="bday"
              required
              value={form.dataNascimento}
              onChange={set('dataNascimento')}
            />
          </div>
        </div>

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
          <label className="label" htmlFor="telefone">Celular</label>
          <input
            id="telefone"
            className="input mt-1.5 font-mono"
            inputMode="tel"
            autoComplete="tel"
            placeholder="(00) 00000-0000"
            required
            value={form.telefone}
            onChange={setMask('telefone', maskPhone)}
          />
        </div>

        <div>
          <label className="label" htmlFor="senha">Senha</label>
          <div className="relative mt-1.5">
            <input
              id="senha"
              className="input pr-11"
              type={senhaVis ? 'text' : 'password'}
              autoComplete="new-password"
              required
              minLength={8}
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
          {form.senha.length > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <div className={`h-1 flex-1 rounded-full transition-colors ${senhaOk ? 'bg-brand-500' : 'bg-red-400'}`} />
              <span className={`text-xs ${senhaOk ? 'text-brand-600 dark:text-brand-400' : 'text-red-500'}`}>
                {senhaOk ? 'Senha segura' : 'Mínimo 8 caracteres'}
              </span>
            </div>
          )}
        </div>

        {erro && (
          <div role="alert" className="rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-4 py-3 text-sm text-red-700 dark:text-red-400">
            {erro}
          </div>
        )}

        <div className="rounded-2xl border border-line bg-surface-2/60 px-4 py-3">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              className="mt-1 rounded-md border-line text-brand-600 focus:ring-brand-500/30"
              checked={souMulher}
              onChange={(e) => setSouMulher(e.target.checked)}
            />
            <span className="text-sm text-text">
              Confirmo que sou mulher e entendo que este acesso é exclusivo para mulheres.
            </span>
          </label>
        </div>

        <button className="btn-primary w-full btn-lg mt-2" disabled={loading || !souMulher}>
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Criando conta…
            </span>
          ) : 'Criar conta'}
        </button>

        <p className="text-xs text-text-muted text-center">
          Ao continuar, você concorda com os{' '}
          <Link href="/termos" className="underline hover:text-text-strong transition-colors">Termos</Link>
          {' '}e a{' '}
          <Link href="/privacidade" className="underline hover:text-text-strong transition-colors">Política de Privacidade</Link>.
        </p>
      </form>
    </AuthShell>
  );
}

export default function CadastroPage() {
  return (
    <Suspense fallback={<div className="section py-20 text-text-muted">Carregando…</div>}>
      <CadastroForm />
    </Suspense>
  );
}
