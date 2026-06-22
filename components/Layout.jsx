import Link from 'next/link';
export function Layout({ children }) {
    return (<>
      <header className="site-header">
        <Link href="/" className="brand">SurfDesk</Link>
        <nav>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/dashboard/sessions">Sessions</Link>
          <Link href="/dashboard/bookings">Bookings</Link>
          <Link href="/dashboard/billing">Billing</Link>
          <Link href="/privacy">Privacy</Link>
        </nav>
      </header>
      {children}
    </>);
}
