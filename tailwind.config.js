/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Brand: tons quentes (café) — premium e acolhedor.
        brand: {
          50:  '#faf7f2',
          100: '#f3eadf',
          200: '#e6d3c0',
          300: '#d3b79b',
          400: '#bf986e',
          500: '#a8794f',
          600: '#8a5f3e',
          700: '#6f4a31',
          800: '#553725',
          900: '#3a2619',
          950: '#24160f',
        },
        // Accent: dourado para destaque.
        accent: {
          50:  '#fff9eb',
          100: '#fff0c9',
          200: '#ffe09a',
          300: '#f9c96a',
          400: '#eab14a',
          500: '#cc9835',
          600: '#a77728',
          700: '#845b1f',
        },
        // Ink: tons quentes de cinza para superfícies/textos.
        ink: {
          50:  '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
          950: '#0c0a09',
        },
        // Tokens semânticos (CSS vars, theme-aware).
        bg: 'rgb(var(--bg) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        'surface-2': 'rgb(var(--surface-2) / <alpha-value>)',
        'surface-3': 'rgb(var(--surface-3) / <alpha-value>)',
        text: 'rgb(var(--text) / <alpha-value>)',
        'text-muted': 'rgb(var(--text-muted) / <alpha-value>)',
        'text-strong': 'rgb(var(--text-strong) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
        'line-strong': 'rgb(var(--line-strong) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'ui-serif', 'Georgia', 'serif'],
      },
      fontSize: {
        'display-1': ['clamp(2.75rem, 6vw, 4.5rem)', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        'display-2': ['clamp(2rem, 4vw, 3rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-3': ['clamp(1.5rem, 2.5vw, 2rem)', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(15, 23, 42, 0.04), 0 4px 12px rgba(15, 23, 42, 0.04)',
        card: '0 1px 0 rgba(15, 23, 42, 0.04), 0 8px 24px -8px rgba(15, 23, 42, 0.08)',
        lift: '0 4px 12px rgba(15, 23, 42, 0.06), 0 24px 48px -16px rgba(15, 23, 42, 0.16)',
        ring: '0 0 0 1px rgba(15, 23, 42, 0.06)',
        glow: '0 0 0 6px rgba(204, 152, 53, 0.14)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      backgroundImage: {
        'mesh-brand':
          'radial-gradient(at 12% 8%, rgba(204,152,53,0.18) 0px, transparent 50%),' +
          'radial-gradient(at 88% 4%, rgba(191,152,110,0.16) 0px, transparent 50%),' +
          'radial-gradient(at 50% 92%, rgba(163,119,40,0.12) 0px, transparent 60%)',
        'grid-faint':
          'linear-gradient(to right, rgba(15,23,42,0.04) 1px, transparent 1px),' +
          'linear-gradient(to bottom, rgba(15,23,42,0.04) 1px, transparent 1px)',
        'grid-faint-dark':
          'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),' +
          'linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.5s ease-out both',
        shimmer: 'shimmer 2s infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({ strategy: 'class' }),
    require('@tailwindcss/typography'),
  ],
};
