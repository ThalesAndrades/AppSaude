'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function AnimatedSection({ children, className = '', delay = 0, direction = 'up' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const directions = {
    up: { y: 50, opacity: 0 },
    down: { y: -50, opacity: 0 },
    left: { x: -50, opacity: 0 },
    right: { x: 50, opacity: 0 },
  };

  return (
    <motion.div
      ref={ref}
      initial={directions[direction]}
      animate={isInView ? { y: 0, x: 0, opacity: 1 } : directions[direction]}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}