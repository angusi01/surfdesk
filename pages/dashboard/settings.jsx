import { createServerSupabase } from '../../lib/supabaseClient';
export default function Settings({ school }) {
    return (<main className="page">
      <h1>Settings</h1>
      {school ? (<section className="panel compact">
          <label>School name<input defaultValue={school.name} readOnly/></label>
          <label>Slug<input defaultValue={school.slug} readOnly/></label>
          <div className="danger-zone">
            <h2>Delete School</h2>
            <p>This permanently deletes all sessions, bookings, and data. Type your school name to confirm before using the API endpoint.</p>
          </div>
        </section>) : <p>No school found.</p>}
    </main>);
}
export const getServerSideProps = async (ctx) => {
    const supabase = createServerSupabase(ctx);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user)
        return { redirect: { destination: '/login', permanent: false } };
    const { data: school } = await supabase.from('schools').select('id, name, slug').eq('owner_id', user.id).maybeSingle();
    return { props: { school } };
};
