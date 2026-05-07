'use client';

import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { listProducts, getSegments } from '@/lib/products';
import AnimatedSection from '@/components/AnimatedSection';
import ParallaxHero from '@/components/ParallaxHero';
import SocialProof from '@/components/SocialProof';
import InteractiveButton from '@/components/InteractiveButton';
import HeroBackground4K from '@/components/HeroBackground4K';
import NewsRotator from '@/components/NewsRotator';
import { motion } from 'framer-motion';

const HERO_BENEFITS = [
  'Experiências únicas',
  'Comunidade acolhedora',
  'Transformação real',
  'Networking autêntico',
  'Crescimento contínuo',
  'Empoderamento feminino',
];

const STEPS = [
  ['Explore nosso universo', 'Descubra experiências criadas especialmente para mulheres extraordinárias.'],
  ['Conecte-se com sua tribo', 'Faça parte de uma comunidade que se apoia e cresce junta.'],
  ['Transforme sua jornada', 'Viva experiências que expandem sua consciência e empoderam sua essência.'],
];

const EXPERIENCE_POINTS = [
  {
    t: 'Biblioteca Pessoal',
    d: 'Acesse conteúdos exclusivos, livros digitais e materiais de transformação em um só lugar.',
    icon: (
      <path d="M4 6h16M4 12h16M4 18h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    ),
  },
  {
    t: 'Comunidade Vibrante',
    d: 'Conecte-se com mulheres extraordinárias que compartilham sua jornada de crescimento.',
    icon: (
      <path d="M17 20v-4a4 4 0 00-4-4H5a4 4 0 00-4 4v4M8 12a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    t: 'Experiências Únicas',
    d: 'Participe de eventos, retiros e viagens transformadoras ao redor do mundo.',
    icon: (
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
];

export default function HomePage() {
  const produtos = listProducts();
  const segments = getSegments();

  return (
    <>
      <section className="relative overflow-hidden min-h-screen flex items-center">
        <HeroBackground4K />

        <div className="relative section pt-12 pb-20 sm:pt-16 sm:pb-24 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-14 items-start">
          <AnimatedSection className="space-y-8 glass rounded-3xl p-6 sm:p-8">
            <motion.span 
              className="inline-flex items-center gap-2 rounded-full bg-surface/80 backdrop-blur ring-1 ring-line px-3 py-1 text-xs font-semibold text-brand-700 dark:text-brand-300 shadow-soft"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-brand-500">
                <Sparkle />
              </span>
              Mulheres em Movimento
            </motion.span>

            <motion.h1 
              className="display"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Transforme sua jornada,<br />
              <motion.span 
                className="italic font-light text-brand-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                conecte-se com sua essência.
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="lead max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              Um espaço sagrado onde mulheres extraordinárias se encontram para crescer, transformar e criar conexões autênticas através de experiências únicas.
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <InteractiveButton onClick={() => window.location.href='/minha-conta'}>
                Começar minha jornada →
              </InteractiveButton>
              <InteractiveButton variant="secondary" onClick={() => window.location.href='/planos'}>
                Explorar experiências
              </InteractiveButton>
            </motion.div>

            <div className="lg:hidden rounded-2xl border border-line bg-surface/85 backdrop-blur px-4 py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-text-strong">Teste de conexão pessoal</p>
                  <p className="text-xs text-text-muted mt-1">Um check rápido para entender seu momento.</p>
                </div>
                <Link href="/minha-conta/boas-vindas?teste=conexao" className="btn-outline btn-sm no-underline">
                  Iniciar →
                </Link>
              </div>
            </div>

            <motion.ul 
              className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-5 text-sm text-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              {HERO_BENEFITS.map((b, index) => (
                <motion.li 
                  key={b} 
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                  {b}
                </motion.li>
              ))}
            </motion.ul>
          </AnimatedSection>

          {/* Visual: preview da área interna */}
          <AnimatedSection className="relative hidden lg:block self-start -mt-6" delay={0.3}>
            <div className="absolute -inset-8 bg-mesh-brand blur-2xl opacity-70" aria-hidden="true" />
            <motion.div 
              className="relative rounded-3xl border border-line bg-surface shadow-[var(--shadow-3)] p-2"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 260 }}
            >
              <div className="rounded-2xl bg-gradient-to-br from-ink-950 to-ink-800 p-5 text-white">
                <div className="flex items-center gap-3">
                  <motion.div 
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 grid place-items-center font-display text-lg"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    M
                  </motion.div>
                  <div>
                    <p className="text-sm font-semibold">Sua jornada começa aqui</p>
                    <p className="text-xs text-white/60">Transformação e conexão</p>
                  </div>
                  <span className="ml-auto badge-brand bg-brand-400/15 text-brand-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                    Em evolução
                  </span>
                </div>

                <div className="mt-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold">Convite: teste de conexão pessoal</p>
                      <p className="text-xs text-white/65 mt-1">2 minutos · recomendações personalizadas</p>
                    </div>
                    <Link
                      href="/minha-conta/boas-vindas?teste=conexao"
                      className="btn bg-white text-ink-950 hover:bg-ink-100 no-underline btn-sm"
                    >
                      Fazer teste →
                    </Link>
                  </div>
                </div>

                <div className="mt-4 h-40 rounded-xl bg-gradient-to-br from-brand-700/35 to-ink-900 grid place-items-center text-white/60 text-sm">
                  <div className="flex flex-col items-center gap-2">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M4 6h16M4 12h16M4 18h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <span>Sua biblioteca pessoal</span>
                  </div>
                </div>

                <div className="mt-3 flex justify-between text-xs">
                  <span className="text-white/60">Próxima etapa</span>
                  <span className="text-white font-semibold">Conectar-se</span>
                </div>

              </div>
            </motion.div>

            {/* Floating chip */}
            <motion.div 
              className="absolute -left-8 top-10 rounded-2xl bg-surface shadow-[var(--shadow-3)] border border-line p-3 flex items-center gap-3 w-[280px]"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              whileHover={{ scale: 1.03 }}
            >
              <div className="w-10 h-10 rounded-xl bg-accent-100 text-accent-700 dark:bg-accent-500/15 dark:text-accent-300 grid place-items-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-text-strong">Progresso salvo</p>
                <p className="text-xs text-text-muted">retome de onde parou</p>
              </div>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      <NewsRotator />

      {/* ============= PRODUCTS ============= */}
      <section id="produtos" className="section py-24">
        <AnimatedSection>
          <div className="max-w-2xl">
            <motion.p 
              className="eyebrow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Experiências
            </motion.p>
            <motion.h2 
              className="display-2 mt-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Criadas especialmente para
              <br />
              <span className="text-brand-700">mulheres extraordinárias.</span>
            </motion.h2>
            <motion.p 
              className="lead mt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Cada experiência é pensada para expandir sua consciência, fortalecer sua essência e conectar você com sua tribu.
            </motion.p>
          </div>
        </AnimatedSection>

        <div className="grid lg:grid-cols-4 gap-6 mt-12">
          {segments.map((segment, index) => (
            <AnimatedSection key={segment.id} delay={index * 0.1}>
              <motion.div 
                className="card text-center p-6 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 260 }}
                onClick={() => window.location.href = `/planos#${segment.id}`}
              >
                <motion.div 
                  className="w-12 h-12 rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300 grid place-items-center mx-auto mb-4"
                  whileHover={{ scale: 1.06 }}
                  transition={{ type: "spring", stiffness: 260 }}
                >
                  {segment.id === 'livros' && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" stroke="currentColor" strokeWidth="1.6" />
                      <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" stroke="currentColor" strokeWidth="1.6" />
                    </svg>
                  )}
                  {segment.id === 'digital' && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.6" />
                      <path d="M3 9h18M9 21V9" stroke="currentColor" strokeWidth="1.6" />
                    </svg>
                  )}
                  {segment.id === 'eventos' && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M8 2v4M16 2v4M3 9h18M5 5h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  {segment.id === 'viagem' && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </motion.div>
                <h3 className="font-display text-lg font-semibold text-text-strong mb-2">{segment.nome}</h3>
                <p className="text-sm text-text-muted mb-4">{segment.descricao}</p>
                <motion.div
                  className="btn-outline text-sm inline-block"
                  whileHover={{ scale: 1.05 }}
                >
                  Explorar {segment.nome}
                </motion.div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.5}>
          <motion.div 
            className="mt-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.div 
              className="card border-accent-200 bg-gradient-to-br from-accent-50 to-white p-8 text-center"
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 20px 40px rgba(204, 152, 53, 0.2)"
              }}
            >
              <div className="max-w-2xl mx-auto">
                <motion.h3 
                  className="font-display text-xl font-semibold text-text-strong mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Viagens em Movimento
                </motion.h3>
                <motion.p 
                  className="text-text-muted mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Descubra experiências únicas ao redor do mundo. Cada jornada é cuidadosamente planejada para transformar e expandir sua consciência.
                </motion.p>
                <InteractiveButton onClick={() => window.location.href='/interesse-viagens'}>
                  Manifestar interesse →
                </InteractiveButton>
              </div>
            </motion.div>
          </motion.div>
        </AnimatedSection>
      </section>

      {/* ============= HOW IT WORKS ============= */}
      <section id="como-funciona" className="bg-gradient-to-b from-surface-2 to-bg border-y border-line">
        <div className="section py-24">
          <div className="max-w-2xl">
            <p className="eyebrow">Como funciona</p>
            <h2 className="display-2 mt-3">Três passos para sua transformação.</h2>
          </div>
          <ol className="mt-12 grid md:grid-cols-3 gap-6">
            {STEPS.map(([t, d], i) => (
              <li key={t} className="card-hover relative">
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-brand-500 text-white text-sm font-semibold grid place-items-center shadow-md">
                  {i + 1}
                </div>
                <div className="p-6">
                  <h3 className="font-display text-lg font-semibold text-text-strong mb-2">{t}</h3>
                  <p className="text-sm text-text-muted leading-relaxed">{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============= EXPERIENCE ============= */}
      <section className="section py-24">
        <div className="max-w-2xl">
          <p className="eyebrow">Experiência</p>
          <h2 className="display-2 mt-3">Desenhada para criar conexões profundas.</h2>
          <p className="lead mt-4">
            Cada detalhe foi pensado para que você se sinta acolhida, inspirada e pronta para expandir seus horizontes.
          </p>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {EXPERIENCE_POINTS.map(({ t, d, icon }) => (
            <div key={t} className="card-hover">
              <div className="w-11 h-11 rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300 grid place-items-center mb-5">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">{icon}</svg>
              </div>
              <h3 className="font-display text-xl font-semibold text-text-strong">{t}</h3>
              <p className="text-sm text-text-muted mt-2 leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============= CTA FINAL ============= */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600 to-brand-800" aria-hidden="true" />
        <div className="absolute inset-0 bg-mesh-brand opacity-30" aria-hidden="true" />

        <div className="relative section py-20 sm:py-24 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="display-2 text-white">Pronta para começar sua jornada?</h2>
            <p className="lead text-white/70 mt-4">
              Entre para nossa comunidade e descubra um universo de possibilidades criado especialmente para mulheres extraordinárias como você.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <Link href="/minha-conta" className="btn bg-white text-brand-950 hover:bg-ink-100 no-underline">
                Entrar na comunidade
                <span aria-hidden="true">→</span>
              </Link>
              <Link href="/planos" className="btn bg-white/10 text-white hover:bg-white/15 no-underline">
                Explorar experiências
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Sparkle() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M7 0v14M0 7h14" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
