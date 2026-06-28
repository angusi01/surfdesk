import Link from 'next/link';
import { useRouter } from 'next/router';
import { Brand } from '../Brand';

const navItems = [
  ['/dashboard', 'dashboard', 'Dashboard'],
  ['/dashboard/sessions', 'surfing', 'Sessions'],
  ['/dashboard/bookings', 'calendar_month', 'Bookings'],
  ['/dashboard/billing', 'payments', 'Revenue'],
  ['/dashboard/settings', 'settings', 'Settings'],
];

export function DashboardLayout({ children, school }) {
  const router = useRouter();
  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <Brand href="/dashboard" />
        <nav aria-label="Dashboard navigation">
          {navItems.map(([href, icon, label]) => (
            <Link className={router.pathname === href ? 'dashboard-nav__item dashboard-nav__item--active' : 'dashboard-nav__item'} href={href} key={href}>
              <span className="material-symbols-outlined" aria-hidden="true">{icon}</span>
              <span>{label}</span>
            </Link>
          ))}
        </nav>
        <div className="dashboard-sidebar__school">
          <span>{school?.name?.slice(0, 2).toUpperCase() || 'SD'}</span>
          <div><strong>{school?.name || 'SurfDesk'}</strong><small>Main Branch</small></div>
        </div>
      </aside>
      <div className="dashboard-main">{children}</div>
    </div>
  );
}
