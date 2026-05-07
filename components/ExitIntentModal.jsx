'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { X, TrendingUp, Users, Award, Zap } from 'lucide-react';

export default function ExitIntentModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [step, setStep] = useState('offer');

  useEffect(() => {
    const handleMouseLeave = (e) => {
      if (e.clientY <= 0 && !sessionStorage.getItem('exitIntentShown')) {
        setIsOpen(true);
        sessionStorage.setItem('exitIntentShown', 'true');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    
    const timer = setTimeout(() => {
      if (!sessionStorage.getItem('exitIntentShown')) {
        setIsOpen(true);
        sessionStorage.setItem('exitIntentShown', 'true');
      }
    }, 30000);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(timer);
    };
  }, []);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setStep('success');
    setTimeout(() => {
      setIsOpen(false);
    }, 3000);
  };

  const benefits = [
    { icon: <TrendingUp className="w-6 h-6" />, text: "E-book Grátis: 7 Passos para Empoderamento Feminino" },
    { icon: <Users className="w-6 h-6" />, text: "Acesso VIP à nossa comunidade exclusiva" },
    { icon: <Award className="w-6 h-6" />, text: "Desconto de 20% na primeira experiência" },
    { icon: <Zap className="w-6 h-6" />, text: "Conteúdo exclusivo sobre viagens transformadoras" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            className="bg-gradient-to-br from-brand-50 to-accent-50 rounded-2xl p-8 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <AnimatePresence mode="wait">
              {step === 'offer' && (
                <motion.div
                  key="offer"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="w-20 h-20 bg-gradient-to-r from-brand-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <div>🎁</div>
                  </motion.div>

                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Espere! Não vá ainda!
                  </h2>
                  
                  <p className="text-gray-600 mb-6">
                    Temos um presente especial para você antes de partir:
                  </p>

                  <div className="space-y-3 mb-6">
                    {benefits.map((benefit, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="flex items-center space-x-3 text-left"
                      >
                        <div className="text-brand-500">
                          {benefit.icon}
                        </div>
                        <span className="text-sm text-gray-700">{benefit.text}</span>
                      </motion.div>
                    ))}
                  </div>

                  <form onSubmit={handleEmailSubmit} className="space-y-4">
                    <motion.input
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Digite seu melhor e-mail"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      required
                    />
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      type="submit"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-gradient-to-r from-brand-500 to-accent-500 text-white py-3 rounded-lg font-semibold shadow-lg"
                    >
                      Quero Meu Presente! 🎁
                    </motion.button>
                  </form>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-xs text-gray-500 mt-4"
                  >
                    *Promoção por tempo limitado. Garanta já!
                  </motion.p>
                </motion.div>
              )}

              {step === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1 }}
                    className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    ✓
                  </motion.div>
                  <h2 className="text-2xl font-bold text-green-600 mb-4">Sucesso!</h2>
                  <p className="text-gray-600">Seu presente está a caminho! Verifique seu e-mail.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
