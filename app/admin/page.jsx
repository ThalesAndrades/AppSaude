'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const ADMIN_CODE = '123456';
const SESSION_KEY = 'mf_admin_ok';

export default function AdminGatePage() {
  const router = useRouter();
  const redirectTo = '/admin/painel';
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (code.trim() !== ADMIN_CODE) {
      setError('Código interno inválido.');
      return;
    }
    sessionStorage.setItem(SESSION_KEY, '1');
    router.replace(redirectTo);
  };

  return (
    <div className="section-tight pt-24 pb-24">
      <div className="card">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="eyebrow">Acesso Interno</p>
            <h1 className="display-3 mt-2">Área Administrativa</h1>
            <p className="text-sm text-text-muted mt-3">
              Insira o código interno para acessar o painel.
            </p>
          </div>
          <div className="hidden sm:block text-xs text-text-muted bg-surface-2 border border-line rounded-xl px-3 py-2">
            Sessão local
          </div>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <div>
            <label className="label" htmlFor="admin-code">Código interno</label>
            <input
              id="admin-code"
              className="input tracking-[0.25em] text-center"
              inputMode="numeric"
              autoComplete="one-time-code"
              type="password"
              value={code}
              onChange={(e) => {
                setError('');
                setCode(String(e.target.value || '').replace(/\D/g, '').slice(0, 6));
              }}
              placeholder="••••••"
              required
            />
          </div>

          {error && (
            <div role="status" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button type="submit" className="btn-primary w-full sm:w-auto">
              Entrar no painel
            </button>
            <button type="button" className="btn-outline w-full sm:w-auto" onClick={() => router.replace('/')}
            >
              Voltar
            </button>
          </div>

          <p className="text-xs text-text-muted">
            Este acesso é apenas para demonstração local.
          </p>
        </form>
      </div>
    </div>
  );
}

export { SESSION_KEY };
