import Link from 'next/link';

export function Brand({ href = '/', compact = false }) {
  return (
    <Link href={href} className={`surfdesk-brand${compact ? ' surfdesk-brand--compact' : ''}`} aria-label="SurfDesk home">
      <span className="material-symbols-outlined surfdesk-brand__mark" aria-hidden="true">waves</span>
      <span>SurfDesk</span>
    </Link>
  );
}
