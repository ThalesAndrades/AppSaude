'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function InteractiveButton({ 
  children, 
  onClick, 
  variant = 'primary',
  size = 'md',
  loading = false,
  success = false,
  className = ''
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const variants = {
    primary: 'bg-gradient-to-r from-brand-500 to-accent-500 text-white',
    secondary: 'bg-white text-brand-600 border-2 border-brand-500',
    ghost: 'bg-transparent text-brand-600 border border-brand-300',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const handleClick = async (e) => {
    setIsClicked(true);
    if (onClick) {
      await onClick(e);
    }
    setTimeout(() => setIsClicked(false), 200);
  };

  return (
    <motion.button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      disabled={loading}
      className={`relative overflow-hidden rounded-lg font-semibold transition-all duration-300 ${
        variants[variant]
      } ${sizes[size]} ${className} ${
        isHovered ? 'shadow-2xl scale-105' : 'shadow-lg'
      } ${isClicked ? 'scale-95' : ''} ${
        loading ? 'cursor-not-allowed opacity-70' : ''
      }`}
      whileTap={{ scale: 0.95 }}
      whileHover={{ 
        scale: 1.05,
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
      }}
    >
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-inherit rounded-lg"
          >
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </motion.div>
        )}
        
        {success && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-green-500 rounded-lg"
          >
            <motion.svg
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5 }}
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </motion.svg>
          </motion.div>
        )}
        
        {!loading && !success && (
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="relative z-10"
          >
            {children}
          </motion.span>
        )}
      </AnimatePresence>
      
      <motion.div
        className="absolute inset-0 bg-white opacity-0"
        whileHover={{ opacity: 0.1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
}
