import { SessionForm } from '../../components/Dashboard/SessionForm';
import { SessionsList } from '../../components/Dashboard/SessionsList';
import { createServerSupabase } from '../../lib/supabaseClient';
export default function Sessions({ school, sessions }) {
    return (<main className="page">
      <h1>Sessions</h1>
      {school && <SessionForm schoolId={school.id}/>}
      <SessionsList sessions={sessions}/>
    </main>);
}
export const getServerSideProps = async (ctx) => {
    const supabase = createServerSupabase(ctx);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user)
        return { redirect: { destination: '/login', permanent: false } };
    const { data: school } = await supabase.from('schools').select('*').eq('owner_id', user.id).maybeSingle();
    const { data: sessions } = school
        ? await supabase.from('sessions').select('*').eq('school_id', school.id).order('session_date')
        : { data: [] };
    return { props: { school, sessions: sessions ?? [] } };
};
