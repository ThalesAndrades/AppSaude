'use client';

import Optimized4KImage from './Optimized4KImage';

export default function HeroBackground4K() {
  const image4KUrl = '/banners/home-hero.png';

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 scale-[1.02] blur-[1px] brightness-[1] contrast-[0.96] saturate-[1]">
        <Optimized4KImage src={image4KUrl} alt="Background Mulheres em Movimento" className="w-full h-full" />
      </div>
      <div className="absolute inset-0 opacity-5" aria-hidden="true">
        <div className="w-full h-full bg-gradient-to-br from-transparent via-white/10 to-transparent" />
      </div>
    </div>
  );
}
