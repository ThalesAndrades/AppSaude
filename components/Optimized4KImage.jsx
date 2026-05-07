'use client';

import Image from 'next/image';

export default function Optimized4KImage({ src, alt, className = "" }) {
  const imageSet = {
    mobile: src.replace("image_size=landscape_16_9", "image_size=portrait_4_3"),
    desktop: src,
    placeholder: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='450'%3E%3Crect width='100%25' height='100%25' fill='%23a8794f'/%3E%3C/svg%3E"
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className="absolute inset-0 bg-gradient-to-br from-brand-900 via-brand-800 to-accent-700"
        style={{
          backgroundImage: `url(${imageSet.placeholder})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(18px)',
          transform: 'scale(1.1)'
        }}
      />
      <Image
        src={imageSet.desktop}
        alt={alt}
        fill
        priority
        sizes="100vw"
        quality={88}
        placeholder="blur"
        blurDataURL={imageSet.placeholder}
        style={{ objectFit: 'cover' }}
      />
    </div>
  );
}
