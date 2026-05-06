import Link from 'next/link';

export const metadata = { title: 'Página não encontrada' };

export default function NotFound() {
  return (
    <div className="section py-24 sm:py-32 text-center">
      <p className="font-display text-[7rem] leading-none font-semibold text-brand-500/30 select-none">
        404
      </p>
      <h1 className="display-2 mt-4">Página não encontrada</h1>
      <p className="lead mt-4 max-w-md mx-auto">
        A página que você procura não existe ou foi movida.
      </p>
      <div className="mt-10 flex flex-wrap gap-3 justify-center">
        <Link href="/" className="btn-primary btn-lg no-underline">
          Voltar ao início
        </Link>
        <Link href="/planos" className="btn-outline btn-lg no-underline">
          Ver planos
        </Link>
      </div>
    </div>
  );
}
