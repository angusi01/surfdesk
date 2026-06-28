import Link from 'next/link';
import { Brand } from './Brand';

export function MarketingFooter() {
  return (
    <footer className="marketing-footer">
      <Brand compact />
      <span className="marketing-footer__copyright">© 2026</span>
      <nav aria-label="Footer navigation">
        <Link href="/pricing">Pricing</Link>
        <span aria-hidden="true">|</span>
        <Link href="/login">Login</Link>
      </nav>
    </footer>
  );
}
