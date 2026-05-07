import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import { listProducts, getSegments } from '@/lib/products';

const VIAGENS_BANNER_BG = '/banners/viagens-cruzeiro-2027.jpg';

export const metadata = { title: 'Experiências' };

export default function PlanosPage() {
  const produtos = listProducts();
  const segments = getSegments();

  return (
    <div className="relative">
      <div className="absolute inset-x-0 top-0 h-[420px] bg-mesh-brand pointer-events-none" aria-hidden="true" />

      <div className="relative section py-20">
        <div className="max-w-2xl">
          <p className="eyebrow">Experiências</p>
          <h1 className="display-2 mt-3">Criadas especialmente para mulheres extraordinárias.</h1>
          <p className="lead mt-4">
            Cada experiência é pensada para expandir sua consciência, fortalecer sua essência e conectar você com sua tribu.
          </p>
        </div>

        {/* Navegação por segmentos */}
        <div className="mt-12 flex flex-wrap gap-3">
          {segments.map((segment) => (
            <Link
              key={segment.id}
              href={`#${segment.id}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-ink-200 text-sm font-medium text-text hover:border-brand-300 hover:text-brand-700 transition-colors"
            >
              {segment.nome}
            </Link>
          ))}
        </div>

        {/* Seção Livros */}
        <section id="livros" className="mt-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-700 grid place-items-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" stroke="currentColor" strokeWidth="1.6" />
                <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </div>
            <div>
              <h2 className="font-display text-2xl font-semibold text-text-strong">Livros</h2>
              <p className="text-text-muted">Literatura empoderadora para sua jornada</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {produtos.filter(p => p.tipo === 'livro').map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        {/* Seção Digital */}
        <section id="digital" className="mt-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-accent-100 text-accent-700 grid place-items-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.6" />
                <path d="M3 9h18M9 21V9" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </div>
            <div>
              <h2 className="font-display text-2xl font-semibold text-text-strong">Digital</h2>
              <p className="text-text-muted">Conteúdo online e comunidades</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {produtos.filter(p => p.tipo === 'digital').map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        {/* Seção Eventos */}
        <section id="eventos" className="mt-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-700 grid place-items-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M8 2v4M16 2v4M3 9h18M5 5h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h2 className="font-display text-2xl font-semibold text-text-strong">Eventos</h2>
              <p className="text-text-muted">Encontros transformadores</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {produtos.filter(p => p.tipo === 'evento').map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        {/* Seção Viagens - Especial */}
        <section id="viagem" className="mt-16">
          <div className="card border-accent-200 bg-gradient-to-br from-accent-50 to-brand-50 p-8">
            <div className="relative overflow-hidden rounded-3xl border border-line bg-ink-950 mb-8">
              <div className="relative aspect-[1024/451]">
                <Image
                  src={VIAGENS_BANNER_BG}
                  alt="Banner Cruzeiro Mulheres em Movimento"
                  fill
                  sizes="(max-width: 768px) 100vw, 900px"
                  quality={86}
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-accent-100 text-accent-700 grid place-items-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <h2 className="font-display text-2xl font-semibold text-text-strong">Viagens em Movimento</h2>
                <p className="text-text-muted">Experiências únicas ao redor do mundo</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {produtos.filter(p => p.tipo === 'viagem').map((p) => (
                <div key={p.id} className="bg-white rounded-2xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-text-strong mb-1">{p.nome}</h3>
                      <p className="text-sm text-text-muted">{p.headline}</p>
                    </div>
                    <span className="text-xs bg-accent-100 text-accent-700 px-2 py-1 rounded">Exclusivo</span>
                  </div>
                  <p className="text-sm text-text-muted mb-4">{p.promise}</p>
                  <Link href="/interesse-viagens" className="btn-primary text-sm">
                    Manifestar interesse
                  </Link>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link href="/interesse-viagens" className="btn-outline">
                Quero ser avisada sobre novas viagens
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Depoimentos */}
        <section className="mt-16">
          <div className="text-center max-w-2xl mx-auto">
            <p className="eyebrow">Transformações</p>
            <h2 className="display-2 mt-3">Histórias de mulheres extraordinárias.</h2>
            <p className="lead mt-4">
              Conheça as jornadas de mulheres que transformaram suas vidas através de nossas experiências.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 grid place-items-center text-white font-display font-semibold">
                  A
                </div>
                <div>
                  <p className="font-semibold text-text-strong">Ana Paula</p>
                  <p className="text-sm text-text-muted">São Paulo</p>
                </div>
              </div>
              <p className="text-sm text-text-muted leading-relaxed">
                &ldquo;A jornada à Índia me reconectou com minha essência. Foi uma experiência transformadora que mudou minha perspectiva sobre vida e propósito.&rdquo;
              </p>
            </div>
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 grid place-items-center text-white font-display font-semibold">
                  C
                </div>
                <div>
                  <p className="font-semibold text-text-strong">Carolina Mendes</p>
                  <p className="text-sm text-text-muted">Rio de Janeiro</p>
                </div>
              </div>
              <p className="text-sm text-text-muted leading-relaxed">
                &ldquo;O Círculo de Mulheres me trouxe amizades verdadeiras e um espaço seguro para crescer. Hoje sou uma mulher mais confiante e realizada.&rdquo;
              </p>
            </div>
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-300 to-brand-500 grid place-items-center text-white font-display font-semibold">
                  B
                </div>
                <div>
                  <p className="font-semibold text-text-strong">Beatriz Silva</p>
                  <p className="text-sm text-text-muted">Belo Horizonte</p>
                </div>
              </div>
              <p className="text-sm text-text-muted leading-relaxed">
                &ldquo;O Despertar Feminino me ajudou a encontrar minha voz e propósito. Recomendo para toda mulher que busca autenticidade.&rdquo;
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
