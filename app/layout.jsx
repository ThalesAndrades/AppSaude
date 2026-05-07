import './globals.css';
import { Inter, Fraunces } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ToastProvider } from '@/components/ToastSystem';
import AnalyticsTracker from '@/components/AnalyticsTracker';

const sans = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const display = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  style: ['normal', 'italic'],
  axes: ['opsz'],
});

export const metadata = {
  title: {
    default: 'Mulheres em Movimento — Cursos e mentorias',
    template: '%s · Mulheres em Movimento',
  },
  description:
    'Uma plataforma exclusiva para mulheres: cursos e mentorias com experiência interna bonita, objetiva e prática.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://mettafit.site'),
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Mulheres em Movimento',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0c0a09' },
  ],
};

const themeInitScript = `(function(){try{var s=localStorage.getItem('theme');var m=window.matchMedia('(prefers-color-scheme: dark)').matches;var t=s==='dark'||s==='light'?s:(m?'dark':'light');document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`;

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${sans.variable} ${display.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen flex flex-col font-sans bg-bg text-text">
        <ToastProvider />
        <AnalyticsTracker />
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:text-ink-900 focus:shadow-lift"
        >
          Pular para o conteúdo
        </a>
        <Header />
        <main id="conteudo" className="flex-1 focus:outline-none" tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
