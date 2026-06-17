import type { GetServerSideProps } from 'next';
import { BookingsList } from '../../components/Dashboard/BookingsList';
import { createServerSupabase } from '../../lib/supabaseClient';

type Booking = { id: string; customer_name: string; customer_email: string; customer_phone: string | null; status: string; created_at: string };

export default function Bookings({ bookings }: { bookings: Booking[] }) {
  return (
    <main className="page">
      <h1>Bookings</h1>
      <BookingsList bookings={bookings} />
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const supabase = createServerSupabase(ctx);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { redirect: { destination: '/login', permanent: false } };
  const { data: bookings } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
  return { props: { bookings: bookings ?? [] } };
};
