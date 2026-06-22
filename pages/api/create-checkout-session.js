import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { getStripe } from '../../lib/stripe';
export default async function handler(req, res) {
    if (req.method !== 'POST')
        return res.status(405).json({ error: { code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed.' } });
    const supabase = createPagesServerClient({ req, res }, { options: { db: { schema: 'surfdesk' } } });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user)
        return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Unauthorized.' } });
    const { data: school } = await supabase.from('schools').select('*').eq('owner_id', user.id).single();
    if (!school)
        return res.status(404).json({ error: { code: 'SCHOOL_NOT_FOUND', message: 'School not found.' } });
    if (!process.env.STRIPE_SURFDESK_PRICE_ID)
        return res.status(500).json({ error: { code: 'STRIPE_PRICE_NOT_CONFIGURED', message: 'Stripe price is not configured.' } });
    const origin = req.headers.origin ?? 'https://surfdesk.com.au';
    const session = await getStripe().checkout.sessions.create({
        mode: 'subscription',
        line_items: [{ price: process.env.STRIPE_SURFDESK_PRICE_ID, quantity: 1 }],
        client_reference_id: school.id,
        customer_email: user.email ?? undefined,
        subscription_data: {
            trial_period_days: 14,
            metadata: { school_id: school.id, user_id: user.id },
        },
        success_url: `${origin}/dashboard/billing?success=1`,
        cancel_url: `${origin}/dashboard/billing?canceled=1`,
    });
    return res.status(200).json({ data: { url: session.url } });
}
