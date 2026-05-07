'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function HeroPreloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simular carregamento progressivo
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    // Fallback para garantir que desapareça
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 bg-gradient-to-br from-brand-900 via-brand-800 to-accent-700 z-50 flex items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="text-center">
            {/* Logo animada */}
            <motion.div
              className="w-24 h-24 mx-auto mb-8"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 1, type: "spring", stiffness: 200 }}
            >
              <div className="w-full h-full bg-gradient-to-br from-accent-400 to-brand-400 rounded-full flex items-center justify-center">
                <span className="text-white text-3xl font-bold">M</span>
              </div>
            </motion.div>

            {/* Texto de carregamento */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-white text-xl font-semibold mb-2">Mulheres em Movimento</h2>
              <p className="text-white/80 text-sm">Preparando sua experiência exclusiva...</p>
            </motion.div>

            {/* Barra de progresso estilizada */}
            <motion.div
              className="w-64 mx-auto mb-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-accent-400 to-brand-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, progress)}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <div className="mt-2 text-white/60 text-xs">
                {Math.round(Math.min(100, progress))}%
              </div>
            </motion.div>

            {/* Partículas animadas */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white/30 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [-20, 20],
                    opacity: [0.3, 0.8, 0.3],
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}