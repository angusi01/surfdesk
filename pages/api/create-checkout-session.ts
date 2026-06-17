import type { NextApiRequest, NextApiResponse } from 'next';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { getStripe } from '../../lib/stripe';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });
  const supabase = createPagesServerClient({ req, res }, { options: { db: { schema: 'surfdesk' } } });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return res.status(401).json({ error: 'unauthorized' });
  const { data: school } = await supabase.from('schools').select('*').eq('owner_id', user.id).single();
  if (!school) return res.status(404).json({ error: 'school_not_found' });
  if (!process.env.STRIPE_SURFDESK_PRICE_ID) return res.status(500).json({ error: 'stripe_price_not_configured' });

  const origin = req.headers.origin ?? 'https://surfdesk.com.au';
  const session = await getStripe().checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: process.env.STRIPE_SURFDESK_PRICE_ID, quantity: 1 }],
    client_reference_id: school.id,
    success_url: `${origin}/dashboard/billing?success=1`,
    cancel_url: `${origin}/dashboard/billing?canceled=1`,
  });
  return res.status(200).json({ url: session.url });
}
