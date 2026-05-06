'use client';

import { useEffect, useState } from 'react';

function applyTheme(theme) {
  const root = document.documentElement;
  root.classList.add('theme-anim');
  root.setAttribute('data-theme', theme);
  window.setTimeout(() => root.classList.remove('theme-anim'), 260);
}

export default function ThemeToggle({ className = '' }) {
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    setTheme(current);
  }, []);

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    applyTheme(next);
    try { localStorage.setItem('theme', next); } catch {}
  }

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
      aria-pressed={isDark}
      title={isDark ? 'Tema claro' : 'Tema escuro'}
      className={`icon-btn relative ${className}`}
      suppressHydrationWarning
    >
      <SunIcon
        className={`w-[18px] h-[18px] absolute transition-[opacity,transform] duration-300 ease-out ${
          isDark ? 'opacity-0 -rotate-45 scale-75' : 'opacity-100 rotate-0 scale-100'
        }`}
      />
      <MoonIcon
        className={`w-[18px] h-[18px] absolute transition-[opacity,transform] duration-300 ease-out ${
          isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-45 scale-75'
        }`}
      />
    </button>
  );
}

function SunIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
    </svg>
  );
}
