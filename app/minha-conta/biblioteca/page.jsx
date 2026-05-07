import Link from 'next/link';

export default async function BibliotecaPage() {
  return (
    <div className="space-y-8">
      <header>
        <p className="eyebrow">Biblioteca</p>
        <h1 className="display-2 mt-2">Seu universo de transformação</h1>
        <p className="lead mt-3 max-w-2xl">
          Aqui você encontra todos os conteúdos, eventos e experiências disponíveis para sua jornada de crescimento.
        </p>
      </header>

      {/* Seção Livros */}
      <section>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 grid place-items-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" stroke="currentColor" strokeWidth="1.6" />
              <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-text-strong">Livros</h2>
            <p className="text-sm text-text-muted">Literatura empoderadora para sua jornada</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="card p-6">
            <h3 className="font-semibold text-text-strong mb-2">Mulheres que Correm com os Lobos</h3>
            <p className="text-sm text-text-muted mb-4">Releitura moderna dos arquétipos femininos</p>
            <Link href="/minha-conta/livros/mulheres-lobos" className="btn-outline text-sm">
              Ler agora
            </Link>
          </div>
          <div className="card p-6">
            <h3 className="font-semibold text-text-strong mb-2">O Poder da Ação</h3>
            <p className="text-sm text-text-muted mb-4">Transforme seus sonhos em realidade</p>
            <Link href="/minha-conta/livros/poder-acao" className="btn-outline text-sm">
              Ler agora
            </Link>
          </div>
        </div>
      </section>

      {/* Seção Digital */}
      <section>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 rounded-xl bg-accent-100 text-accent-700 grid place-items-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.6" />
              <path d="M3 9h18M9 21V9" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-text-strong">Digital</h2>
            <p className="text-sm text-text-muted">Conteúdo online e comunidades</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="card p-6">
            <h3 className="font-semibold text-text-strong mb-2">Despertar Feminino</h3>
            <p className="text-sm text-text-muted mb-4">Programa de 21 dias para reconectar com sua essência</p>
            <Link href="/minha-conta/cursos/despertar-feminino" className="btn-outline text-sm">
              Acessar curso
            </Link>
          </div>
          <div className="card p-6">
            <h3 className="font-semibold text-text-strong mb-2">Círculo de Mulheres</h3>
            <p className="text-sm text-text-muted mb-4">Comunidade online de apoio e crescimento</p>
            <Link href="/minha-conta/comunidade/circulo" className="btn-outline text-sm">
              Entrar na comunidade
            </Link>
          </div>
        </div>
      </section>

      {/* Seção Eventos */}
      <section>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 grid place-items-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M8 2v4M16 2v4M3 9h18M5 5h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-text-strong">Eventos</h2>
            <p className="text-sm text-text-muted">Encontros transformadores</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="card p-6">
            <h3 className="font-semibold text-text-strong mb-2">Retiro de Inverno</h3>
            <p className="text-sm text-text-muted mb-4">Fim de semana de imersão e transformação</p>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs bg-brand-100 text-brand-700 px-2 py-1 rounded">Presencial</span>
              <span className="text-xs text-text-muted">Próximas datas em breve</span>
            </div>
            <Link href="/minha-conta/eventos/retiro-inverno" className="btn-outline text-sm">
              Ver detalhes
            </Link>
          </div>
          <div className="card p-6">
            <h3 className="font-semibold text-text-strong mb-2">Workshop de Dança Circular</h3>
            <p className="text-sm text-text-muted mb-4">Libere seu corpo e sua energia feminina</p>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs bg-accent-100 text-accent-700 px-2 py-1 rounded">Online</span>
              <span className="text-xs text-text-muted">Disponível agora</span>
            </div>
            <Link href="/minha-conta/eventos/danca-circular" className="btn-outline text-sm">
              Participar
            </Link>
          </div>
        </div>
      </section>

      {/* Seção Viagens - Especial */}
      <section className="bg-gradient-to-br from-accent-50 to-brand-50 rounded-3xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 rounded-xl bg-accent-100 text-accent-700 grid place-items-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-text-strong">Viagens em Movimento</h2>
            <p className="text-sm text-text-muted">Experiências únicas ao redor do mundo</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl p-6">
            <h3 className="font-semibold text-text-strong mb-2">Viagem à Índia Sagrada</h3>
            <p className="text-sm text-text-muted mb-4">Peregrinação espiritual pelos lugares mais sagrados</p>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs bg-accent-100 text-accent-700 px-2 py-1 rounded">Exclusivo</span>
              <span className="text-xs text-text-muted">Sob consulta</span>
            </div>
            <Link href="/interesse-viagens" className="btn-primary text-sm">
              Manifestar interesse
            </Link>
          </div>
          <div className="bg-white rounded-2xl p-6">
            <h3 className="font-semibold text-text-strong mb-2">Cruzeiro pelo Mediterrâneo</h3>
            <p className="text-sm text-text-muted mb-4">Navegue pelos mares da sabedoria antiga</p>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs bg-accent-100 text-accent-700 px-2 py-1 rounded">Exclusivo</span>
              <span className="text-xs text-text-muted">Sob consulta</span>
            </div>
            <Link href="/interesse-viagens" className="btn-primary text-sm">
              Manifestar interesse
            </Link>
          </div>
        </div>

        <div className="text-center">
          <Link href="/interesse-viagens" className="btn-outline">
            Quero ser avisada sobre novas viagens
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      {/* Seção Comunidade */}
      <section className="text-center">
        <div className="card p-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 grid place-items-center mx-auto mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-white">
              <path d="M17 20v-4a4 4 0 00-4-4H5a4 4 0 00-4 4v4M8 12a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 12a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M21 16v2a4 4 0 01-4 4H5a4 4 0 01-4-4v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="font-display text-2xl font-semibold text-text-strong mb-4">Faça parte da nossa tribo</h2>
          <p className="text-text-muted mb-6 max-w-2xl mx-auto">
            Conecte-se com outras mulheres extraordinárias que estão na mesma jornada de crescimento e transformação.
          </p>
          <Link href="/minha-conta/comunidade" className="btn-primary">
            Entrar para comunidade
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}