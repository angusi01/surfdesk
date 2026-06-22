import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { requireMethod } from '../../lib/api-helpers';
import { z } from 'zod';

const schema = z.object({
    school_id: z.string().uuid(),
    session_date: z.string().min(1),
    start_time: z.string().min(1),
    end_time: z.string().min(1),
    max_capacity: z.coerce.number().int().min(1).max(50),
    session_type: z.string().min(1).default('Group Lesson'),
    price_cents: z.coerce.number().int().min(0).optional().default(0),
});
export default async function handler(req, res) {
    if (!requireMethod(req, res, 'POST'))
        return;
    const supabase = createPagesServerClient({ req, res }, { options: { db: { schema: 'surfdesk' } } });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user)
        return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Unauthorized.' } });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: { code: 'INVALID_REQUEST', message: 'Invalid session.' } });
    const { data, error } = await supabase.from('sessions').insert(parsed.data).select('*').single();
    if (error)
        return res.status(400).json({ error: { code: 'SESSION_CREATE_FAILED', message: error.message } });
    return res.status(200).json({ data });
}
