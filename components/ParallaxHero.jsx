'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function ParallaxHero({ children, className = '' }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  return (
    <motion.div
      ref={ref}
      style={{ y, opacity, scale }}
      className={`relative overflow-hidden ${className}`}
    >
      {children}
    </motion.div>
  );
}