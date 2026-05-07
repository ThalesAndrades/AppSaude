'use client';

import Optimized4KImage from './Optimized4KImage';

export default function HeroBackground4K() {
  const image4KUrl = "https://coreva-normal.trae.ai/api/ide/v1/text_to_image?prompt=mulheres%20empoderadas%20em%20grupo%2C%20ambiente%20premium%20luxuoso%2C%20tons%20de%20dourado%20e%20caf%C3%A9%2C%20ilumina%C3%A7%C3%A3o%20dourada%20suave%2C%20composi%C3%A7%C3%A3o%20elegante%2C%20qualidade%204K%2C%20estilo%20editorial%2C%20atmosfera%20de%20sucesso%20e%20conquista%2C%20cores%20quentes%2C%20profissional%2C%20fotografia%20de%20alta%20qualidade&image_size=landscape_16_9";

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0">
        <Optimized4KImage src={image4KUrl} alt="Mulheres Empoderadas - Mulheres em Movimento" className="w-full h-full" />
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/25" />
          <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,rgba(234,177,74,0.18),transparent_60%)] blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[radial-gradient(circle_at_center,rgba(191,152,110,0.20),transparent_60%)] blur-3xl" />
        </div>
      </div>
      <div className="absolute inset-0 opacity-5" aria-hidden="true">
        <div className="w-full h-full bg-gradient-to-br from-transparent via-white/10 to-transparent" />
      </div>
    </div>
  );
}
