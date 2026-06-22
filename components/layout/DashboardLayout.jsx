import Link from 'next/link';

export function DashboardLayout({ children }) {
  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <Link href="/dashboard" className="brand">SurfDesk</Link>
        <Link href="/dashboard">Overview</Link>
        <Link href="/dashboard/sessions">Sessions</Link>
        <Link href="/dashboard/bookings">Bookings</Link>
        <Link href="/dashboard/billing">Billing</Link>
        <Link href="/dashboard/settings">Settings</Link>
      </aside>
      <div className="dashboard-main">
        <div className="dashboard-topbar">Dashboard</div>
        {children}
      </div>
    </div>
  );
}
