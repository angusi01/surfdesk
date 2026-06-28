import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Brand } from '../Brand';

export function Layout({ children }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const closeMenu = () => setMenuOpen(false);
    router.events.on('routeChangeComplete', closeMenu);
    return () => router.events.off('routeChangeComplete', closeMenu);
  }, [router.events]);

  return (
    <>
      <header className="site-header">
        <Brand />
        <button
          className="site-header__menu"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="material-symbols-outlined" aria-hidden="true">{menuOpen ? 'close' : 'menu'}</span>
        </button>
        <nav className={menuOpen ? 'site-header__nav site-header__nav--open' : 'site-header__nav'} aria-label="Main navigation">
          <Link href="/pricing">Pricing</Link>
          <Link href="/login">Login</Link>
          <Link href="/signup" className="pill-button pill-button--small">Start Free Trial</Link>
        </nav>
      </header>
      {children}
    </>
  );
}
