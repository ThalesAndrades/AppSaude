'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import InteractiveButton from '@/components/InteractiveButton';
import { showSuccessToast, showErrorToast } from '@/components/ToastSystem';

const VIAGENS_BANNER_BG = '/banners/viagens-cruzeiro-2027.jpg';

export default function InteresseViagensPage() {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    viagemInteresse: '',
    mensagem: '',
  });
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [vagasRestantes, setVagasRestantes] = useState(7);
  const [pessoasVendo, setPessoasVendo] = useState(12);

  useEffect(() => {
    setPessoasVendo(Math.floor(Math.random() * 15) + 5);
  }, []);

  async function enviar(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 900));
      showSuccessToast(
        'Interesse registrado com sucesso!',
        'Entraremos em contato em breve com mais informações sobre as próximas viagens exclusivas.'
      );
      setEnviado(true);
      setVagasRestantes((prev) => Math.max(0, prev - 1));
    } catch {
      showErrorToast('Erro ao enviar interesse', 'Por favor, tente novamente em alguns instantes.');
    } finally {
      setLoading(false);
    }
  }

  if (enviado) {
    return (
      <div className="section-tight pt-16 pb-24">
        <div className="card p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-accent-100 text-accent-700 grid place-items-center mx-auto mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="display-3 mb-4">Interesse registrado!</h1>
          <p className="lead text-text-muted mb-8">
            Recebemos sua manifestação de interesse. Entraremos em contato em breve com mais informações sobre as próximas viagens exclusivas.
          </p>
          <Link href="/planos" className="btn-primary">
            Voltar para a vitrine
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section pt-10 pb-20">
      <div className="max-w-4xl">
        <div className="relative overflow-hidden rounded-3xl border border-line bg-ink-950">
          <div className="relative aspect-[1024/451]">
            <Image
              src={VIAGENS_BANNER_BG}
              alt="Banner Cruzeiro Mulheres em Movimento"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 900px"
              quality={88}
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="eyebrow">Viagens em Movimento</p>
            <h1 className="display-2 mt-2">Manifeste seu interesse</h1>
            <p className="lead mt-3 max-w-2xl">
              Experiências únicas e selecionadas. Deixe seus dados e entraremos em contato quando abrirmos novas vagas.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="rounded-2xl border border-line bg-surface px-4 py-3 text-sm">
              <div className="text-text-muted">Vagas</div>
              <div className="text-text-strong font-semibold">{vagasRestantes} restantes</div>
            </div>
            <div className="rounded-2xl border border-line bg-surface px-4 py-3 text-sm">
              <div className="text-text-muted">Agora</div>
              <div className="text-text-strong font-semibold">{pessoasVendo} visualizando</div>
            </div>
          </div>
        </div>

        <div className="mt-8 card p-8">
          <form onSubmit={enviar} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="label" htmlFor="nome">Nome completo</label>
                <input
                  type="text"
                  id="nome"
                  className="input mt-1.5"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="label" htmlFor="email">E-mail</label>
                <input
                  type="email"
                  id="email"
                  className="input mt-1.5"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="label" htmlFor="telefone">Telefone</label>
                <input
                  type="tel"
                  id="telefone"
                  className="input mt-1.5"
                  value={form.telefone}
                  onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="label" htmlFor="viagemInteresse">Qual tipo de viagem mais te interessa?</label>
                <select
                  id="viagemInteresse"
                  className="input mt-1.5"
                  value={form.viagemInteresse}
                  onChange={(e) => setForm({ ...form, viagemInteresse: e.target.value })}
                  required
                >
                  <option value="">Selecione uma opção</option>
                  <option value="india">Viagem à Índia Sagrada</option>
                  <option value="mediterraneo">Cruzeiro pelo Mediterrâneo</option>
                  <option value="machu">Machu Picchu e Sagrado Feminino</option>
                  <option value="bali">Retiro em Bali</option>
                  <option value="egito">Egito e as Deusas</option>
                  <option value="todas">Todas as opções</option>
                </select>
              </div>
            </div>

            <div>
              <label className="label" htmlFor="mensagem">Mensagem (opcional)</label>
              <textarea
                id="mensagem"
                rows={4}
                className="input mt-1.5"
                placeholder="Compartilhe sua história, expectativas e o que busca nesta jornada..."
                value={form.mensagem}
                onChange={(e) => setForm({ ...form, mensagem: e.target.value })}
              />
            </div>

            <div className="rounded-2xl border border-line bg-surface-2/60 px-4 py-3">
              <p className="text-sm text-text-muted">
                <strong>Importante:</strong> As vagas são limitadas e selecionadas com cuidado. O processo considera alinhamento com os valores da comunidade.
              </p>
            </div>

            <InteractiveButton type="submit" loading={loading} className="w-full">
              {loading ? 'Enviando interesse...' : 'Manifestar interesse'}
            </InteractiveButton>
          </form>
        </div>
      </div>
    </div>
  );
}
