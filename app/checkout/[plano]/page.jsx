'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { PRODUCTS } from '@/lib/products';

function maskCard(v) {
  return v.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
}
function maskExpiry(v) {
  const d = v.replace(/\D/g, '').slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}
function maskCvv(v) {
  return v.replace(/\D/g, '').slice(0, 4);
}
function maskCep(v) {
  return v.replace(/\D/g, '').slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2');
}

const IconCheck = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 12l5 5L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconCopy = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
const IconAlert = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

function ErrorAlert({ msg }) {
  if (!msg) return null;
  return (
    <div role="alert" className="flex items-start gap-2.5 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-4 py-3 text-sm text-red-700 dark:text-red-400">
      <IconAlert />
      {msg}
    </div>
  );
}

function PixStep({ pix, pixStatus, onGerar, loading, erro }) {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 60);

  useEffect(() => {
    if (!pix) return;
    const id = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(id);
  }, [pix]);

  function copiar() {
    if (!pix?.qrText) return;
    navigator.clipboard?.writeText(pix.qrText).catch(() => {
      const el = document.createElement('textarea');
      el.value = pix.qrText;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      el.remove();
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const ss = String(timeLeft % 60).padStart(2, '0');

  if (pixStatus === 'pago') {
    return (
      <div className="text-center py-10">
        <div className="w-16 h-16 rounded-full bg-brand-500 text-white grid place-items-center mx-auto animate-fade-in-up">
          <IconCheck />
        </div>
        <h2 className="display-3 mt-4">Pagamento confirmado!</h2>
        <p className="text-text-muted mt-2">Seu acesso está sendo liberado…</p>
      </div>
    );
  }

  if (!pix) {
    return (
      <div className="space-y-5">
        <div className="rounded-2xl bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/20 p-5">
          <p className="text-sm font-semibold text-brand-800 dark:text-brand-300">Como funciona o Pix</p>
          <ol className="mt-2 space-y-1.5 text-sm text-brand-700 dark:text-brand-400">
            <li>1. Clique em &quot;Gerar QR Code&quot;</li>
            <li>2. Abra o app do seu banco e escaneie ou cole o código</li>
            <li>3. Confirme o pagamento — ativação é automática</li>
          </ol>
        </div>
        <ErrorAlert msg={erro} />
        <button onClick={onGerar} disabled={loading} className="btn-primary w-full btn-lg">
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Gerando QR Code…
            </span>
          ) : 'Gerar QR Code Pix'}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <span className="badge-brand">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
          Aguardando pagamento
        </span>
        {timeLeft > 0 ? (
          <span className="text-xs text-text-muted tabular-nums">Expira em {mm}:{ss}</span>
        ) : (
          <span className="text-xs text-red-500">Código expirado</span>
        )}
      </div>

      {pix.qrImage && (
        <div className="flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={pix.qrImage}
            alt="QR Code Pix para pagamento"
            className="w-52 h-52 rounded-xl border border-line"
            width={208}
            height={208}
          />
        </div>
      )}

      <div>
        <label className="label">Pix Copia e Cola</label>
        <div className="relative mt-1.5">
          <textarea
            readOnly
            rows={3}
            value={pix.qrText || ''}
            className="input resize-none text-xs pr-12 font-mono"
            aria-label="Código Pix Copia e Cola"
          />
          <button
            type="button"
            onClick={copiar}
            aria-label="Copiar código Pix"
            className="absolute right-3 top-3 p-1.5 rounded-lg text-text-muted hover:text-text-strong hover:bg-line/50 transition-colors"
          >
            {copied ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M5 12l5 5L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : <IconCopy />}
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={copiar}
        className={`btn w-full ${copied ? 'btn-outline border-brand-400 text-brand-700' : 'btn-outline'}`}
      >
        {copied ? '✓ Código copiado!' : 'Copiar código Pix'}
      </button>

      <p className="text-xs text-text-muted text-center">
        Seu plano é ativado automaticamente após a confirmação do pagamento.
      </p>

      <ErrorAlert msg={erro} />
    </div>
  );
}

function CardStep({ card, setCard, onSubmit, loading, erro }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="label" htmlFor="cc-number">Número do cartão</label>
        <input
          id="cc-number"
          className="input mt-1.5 font-mono tracking-wider"
          inputMode="numeric"
          autoComplete="cc-number"
          placeholder="0000 0000 0000 0000"
          required
          value={card.number}
          onChange={(e) => setCard((c) => ({ ...c, number: maskCard(e.target.value) }))}
        />
      </div>

      <div>
        <label className="label" htmlFor="cc-name">Nome impresso no cartão</label>
        <input
          id="cc-name"
          className="input mt-1.5 uppercase"
          autoComplete="cc-name"
          placeholder="NOME SOBRENOME"
          required
          value={card.name}
          onChange={(e) => setCard((c) => ({ ...c, name: e.target.value.toUpperCase() }))}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label" htmlFor="cc-exp">Validade</label>
          <input
            id="cc-exp"
            className="input mt-1.5 font-mono"
            inputMode="numeric"
            autoComplete="cc-exp"
            placeholder="MM/AA"
            required
            value={card.exp}
            onChange={(e) => setCard((c) => ({ ...c, exp: maskExpiry(e.target.value) }))}
          />
        </div>
        <div>
          <label className="label" htmlFor="cc-csc">CVV</label>
          <input
            id="cc-csc"
            className="input mt-1.5 font-mono"
            inputMode="numeric"
            autoComplete="cc-csc"
            placeholder="000"
            required
            value={card.cvv}
            onChange={(e) => setCard((c) => ({ ...c, cvv: maskCvv(e.target.value) }))}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label" htmlFor="cc-cep">CEP do titular</label>
          <input
            id="cc-cep"
            className="input mt-1.5 font-mono"
            inputMode="numeric"
            autoComplete="postal-code"
            placeholder="00000-000"
            required
            value={card.cep}
            onChange={(e) => setCard((c) => ({ ...c, cep: maskCep(e.target.value) }))}
          />
        </div>
        <div>
          <label className="label" htmlFor="cc-numero">Número</label>
          <input
            id="cc-numero"
            className="input mt-1.5"
            autoComplete="address-line2"
            placeholder="123"
            value={card.numero}
            onChange={(e) => setCard((c) => ({ ...c, numero: e.target.value }))}
          />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="cc-parcelas">Parcelas</label>
        <select
          id="cc-parcelas"
          className="input mt-1.5"
          value={card.parcelas}
          onChange={(e) => setCard((c) => ({ ...c, parcelas: Number(e.target.value) }))}
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>{n}× sem juros</option>
          ))}
        </select>
      </div>

      <ErrorAlert msg={erro} />

      <button className="btn-primary w-full btn-lg" disabled={loading}>
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Processando…
          </span>
        ) : 'Pagar com cartão'}
      </button>

      <p className="text-xs text-text-muted text-center flex items-center justify-center gap-1.5">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.8" />
          <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        Dados protegidos com criptografia TLS
      </p>
    </form>
  );
}

export default function CheckoutPage() {
  const { plano: productId } = useParams();
  const router = useRouter();
  const produto = PRODUCTS[productId];

  const [metodo, setMetodo] = useState('pix');
  const [card, setCard] = useState({ number: '', name: '', exp: '', cvv: '', cep: '', numero: '', parcelas: 1 });
  const [pix, setPix] = useState(null);
  const [pixStatus, setPixStatus] = useState('aguardando');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const pollingRef = useRef(null);

  const valor = useMemo(
    () => (produto ? (produto.preco / 100).toFixed(2).replace('.', ',') : '0,00'),
    [produto]
  );

  useEffect(() => {
    if (!pix?.paymentId) return;
    let cancelled = false;
    let attempts = 0;
    const MAX = 360;

    async function poll() {
      if (cancelled || attempts >= MAX) return;
      attempts++;
      try {
        const r = await fetch(`/api/checkout?paymentId=${pix.paymentId}`);
        const data = await r.json();
        if (data.pago) {
          setPixStatus('pago');
          setTimeout(() => { if (!cancelled) router.push('/minha-conta?sucesso=1'); }, 1800);
          return;
        }
      } catch {}
      if (!cancelled) pollingRef.current = setTimeout(poll, 5000);
    }

    pollingRef.current = setTimeout(poll, 4000);
    return () => {
      cancelled = true;
      clearTimeout(pollingRef.current);
    };
  }, [pix?.paymentId, router]);

  if (!produto) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="display-3 mb-4">Produto não encontrado</h1>
        <Link href="/planos" className="btn-primary no-underline">Ver produtos</Link>
      </div>
    );
  }

  async function gerarPix() {
    setErro('');
    setLoading(true);
    const r = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: produto.id, metodo: 'pix' }),
    });
    const data = await r.json().catch(() => ({}));
    setLoading(false);
    if (!r.ok) { setErro(data?.erro || 'Falha ao gerar Pix.'); return; }
    setPix(data);
  }

  async function pagarCartao(e) {
    e.preventDefault();
    setErro('');

    const digits = String(card.number).replace(/\D/g, '');
    const holder = String(card.name).trim();
    const exp = String(card.exp).trim();
    const securityCode = String(card.cvv).replace(/\D/g, '');

    if (!digits || digits.length < 13 || !holder || !exp || !securityCode) {
      setErro('Preencha todos os dados do cartão corretamente.');
      return;
    }

    setLoading(true);
    const r = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: produto.id,
        metodo: 'cartao',
        cartao: {
          number: digits,
          name: holder,
          exp,
          cvv: securityCode,
          cep: card.cep,
          numero: card.numero,
          parcelas: card.parcelas || 1,
        },
      }),
    });
    const data = await r.json().catch(() => ({}));
    setLoading(false);
    if (!r.ok) { setErro(data?.erro || 'Pagamento recusado.'); return; }
    router.push('/minha-conta?sucesso=1');
  }

  return (
    <div className="section-tight py-8 sm:py-12">
      <Link
        href="/planos"
        className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-strong no-underline mb-6 transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M19 12H5M5 12l7-7M5 12l7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Voltar aos produtos
      </Link>

      <div className="grid md:grid-cols-[1fr_300px] gap-6 lg:gap-8 items-start">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-text-strong tracking-tight">
            Finalizar pagamento
          </h1>
          <p className="text-text-muted mt-1">{produto.nome}</p>

          <div className="mt-6 flex gap-2 p-1 rounded-2xl bg-surface-2 border border-line">
            {[
              {
                id: 'pix',
                label: 'Pix',
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M11.5 2L2 11.5l10 10 10-10L11.5 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                  </svg>
                ),
              },
              {
                id: 'cartao',
                label: 'Cartão',
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <rect x="2" y="5" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M2 9h20" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                ),
              },
            ].map(({ id, label, icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => { setMetodo(id); setErro(''); }}
                className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-sm font-semibold transition-all duration-200 ${
                  metodo === id
                    ? 'bg-surface shadow-soft text-text-strong'
                    : 'text-text-muted hover:text-text-strong'
                }`}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>

          <div className="card mt-4">
            {metodo === 'pix' ? (
              <PixStep
                pix={pix}
                pixStatus={pixStatus}
                onGerar={gerarPix}
                loading={loading}
                erro={erro}
              />
            ) : (
              <CardStep
                card={card}
                setCard={setCard}
                onSubmit={pagarCartao}
                loading={loading}
                erro={erro}
              />
            )}
          </div>
        </div>

        <aside className="card h-fit md:sticky md:top-24 order-first md:order-last">
          <h2 className="font-display text-lg font-semibold text-text-strong">Resumo</h2>

          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">{produto.nome}</span>
              <strong className="text-text-strong tabular-nums">R$ {valor}</strong>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-line flex justify-between items-baseline">
            <span className="text-sm text-text-muted">Total</span>
            <div className="text-right">
              <strong className="font-display text-2xl font-semibold text-text-strong tabular-nums">
                R$ {valor}
              </strong>
              <span className="block text-xs text-text-muted">{produto.parcelamentoLabel}</span>
            </div>
          </div>

          <ul className="mt-5 pt-5 border-t border-line space-y-2.5">
            {produto.includes.map((b) => (
              <li key={b} className="flex items-start gap-2.5 text-xs text-text-muted">
                <svg className="w-3.5 h-3.5 shrink-0 mt-0.5 text-brand-500" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M4 10.5l3.5 3.5L16 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {b}
              </li>
            ))}
          </ul>

          <p className="mt-5 text-[11px] text-text-muted leading-relaxed">
            Pix ou cartão · acesso liberado automaticamente após confirmação
          </p>
        </aside>
      </div>
    </div>
  );
}
