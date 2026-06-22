import Link from 'next/link';
import { SessionForm } from '../../components/Dashboard/SessionForm';

export default function FirstSession() {
  return (
    <main className="page narrow">
      <h1>Create your first session</h1>
      <SessionForm />
      <Link className="button-link secondary" href="/onboarding/share">I'll do this later</Link>
    </main>
  );
}
