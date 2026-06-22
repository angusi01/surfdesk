import Link from 'next/link';
import { useRouter } from 'next/router';

export function Layout({ children }) {
  const router = useRouter();
  const isDashboard = router.pathname.startsWith('/dashboard');
  return (
    <>
      <header className="site-header">
        <Link href="/" className="brand">SurfDesk</Link>
        <nav>
          {isDashboard ? (
            <>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/dashboard/sessions">Sessions</Link>
              <Link href="/dashboard/bookings">Bookings</Link>
              <Link href="/dashboard/billing">Billing</Link>
            </>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <Link href="/signup" className="nav-cta">Start Free Trial</Link>
            </>
          )}
        </nav>
      </header>
      {children}
    </>
  );
}
