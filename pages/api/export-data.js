import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
export default async function handler(req, res) {
    const supabase = createPagesServerClient({ req, res }, { options: { db: { schema: 'surfdesk' } } });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user)
        return res.status(401).json({ error: 'unauthorized' });
    const { data: schools } = await supabase.from('schools').select('*').eq('owner_id', user.id);
    const schoolIds = (schools ?? []).map((school) => school.id);
    const { data: sessions } = await supabase.from('sessions').select('*').in('school_id', schoolIds);
    const { data: bookings } = await supabase.from('bookings').select('*');
    return res.status(200).json({ schools, sessions, bookings });
}
