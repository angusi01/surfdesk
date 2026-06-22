import { BookingsList } from '../../components/Dashboard/BookingsList';
import { createServerSupabase } from '../../lib/supabaseClient';
export default function Bookings({ bookings }) {
    return (<main className="page">
      <h1>Bookings</h1>
      <p>Filter by session, update attendance status, or export your booking list.</p>
      <a className="button-link" href="/api/export-data">Export to CSV</a>
      <BookingsList bookings={bookings}/>
    </main>);
}
export const getServerSideProps = async (ctx) => {
    const supabase = createServerSupabase(ctx);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user)
        return { redirect: { destination: '/login', permanent: false } };
    const { data: bookings } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
    return { props: { bookings: bookings ?? [] } };
};
