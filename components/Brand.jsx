import Link from 'next/link';

export function Brand({ href = '/', compact = false }) {
  return (
    <Link href={href} className={`surfdesk-brand${compact ? ' surfdesk-brand--compact' : ''}`} aria-label="SurfDesk home">
      <img src="/wave-logo.svg" alt="" className="surfdesk-brand__mark" aria-hidden="true" />
      <span>SurfDesk</span>
    </Link>
  );
}
