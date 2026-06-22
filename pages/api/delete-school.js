import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
export default async function handler(req, res) {
    if (req.method !== 'POST')
        return res.status(405).json({ error: 'method_not_allowed' });
    const supabase = createPagesServerClient({ req, res }, { options: { db: { schema: 'surfdesk' } } });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user)
        return res.status(401).json({ error: 'unauthorized' });
    const { error } = await supabase.from('schools').delete().eq('owner_id', user.id);
    if (error)
        return res.status(400).json({ error: error.message });
    return res.status(200).json({ ok: true });
}
