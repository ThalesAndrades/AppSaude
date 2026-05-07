'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function CountdownTimer({ targetDate, onComplete }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setIsExpired(true);
        onComplete && onComplete();
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  if (isExpired) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center p-4 bg-red-100 border border-red-300 rounded-lg"
      >
        <p className="text-red-800 font-bold">⚠️ Oportunidade Expirada</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-gradient-to-r from-brand-500 to-accent-500 text-white p-6 rounded-xl shadow-2xl"
    >
      <div className="text-center mb-2">
        <p className="text-sm font-medium opacity-90">⏰ Tempo Restante</p>
      </div>
      <div className="grid grid-cols-4 gap-2 text-center">
        {Object.entries(timeLeft).map(([unit, value], index) => (
          <motion.div
            key={unit}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white bg-opacity-20 rounded-lg p-3 backdrop-blur-sm"
          >
            <motion.div
              key={value}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-2xl font-bold"
            >
              {value.toString().padStart(2, '0')}
            </motion.div>
            <div className="text-xs uppercase tracking-wide opacity-80">
              {unit === 'days' ? 'Dias' : unit === 'hours' ? 'Hrs' : unit === 'minutes' ? 'Min' : 'Seg'}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}