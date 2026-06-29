import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Brand } from '../Brand';

export function Layout({ children }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const isHome = router.pathname === '/';
  const isGenerator = router.pathname.startsWith('/generator');
  const primaryLink = isGenerator ? '/generator' : '/generator';
  const primaryLabel = isGenerator ? 'Try the Generator' : 'Try the Generator';
  const navItems = isHome
    ? [
        { href: '#features', label: 'Features' },
        { href: '#process', label: 'How it Works' },
      ]
    : [];

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
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>{item.label}</Link>
          ))}
          {!isHome ? <Link href="/" className="site-header__secondary">Home</Link> : null}
          <Link href={primaryLink} className="pill-button pill-button--small">{primaryLabel}</Link>
        </nav>
      </header>
      {children}
    </>
  );
}
