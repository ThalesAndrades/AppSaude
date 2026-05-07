'use client';

import { motion } from 'framer-motion';

export default function HeroVisualEffects() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Linhas douradas flutuantes */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-px bg-gradient-to-r from-transparent via-accent-400/30 to-transparent"
          style={{
            width: `${20 + Math.random() * 40}%`,
            left: `${Math.random() * 100}%`,
            top: `${20 + Math.random() * 60}%`,
          }}
          animate={{
            x: [-100, 100],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Partículas douradas brilhantes */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 bg-accent-400 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [-20, 20],
            opacity: [0.3, 1, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Brilhos sutis */}
      <motion.div
        className="absolute top-1/4 left-1/3 w-32 h-32 bg-gradient-radial from-white/10 via-transparent to-transparent rounded-full blur-2xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-gradient-radial from-accent-400/15 via-transparent to-transparent rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Efeito de lente suave */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent" />
    </div>
  );
}