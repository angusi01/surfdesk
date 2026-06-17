import Link from 'next/link';
import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="site-header">
        <Link href="/" className="brand">SurfDesk</Link>
        <nav>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/dashboard/sessions">Sessions</Link>
          <Link href="/dashboard/bookings">Bookings</Link>
          <Link href="/privacy">Privacy</Link>
        </nav>
      </header>
      {children}
    </>
  );
}
