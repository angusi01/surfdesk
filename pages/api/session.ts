import type { NextApiRequest, NextApiResponse } from 'next';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { requireMethod } from '../../lib/api-helpers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireMethod(req, res, 'POST')) return;
  const supabase = createPagesServerClient({ req, res }, { options: { db: { schema: 'surfdesk' } } });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return res.status(401).json({ error: 'unauthorized' });
  const { data, error } = await supabase.from('sessions').insert(req.body).select('*').single();
  if (error) return res.status(400).json({ error: error.message });
  return res.status(200).json(data);
}
