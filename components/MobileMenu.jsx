'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export default function MobileMenu({ isLoggedIn = false }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const previousActive = document.activeElement;
    const focusables = panelRef.current?.querySelectorAll(
      'a, button, [tabindex]:not([tabindex="-1"])'
    );
    focusables?.[0]?.focus();

    function onKey(e) {
      if (e.key === 'Escape') {
        setOpen(false);
        return;
      }
      if (e.key === 'Tab' && focusables && focusables.length) {
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
    }

    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      if (previousActive instanceof HTMLElement) previousActive.focus();
    };
  }, [open]);

  function close() { setOpen(false); }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        onClick={() => setOpen((v) => !v)}
        className="md:hidden icon-btn"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          {open ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>

      {open && (
        <div
          className="md:hidden fixed inset-0 top-[64px] z-30"
          onClick={close}
        >
          <div className="absolute inset-0 bg-bg/60 backdrop-blur-sm animate-fade-in-up" aria-hidden="true" />
          <nav
            ref={panelRef}
            id="mobile-nav-panel"
            aria-label="Menu mobile"
            className="relative mx-4 mt-3 rounded-2xl glass-strong p-2 flex flex-col animate-fade-in-up"
            style={{ paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom))' }}
            onClick={(e) => e.stopPropagation()}
          >
            <MobileLink href="/planos" onClick={close}>Planos</MobileLink>
            <MobileLink href="/#como-funciona" onClick={close}>Como funciona</MobileLink>
            <div className="h-px bg-line/60 mx-3 my-2" />
            {isLoggedIn ? (
              <MobileLink href="/minha-conta" onClick={close} primary>
                Minha conta →
              </MobileLink>
            ) : (
              <>
                <MobileLink href="/login" onClick={close}>Entrar</MobileLink>
                <MobileLink href="/cadastro" onClick={close} primary>
                  Criar conta
                </MobileLink>
              </>
            )}
          </nav>
        </div>
      )}
    </>
  );
}

function MobileLink({ href, children, onClick, primary = false }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`no-underline px-4 py-3.5 rounded-xl text-base font-medium transition-colors ${
        primary
          ? 'bg-gradient-to-b from-brand-500 to-brand-700 text-white text-center shadow-card'
          : 'text-text hover:bg-line/60 hover:text-text-strong'
      }`}
    >
      {children}
    </Link>
  );
}
