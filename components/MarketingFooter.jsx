import Link from 'next/link';
import { Brand } from './Brand';

export function MarketingFooter() {
  return (
    <footer className="marketing-footer">
      <div className="marketing-footer__brandline">
        <Brand compact />
        <span className="marketing-footer__copyright">SurfDesk © 2026</span>
      </div>
      <span className="marketing-footer__meta">Example Output | Support</span>
      <nav aria-label="Footer navigation">
        <Link href="/privacy">Privacy</Link>
        <Link href="/privacy">Terms</Link>
      </nav>
    </footer>
  );
}
