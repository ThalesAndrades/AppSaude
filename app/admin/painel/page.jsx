'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { listProducts } from '@/lib/products';

const STORE_KEY = 'mf_admin_demo_store_v1';
const SESSION_KEY = 'mf_admin_ok';

function loadStore() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveStore(next) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORE_KEY, JSON.stringify(next));
}

function seedStore() {
  const produtos = listProducts().map((p) => ({
    id: p.id,
    nome: p.title,
    tipo: p.segment,
    preco: p.price || 0,
    ativo: true,
  }));

  const usuarias = [
    {
      id: 'u1',
      nome: 'Ana Paula',
      email: 'ana@demo.local',
      telefone: '(11) 99999-0000',
      ativa: true,
      acessos: [produtos[0]?.id].filter(Boolean),
    },
    {
      id: 'u2',
      nome: 'Carolina Mendes',
      email: 'carolina@demo.local',
      telefone: '(21) 98888-0000',
      ativa: true,
      acessos: [],
    },
    {
      id: 'u3',
      nome: 'Beatriz Silva',
      email: 'beatriz@demo.local',
      telefone: '(31) 97777-0000',
      ativa: false,
      acessos: [],
    },
  ];

  const editorial = { byDate: {} };
  const ecossistema = {
    instagram: { connected: false },
    facebook: { connected: false },
    linkedin: { connected: false },
    googleAds: { connected: false },
    metaAds: { connected: false },
  };
  const engajamento = {
    sequences: [
      {
        id: 's1',
        nome: 'Boas-vindas',
        status: 'Ativa',
        envios: 284,
        abertura: 42,
        clique: 9,
      },
      {
        id: 's2',
        nome: 'Lançamento — Viagens em Movimento',
        status: 'Rascunho',
        envios: 0,
        abertura: 0,
        clique: 0,
      },
    ],
  };

  return { produtos, usuarias, editorial, ecossistema, engajamento };
}

function startOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function endOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

function formatDateKey(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function segmentLabel(seg) {
  switch (seg) {
    case 'livros':
      return 'Livros';
    case 'digital':
      return 'Digital';
    case 'eventos':
      return 'Eventos';
    case 'viagens':
      return 'Viagens em Movimento';
    default:
      return seg;
  }
}

function moneyBRL(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value || 0));
}

const TABS = [
  { key: 'produtos', label: 'Produtos' },
  { key: 'usuarias', label: 'Usuárias' },
  { key: 'liberacoes', label: 'Liberações' },
  { key: 'ecossistema', label: 'Ecossistema' },
  { key: 'editorial', label: 'Editorial' },
  { key: 'engajamento', label: 'Engajamento' },
];

export default function AdminPainelPage() {
  const router = useRouter();
  const [tab, setTab] = useState('produtos');
  const [store, setStore] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem(SESSION_KEY) !== '1') {
      router.replace('/admin');
      return;
    }

    const currentTab = new URLSearchParams(window.location.search).get('tab') || 'produtos';
    setTab(currentTab);

    const loaded = loadStore();
    const next = loaded || seedStore();
    setStore(next);
    if (!loaded) saveStore(next);
    setReady(true);
  }, [router]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onPop = () => setTab(new URLSearchParams(window.location.search).get('tab') || 'produtos');
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const updateStore = (updater) => {
    setStore((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveStore(next);
      return next;
    });
  };

  const metrics = useMemo(() => {
    if (!store) {
      return { totalProdutos: 0, produtosAtivos: 0, totalUsuarias: 0, usuariasAtivas: 0, totalLiberacoes: 0 };
    }
    const totalProdutos = store.produtos.length;
    const produtosAtivos = store.produtos.filter((p) => p.ativo).length;
    const totalUsuarias = store.usuarias.length;
    const usuariasAtivas = store.usuarias.filter((u) => u.ativa).length;
    const totalLiberacoes = store.usuarias.reduce((sum, u) => sum + (u.acessos?.length || 0), 0);
    return { totalProdutos, produtosAtivos, totalUsuarias, usuariasAtivas, totalLiberacoes };
  }, [store]);

  if (!store) {
    return (
      <div className="section-tight pt-24 pb-24">
        <div className="card">
          <p className="text-sm text-text-muted">Carregando painel…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="section pt-14 pb-20">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">Admin</p>
          <h1 className="display-2 mt-2">Painel de Gestão</h1>
          <p className="text-sm text-text-muted mt-3 max-w-2xl">
            Demonstração de gestão do ecossistema digital: produtos, usuárias, liberações, planejamento editorial e engajamento.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            className="btn-outline"
            onClick={() => {
              localStorage.removeItem(STORE_KEY);
              const next = seedStore();
              setStore(next);
              saveStore(next);
            }}
          >
            Reset demo
          </button>
          <button
            className="btn-outline"
            onClick={() => {
              sessionStorage.removeItem(SESSION_KEY);
              router.replace('/');
            }}
          >
            Sair
          </button>
          <Link className="btn-primary" href="/planos">
            Ver vitrine
          </Link>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-3">
        <Kpi label="Produtos" value={metrics.totalProdutos} />
        <Kpi label="Ativos" value={metrics.produtosAtivos} />
        <Kpi label="Usuárias" value={metrics.totalUsuarias} />
        <Kpi label="Ativas" value={metrics.usuariasAtivas} />
        <Kpi label="Liberações" value={metrics.totalLiberacoes} />
      </div>

      <nav className="mt-8 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto" aria-label="Seções de gestão">
        <div className="flex gap-2 min-w-max pb-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`btn-sm ${tab === t.key ? 'btn-primary' : 'btn-outline'}`}
              type="button"
              aria-current={tab === t.key ? 'page' : undefined}
              onClick={() => {
                setTab(t.key);
                router.replace(`/admin/painel?tab=${t.key}`);
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="mt-8">
        {tab === 'produtos' && <TabProdutos store={store} updateStore={updateStore} />}
        {tab === 'usuarias' && <TabUsuarias store={store} updateStore={updateStore} />}
        {tab === 'liberacoes' && <TabLiberacoes store={store} updateStore={updateStore} />}
        {tab === 'ecossistema' && <TabEcossistema store={store} updateStore={updateStore} />}
        {tab === 'editorial' && <TabEditorial store={store} updateStore={updateStore} />}
        {tab === 'engajamento' && <TabEngajamento store={store} updateStore={updateStore} />}
      </div>

      {!ready && <div className="sr-only">Carregando…</div>}
    </div>
  );
}

function Kpi({ label, value }) {
  return (
    <div className="rounded-2xl border border-line bg-surface px-4 py-3">
      <div className="text-xs text-text-muted">{label}</div>
      <div className="mt-1 text-xl font-semibold text-text-strong tabular-nums">{value}</div>
    </div>
  );
}

function AdminProductIcon({ tipo }) {
  const t = String(tipo || '');
  const cls = 'stroke-current';
  if (t === 'livros' || t === 'livro') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={cls} aria-hidden="true">
        <path d="M6 4.5h12v15H7.5A1.5 1.5 0 006 21V4.5z" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="M9 8h6" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    );
  }
  if (t === 'digital') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={cls} aria-hidden="true">
        <path d="M6 7h12v9H6V7z" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="M9 19h6" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    );
  }
  if (t === 'eventos' || t === 'evento') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={cls} aria-hidden="true">
        <path d="M7 3v3M17 3v3" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M5 7h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2z" strokeWidth="1.7" strokeLinejoin="round" />
      </svg>
    );
  }
  if (t === 'viagens' || t === 'viagem') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={cls} aria-hidden="true">
        <path d="M12 21c4-4 7-7.5 7-11a7 7 0 10-14 0c0 3.5 3 7 7 11z" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="M12 11.5a2 2 0 100-4 2 2 0 000 4z" strokeWidth="1.7" />
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={cls} aria-hidden="true">
      <path d="M12 2l1.5 6.5L20 12l-6.5 1.5L12 20l-1.5-6.5L4 12l6.5-3.5L12 2z" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

function TabProdutos({ store, updateStore }) {
  const [draft, setDraft] = useState({ nome: '', tipo: 'digital', preco: 0 });
  const [query, setQuery] = useState('');
  const [onlyActive, setOnlyActive] = useState(false);

  const produtos = useMemo(() => {
    const q = query.trim().toLowerCase();
    return store.produtos.filter((p) => {
      if (onlyActive && !p.ativo) return false;
      if (!q) return true;
      return String(p.nome || '').toLowerCase().includes(q);
    });
  }, [store.produtos, query, onlyActive]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
      <div className="card">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-text-strong">Catálogo</h2>
            <p className="text-sm text-text-muted mt-1">Ative, edite e organize tudo que é vendido.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <div className="text-xs text-text-muted bg-surface-2 border border-line rounded-xl px-3 py-2">
              {produtos.length} itens
            </div>
            <label className="inline-flex items-center gap-2 text-sm text-text-muted">
              <input
                type="checkbox"
                checked={onlyActive}
                onChange={(e) => setOnlyActive(Boolean(e.target.checked))}
                className="h-4 w-4 rounded border-line text-brand-600 focus:ring-brand-500/30"
              />
              Somente ativos
            </label>
          </div>
        </div>

        <div className="mt-4">
          <label className="sr-only" htmlFor="prod-search">Buscar produto</label>
          <input
            id="prod-search"
            className="input"
            placeholder="Buscar por nome…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="mt-6 space-y-3 md:hidden">
          {produtos.map((p) => (
            <div key={p.id} className="rounded-2xl border border-line bg-surface p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="h-10 w-10 shrink-0 rounded-2xl border border-line bg-surface-2 text-text-strong grid place-items-center">
                    <AdminProductIcon tipo={p.tipo} />
                  </div>
                  <div className="min-w-0 flex-1">
                  <div className="text-xs text-text-muted">Nome</div>
                  <input
                    className="input !py-2 mt-2"
                    value={p.nome}
                    onChange={(e) =>
                      updateStore((prev) => ({
                        ...prev,
                        produtos: prev.produtos.map((x) => (x.id === p.id ? { ...x, nome: e.target.value } : x)),
                      }))
                    }
                  />
                  </div>
                </div>
                <button
                  className={`btn-sm ${p.ativo ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() =>
                    updateStore((prev) => ({
                      ...prev,
                      produtos: prev.produtos.map((x) => (x.id === p.id ? { ...x, ativo: !x.ativo } : x)),
                    }))
                  }
                >
                  {p.ativo ? 'Ativo' : 'Inativo'}
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-text-muted">Tipo</div>
                  <select
                    className="input !py-2 mt-2"
                    value={p.tipo}
                    onChange={(e) =>
                      updateStore((prev) => ({
                        ...prev,
                        produtos: prev.produtos.map((x) => (x.id === p.id ? { ...x, tipo: e.target.value } : x)),
                      }))
                    }
                  >
                    <option value="livros">Livros</option>
                    <option value="digital">Digital</option>
                    <option value="eventos">Eventos</option>
                    <option value="viagens">Viagens</option>
                  </select>
                </div>
                <div>
                  <div className="text-xs text-text-muted">Preço</div>
                  <input
                    className="input !py-2 mt-2"
                    inputMode="decimal"
                    value={p.preco}
                    onChange={(e) =>
                      updateStore((prev) => ({
                        ...prev,
                        produtos: prev.produtos.map((x) =>
                          x.id === p.id
                            ? {
                                ...x,
                                preco:
                                  Number(String(e.target.value).replace(/[^0-9.,]/g, '').replace(',', '.')) || 0,
                              }
                            : x
                        ),
                      }))
                    }
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-text-muted">{moneyBRL(p.preco)}</div>
                <button
                  className="btn-sm btn-ghost"
                  onClick={() => {
                    if (!window.confirm('Remover este item do catálogo?')) return;
                    updateStore((prev) => ({
                      ...prev,
                      produtos: prev.produtos.filter((x) => x.id !== p.id),
                      usuarias: prev.usuarias.map((u) => ({ ...u, acessos: u.acessos.filter((id) => id !== p.id) })),
                    }));
                  }}
                >
                  Remover
                </button>
              </div>
            </div>
          ))}

          {produtos.length === 0 && (
            <div className="rounded-2xl border border-line bg-surface-2 px-4 py-6 text-sm text-text-muted">
              Nenhum produto encontrado.
            </div>
          )}
        </div>

        <div className="mt-6 overflow-x-auto hidden md:block">
          <table className="w-full text-sm">
            <thead className="text-text-muted">
              <tr className="border-b border-line">
                <th className="py-3 text-left font-semibold w-12">&nbsp;</th>
                <th className="py-3 text-left font-semibold">Nome</th>
                <th className="py-3 text-left font-semibold">Tipo</th>
                <th className="py-3 text-left font-semibold">Preço</th>
                <th className="py-3 text-left font-semibold">Status</th>
                <th className="py-3 text-right font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((p) => (
                <tr key={p.id} className="border-b border-line last:border-b-0">
                  <td className="py-3 pr-3">
                    <div className="h-10 w-10 rounded-2xl border border-line bg-surface-2 text-text-strong grid place-items-center">
                      <AdminProductIcon tipo={p.tipo} />
                    </div>
                  </td>
                  <td className="py-3 pr-3">
                    <input
                      className="input !py-2"
                      value={p.nome}
                      onChange={(e) =>
                        updateStore((prev) => ({
                          ...prev,
                          produtos: prev.produtos.map((x) => (x.id === p.id ? { ...x, nome: e.target.value } : x)),
                        }))
                      }
                    />
                  </td>
                  <td className="py-3 pr-3">
                    <select
                      className="input !py-2"
                      value={p.tipo}
                      onChange={(e) =>
                        updateStore((prev) => ({
                          ...prev,
                          produtos: prev.produtos.map((x) => (x.id === p.id ? { ...x, tipo: e.target.value } : x)),
                        }))
                      }
                    >
                      <option value="livros">Livros</option>
                      <option value="digital">Digital</option>
                      <option value="eventos">Eventos</option>
                      <option value="viagens">Viagens</option>
                    </select>
                  </td>
                  <td className="py-3 pr-3">
                    <input
                      className="input !py-2"
                      inputMode="decimal"
                      value={p.preco}
                      onChange={(e) =>
                        updateStore((prev) => ({
                          ...prev,
                          produtos: prev.produtos.map((x) =>
                            x.id === p.id ? { ...x, preco: Number(String(e.target.value).replace(/[^0-9.,]/g, '').replace(',', '.')) || 0 } : x
                          ),
                        }))
                      }
                    />
                  </td>
                  <td className="py-3 pr-3">
                    <button
                      className={`btn-sm ${p.ativo ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() =>
                        updateStore((prev) => ({
                          ...prev,
                          produtos: prev.produtos.map((x) => (x.id === p.id ? { ...x, ativo: !x.ativo } : x)),
                        }))
                      }
                    >
                      {p.ativo ? 'Ativo' : 'Inativo'}
                    </button>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      className="btn-sm btn-ghost"
                      onClick={() => {
                        if (!window.confirm('Remover este item do catálogo?')) return;
                        updateStore((prev) => ({
                          ...prev,
                          produtos: prev.produtos.filter((x) => x.id !== p.id),
                          usuarias: prev.usuarias.map((u) => ({ ...u, acessos: u.acessos.filter((id) => id !== p.id) })),
                        }));
                      }}
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-text-strong">Novo item</h2>
        <p className="text-sm text-text-muted mt-1">Crie um item para aparecer na vitrine (demo local).</p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="label">Nome</label>
            <input className="input" value={draft.nome} onChange={(e) => setDraft((d) => ({ ...d, nome: e.target.value }))} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Tipo</label>
              <select className="input" value={draft.tipo} onChange={(e) => setDraft((d) => ({ ...d, tipo: e.target.value }))}>
                <option value="livros">Livros</option>
                <option value="digital">Digital</option>
                <option value="eventos">Eventos</option>
                <option value="viagens">Viagens</option>
              </select>
            </div>
            <div>
              <label className="label">Preço</label>
              <input
                className="input"
                inputMode="decimal"
                value={draft.preco}
                onChange={(e) => setDraft((d) => ({ ...d, preco: Number(String(e.target.value).replace(/[^0-9.,]/g, '').replace(',', '.')) || 0 }))}
              />
            </div>
          </div>

          <button
            className="btn-primary w-full"
            onClick={() => {
              const nome = draft.nome.trim();
              if (!nome) return;
              const id = `demo-${Math.random().toString(16).slice(2)}`;
              updateStore((prev) => ({
                ...prev,
                produtos: [{ id, nome, tipo: draft.tipo, preco: Number(draft.preco) || 0, ativo: true }, ...prev.produtos],
              }));
              setDraft({ nome: '', tipo: 'digital', preco: 0 });
            }}
          >
            Criar
          </button>

          <div className="rounded-xl border border-line bg-surface-2 px-4 py-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-text-muted">Preço exibido</span>
              <span className="font-semibold text-text-strong">{moneyBRL(draft.preco)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabUsuarias({ store, updateStore }) {
  const [filter, setFilter] = useState('todas');
  const [query, setQuery] = useState('');

  const usuarias = useMemo(() => {
    if (filter === 'ativas') return store.usuarias.filter((u) => u.ativa);
    if (filter === 'inativas') return store.usuarias.filter((u) => !u.ativa);
    return store.usuarias;
  }, [store.usuarias, filter]);

  const usuariasFiltradas = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return usuarias;
    return usuarias.filter((u) => {
      const nome = String(u.nome || '').toLowerCase();
      const email = String(u.email || '').toLowerCase();
      return nome.includes(q) || email.includes(q);
    });
  }, [usuarias, query]);

  return (
    <div className="card">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-text-strong">Usuárias</h2>
          <p className="text-sm text-text-muted mt-1">Controle de status, dados e acesso.</p>
        </div>
        <div className="flex gap-2">
          <button className={`btn-sm ${filter === 'todas' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter('todas')}>
            Todas
          </button>
          <button className={`btn-sm ${filter === 'ativas' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter('ativas')}>
            Ativas
          </button>
          <button className={`btn-sm ${filter === 'inativas' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter('inativas')}>
            Inativas
          </button>
        </div>
      </div>

      <div className="mt-4">
        <label className="sr-only" htmlFor="user-search">Buscar usuária</label>
        <input
          id="user-search"
          className="input"
          placeholder="Buscar por nome ou e-mail…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="mt-6 space-y-3 md:hidden">
        {usuariasFiltradas.map((u) => (
          <div key={u.id} className="rounded-2xl border border-line bg-surface p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-xs text-text-muted">Nome</div>
                <input
                  className="input !py-2 mt-2"
                  value={u.nome}
                  onChange={(e) =>
                    updateStore((prev) => ({
                      ...prev,
                      usuarias: prev.usuarias.map((x) => (x.id === u.id ? { ...x, nome: e.target.value } : x)),
                    }))
                  }
                />
              </div>
              <button
                className={`btn-sm ${u.ativa ? 'btn-primary' : 'btn-outline'}`}
                onClick={() =>
                  updateStore((prev) => ({
                    ...prev,
                    usuarias: prev.usuarias.map((x) => (x.id === u.id ? { ...x, ativa: !x.ativa } : x)),
                  }))
                }
              >
                {u.ativa ? 'Ativa' : 'Inativa'}
              </button>
            </div>

            <div className="mt-4 grid gap-3">
              <div>
                <div className="text-xs text-text-muted">E-mail</div>
                <input
                  className="input !py-2 mt-2"
                  value={u.email}
                  onChange={(e) =>
                    updateStore((prev) => ({
                      ...prev,
                      usuarias: prev.usuarias.map((x) => (x.id === u.id ? { ...x, email: e.target.value } : x)),
                    }))
                  }
                />
              </div>
              <div>
                <div className="text-xs text-text-muted">Telefone</div>
                <input
                  className="input !py-2 mt-2"
                  value={u.telefone}
                  onChange={(e) =>
                    updateStore((prev) => ({
                      ...prev,
                      usuarias: prev.usuarias.map((x) => (x.id === u.id ? { ...x, telefone: e.target.value } : x)),
                    }))
                  }
                />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-text-muted">{(u.acessos || []).length} liberações</div>
              <button
                className="btn-sm btn-ghost"
                onClick={() => {
                  if (!window.confirm('Remover esta usuária?')) return;
                  updateStore((prev) => ({
                    ...prev,
                    usuarias: prev.usuarias.filter((x) => x.id !== u.id),
                  }));
                }}
              >
                Remover
              </button>
            </div>
          </div>
        ))}

        {usuariasFiltradas.length === 0 && (
          <div className="rounded-2xl border border-line bg-surface-2 px-4 py-6 text-sm text-text-muted">
            Nenhuma usuária encontrada.
          </div>
        )}
      </div>

      <div className="mt-6 overflow-x-auto hidden md:block">
        <table className="w-full text-sm">
          <thead className="text-text-muted">
            <tr className="border-b border-line">
              <th className="py-3 text-left font-semibold">Nome</th>
              <th className="py-3 text-left font-semibold">E-mail</th>
              <th className="py-3 text-left font-semibold">Telefone</th>
              <th className="py-3 text-left font-semibold">Status</th>
              <th className="py-3 text-right font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuariasFiltradas.map((u) => (
              <tr key={u.id} className="border-b border-line last:border-b-0">
                <td className="py-3 pr-3">
                  <input
                    className="input !py-2"
                    value={u.nome}
                    onChange={(e) =>
                      updateStore((prev) => ({
                        ...prev,
                        usuarias: prev.usuarias.map((x) => (x.id === u.id ? { ...x, nome: e.target.value } : x)),
                      }))
                    }
                  />
                </td>
                <td className="py-3 pr-3">
                  <input
                    className="input !py-2"
                    value={u.email}
                    onChange={(e) =>
                      updateStore((prev) => ({
                        ...prev,
                        usuarias: prev.usuarias.map((x) => (x.id === u.id ? { ...x, email: e.target.value } : x)),
                      }))
                    }
                  />
                </td>
                <td className="py-3 pr-3">
                  <input
                    className="input !py-2"
                    value={u.telefone}
                    onChange={(e) =>
                      updateStore((prev) => ({
                        ...prev,
                        usuarias: prev.usuarias.map((x) => (x.id === u.id ? { ...x, telefone: e.target.value } : x)),
                      }))
                    }
                  />
                </td>
                <td className="py-3 pr-3">
                  <button
                    className={`btn-sm ${u.ativa ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() =>
                      updateStore((prev) => ({
                        ...prev,
                        usuarias: prev.usuarias.map((x) => (x.id === u.id ? { ...x, ativa: !x.ativa } : x)),
                      }))
                    }
                  >
                    {u.ativa ? 'Ativa' : 'Inativa'}
                  </button>
                </td>
                <td className="py-3 text-right">
                  <button
                    className="btn-sm btn-ghost"
                    onClick={() => {
                      if (!window.confirm('Remover esta usuária?')) return;
                      updateStore((prev) => ({
                        ...prev,
                        usuarias: prev.usuarias.filter((x) => x.id !== u.id),
                      }));
                    }}
                  >
                    Remover
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TabLiberacoes({ store, updateStore }) {
  const produtosAtivos = store.produtos.filter((p) => p.ativo);
  const [query, setQuery] = useState('');
  const [onlyActiveUsers, setOnlyActiveUsers] = useState(true);

  const usuarias = useMemo(() => {
    const q = query.trim().toLowerCase();
    return store.usuarias.filter((u) => {
      if (onlyActiveUsers && !u.ativa) return false;
      if (!q) return true;
      return String(u.nome || '').toLowerCase().includes(q) || String(u.email || '').toLowerCase().includes(q);
    });
  }, [store.usuarias, query, onlyActiveUsers]);

  return (
    <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
      <div className="card">
        <h2 className="text-lg font-semibold text-text-strong">Produtos ativos</h2>
        <p className="text-sm text-text-muted mt-1">Base para controle de liberações.</p>
        <ul className="mt-6 space-y-2 text-sm">
          {produtosAtivos.map((p) => (
            <li key={p.id} className="flex items-center justify-between rounded-xl border border-line bg-surface-2 px-4 py-3">
              <div>
                <div className="font-semibold text-text-strong">{p.nome}</div>
                <div className="text-xs text-text-muted mt-0.5">{segmentLabel(p.tipo)}</div>
              </div>
              <div className="text-sm font-semibold text-text-strong">{moneyBRL(p.preco)}</div>
            </li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-text-strong">Liberações por usuária</h2>
        <p className="text-sm text-text-muted mt-1">Marque itens liberados (aceites/entregas).</p>

        <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
          <input
            className="input"
            placeholder="Buscar usuária…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <label className="inline-flex items-center gap-2 text-sm text-text-muted">
            <input
              type="checkbox"
              checked={onlyActiveUsers}
              onChange={(e) => setOnlyActiveUsers(Boolean(e.target.checked))}
              className="h-4 w-4 rounded border-line text-brand-600 focus:ring-brand-500/30"
            />
            Somente ativas
          </label>
        </div>

        <div className="mt-6 space-y-5">
          {usuarias.map((u) => (
            <div key={u.id} className="rounded-2xl border border-line bg-surface p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold text-text-strong">{u.nome}</div>
                  <div className="text-xs text-text-muted mt-0.5">{u.email}</div>
                </div>
                <div className={`text-xs rounded-xl px-3 py-2 border ${u.ativa ? 'bg-brand-50 border-brand-200 text-brand-900' : 'bg-surface-2 border-line text-text-muted'}`}>
                  {u.ativa ? 'Ativa' : 'Inativa'}
                </div>
              </div>

              <div className="mt-4 grid sm:grid-cols-2 gap-2">
                {store.produtos.map((p) => {
                  const checked = u.acessos.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      className={`text-left rounded-xl border px-4 py-3 transition-colors ${
                        checked ? 'bg-brand-50 border-brand-200 text-brand-900' : 'bg-surface-2 border-line text-text-strong hover:border-line-strong'
                      }`}
                      onClick={() =>
                        updateStore((prev) => ({
                          ...prev,
                          usuarias: prev.usuarias.map((x) =>
                            x.id === u.id
                              ? {
                                  ...x,
                                  acessos: checked ? x.acessos.filter((id) => id !== p.id) : [...x.acessos, p.id],
                                }
                              : x
                          ),
                        }))
                      }
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="font-semibold">{p.nome}</div>
                        <div className="text-xs">{checked ? 'Liberado' : 'Bloqueado'}</div>
                      </div>
                      <div className="text-xs text-text-muted mt-1">{segmentLabel(p.tipo)}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TabEcossistema({ store, updateStore }) {
  const items = [
    { key: 'instagram', title: 'Instagram', desc: 'Conexão e insights do perfil.' },
    { key: 'facebook', title: 'Facebook Page', desc: 'Publicações e comunidade.' },
    { key: 'linkedin', title: 'LinkedIn', desc: 'Autoridade e networking.' },
    { key: 'googleAds', title: 'Google Ads', desc: 'Campanhas e conversões.' },
    { key: 'metaAds', title: 'Facebook Manager', desc: 'Meta Ads e públicos.' },
  ];

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-text-strong">Conexões</h2>
            <p className="text-sm text-text-muted mt-1">Demonstração de integrações e status do ecossistema.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              className="btn-outline"
              onClick={() =>
                updateStore((prev) => ({
                  ...prev,
                  ecossistema: Object.fromEntries(Object.keys(prev.ecossistema).map((k) => [k, { connected: true }])),
                }))
              }
            >
              Conectar tudo
            </button>
            <button
              className="btn-ghost"
              onClick={() =>
                updateStore((prev) => ({
                  ...prev,
                  ecossistema: Object.fromEntries(Object.keys(prev.ecossistema).map((k) => [k, { connected: false }])),
                }))
              }
            >
              Desconectar tudo
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
      {items.map((it) => {
        const connected = store.ecossistema?.[it.key]?.connected;
        return (
          <div key={it.key} className="card">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-text-strong">{it.title}</h2>
                <p className="text-sm text-text-muted mt-1">{it.desc}</p>
              </div>
              <div className={`text-xs rounded-xl px-3 py-2 border ${connected ? 'bg-brand-50 border-brand-200 text-brand-900' : 'bg-surface-2 border-line text-text-muted'}`}>
                {connected ? 'Conectado' : 'Não conectado'}
              </div>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                className={connected ? 'btn-outline' : 'btn-primary'}
                onClick={() =>
                  updateStore((prev) => ({
                    ...prev,
                    ecossistema: {
                      ...prev.ecossistema,
                      [it.key]: { connected: true },
                    },
                  }))
                }
              >
                {connected ? 'Revalidar conexão' : 'Conectar'}
              </button>
              <button
                className="btn-ghost"
                onClick={() =>
                  updateStore((prev) => ({
                    ...prev,
                    ecossistema: {
                      ...prev.ecossistema,
                      [it.key]: { connected: false },
                    },
                  }))
                }
              >
                Desconectar
              </button>
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
}

function TabEditorial({ store, updateStore }) {
  const [cursor, setCursor] = useState(() => new Date());
  const [selected, setSelected] = useState(() => formatDateKey(new Date()));
  const [draft, setDraft] = useState('');

  const monthStart = startOfMonth(cursor);
  const monthEnd = endOfMonth(cursor);

  const days = useMemo(() => {
    const firstDayWeek = monthStart.getDay();
    const leading = (firstDayWeek + 6) % 7;
    const totalDays = monthEnd.getDate();
    const out = [];

    for (let i = 0; i < leading; i += 1) out.push(null);
    for (let d = 1; d <= totalDays; d += 1) out.push(new Date(cursor.getFullYear(), cursor.getMonth(), d));
    return out;
  }, [cursor, monthStart, monthEnd]);

  const tasks = store.editorial?.byDate?.[selected] || [];

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="card">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-text-strong">Calendário Editorial</h2>
            <p className="text-sm text-text-muted mt-1">Planejamento de ações, redes e lançamentos.</p>
          </div>
          <div className="flex gap-2">
            <button className="btn-outline btn-sm" onClick={() => setCursor((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}>
              ←
            </button>
            <button className="btn-outline btn-sm" onClick={() => setCursor(new Date())}>
              Hoje
            </button>
            <button className="btn-outline btn-sm" onClick={() => setCursor((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}>
              →
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-7 gap-2 text-xs text-text-muted">
          {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((x) => (
            <div key={x} className="text-center font-semibold">{x}</div>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-7 gap-2">
          {days.map((d, idx) => {
            if (!d) return <div key={`e-${idx}`} className="h-12" />;
            const key = formatDateKey(d);
            const isSelected = key === selected;
            const has = (store.editorial?.byDate?.[key] || []).length > 0;
            return (
              <button
                key={key}
                className={`h-12 rounded-xl border text-sm font-semibold transition-colors ${
                  isSelected ? 'bg-brand-50 border-brand-200 text-brand-900' : 'bg-surface border-line hover:border-line-strong'
                }`}
                onClick={() => setSelected(key)}
              >
                <div className="flex items-center justify-center gap-2">
                  <span>{d.getDate()}</span>
                  {has && <span className="h-1.5 w-1.5 rounded-full bg-accent-500" aria-hidden="true" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-text-strong">Ações do dia</h2>
        <p className="text-sm text-text-muted mt-1">{selected}</p>

        <div className="mt-6 space-y-3">
          <label className="label">Nova ação</label>
          <textarea className="input" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Ex.: Post Instagram (carrossel) + Stories com CTA para /planos" />
          <button
            className="btn-primary w-full"
            onClick={() => {
              const text = draft.trim();
              if (!text) return;
              updateStore((prev) => {
                const byDate = { ...(prev.editorial?.byDate || {}) };
                const list = byDate[selected] ? [...byDate[selected]] : [];
                list.unshift({ id: `t-${Date.now()}`, text });
                byDate[selected] = list;
                return { ...prev, editorial: { ...prev.editorial, byDate } };
              });
              setDraft('');
            }}
          >
            Adicionar
          </button>
        </div>

        <div className="mt-6 space-y-2">
          {tasks.length === 0 && <div className="text-sm text-text-muted">Sem ações para este dia.</div>}
          {tasks.map((t) => (
            <div key={t.id} className="rounded-xl border border-line bg-surface-2 px-4 py-3">
              <div className="flex items-start justify-between gap-4">
                <div className="text-sm text-text-strong whitespace-pre-wrap">{t.text}</div>
                <button
                  className="btn-sm btn-ghost"
                  onClick={() =>
                    updateStore((prev) => {
                      const byDate = { ...(prev.editorial?.byDate || {}) };
                      byDate[selected] = (byDate[selected] || []).filter((x) => x.id !== t.id);
                      return { ...prev, editorial: { ...prev.editorial, byDate } };
                    })
                  }
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TabEngajamento({ store, updateStore }) {
  const [draft, setDraft] = useState({ nome: '', status: 'Rascunho' });

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
      <div className="card">
        <h2 className="text-lg font-semibold text-text-strong">Email marketing</h2>
        <p className="text-sm text-text-muted mt-1">Jornadas, sequências e métricas (demo).</p>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-text-muted">
              <tr className="border-b border-line">
                <th className="py-3 text-left font-semibold">Sequência</th>
                <th className="py-3 text-left font-semibold">Status</th>
                <th className="py-3 text-left font-semibold">Envios</th>
                <th className="py-3 text-left font-semibold">Abertura</th>
                <th className="py-3 text-left font-semibold">Cliques</th>
                <th className="py-3 text-right font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {store.engajamento.sequences.map((s) => (
                <tr key={s.id} className="border-b border-line last:border-b-0">
                  <td className="py-3 pr-3">
                    <div className="font-semibold text-text-strong">{s.nome}</div>
                  </td>
                  <td className="py-3 pr-3">
                    <select
                      className="input !py-2"
                      value={s.status}
                      onChange={(e) =>
                        updateStore((prev) => ({
                          ...prev,
                          engajamento: {
                            ...prev.engajamento,
                            sequences: prev.engajamento.sequences.map((x) => (x.id === s.id ? { ...x, status: e.target.value } : x)),
                          },
                        }))
                      }
                    >
                      <option value="Ativa">Ativa</option>
                      <option value="Pausada">Pausada</option>
                      <option value="Rascunho">Rascunho</option>
                    </select>
                  </td>
                  <td className="py-3 pr-3">{s.envios}</td>
                  <td className="py-3 pr-3">{s.abertura}%</td>
                  <td className="py-3 pr-3">{s.clique}%</td>
                  <td className="py-3 text-right">
                    <button
                      className="btn-sm btn-ghost"
                      onClick={() =>
                        updateStore((prev) => ({
                          ...prev,
                          engajamento: {
                            ...prev.engajamento,
                            sequences: prev.engajamento.sequences.filter((x) => x.id !== s.id),
                          },
                        }))
                      }
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-text-strong">Nova sequência</h2>
        <p className="text-sm text-text-muted mt-1">Crie uma jornada de e-mails (demo).</p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="label">Nome</label>
            <input className="input" value={draft.nome} onChange={(e) => setDraft((d) => ({ ...d, nome: e.target.value }))} />
          </div>
          <div>
            <label className="label">Status</label>
            <select className="input" value={draft.status} onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value }))}>
              <option value="Rascunho">Rascunho</option>
              <option value="Ativa">Ativa</option>
              <option value="Pausada">Pausada</option>
            </select>
          </div>
          <button
            className="btn-primary w-full"
            onClick={() => {
              const nome = draft.nome.trim();
              if (!nome) return;
              updateStore((prev) => ({
                ...prev,
                engajamento: {
                  ...prev.engajamento,
                  sequences: [
                    { id: `s-${Date.now()}`, nome, status: draft.status, envios: 0, abertura: 0, clique: 0 },
                    ...prev.engajamento.sequences,
                  ],
                },
              }));
              setDraft({ nome: '', status: 'Rascunho' });
            }}
          >
            Criar
          </button>
        </div>
      </div>
    </div>
  );
}
