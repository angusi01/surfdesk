export default function Privacy() {
  return (
    <main className="page prose">
      <h1>Privacy</h1>
      <p>SurfDesk stores school profiles, session details, booking contact details, subscription identifiers, and account data needed to run bookings.</p>
      <p>Processors include Supabase, Stripe, Brevo, PostHog, and Vercel. Data may be processed in the United States under provider safeguards.</p>
      <p>School admins can export their data from <code>/api/export-data</code> and delete their school with the delete endpoint, which cascades sessions and bookings.</p>
    </main>
  );
}
