import { buffer } from 'node:stream/consumers';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getStripe } from '../../../lib/stripe';
import { getServiceSupabase } from '../../../lib/supabaseClient';

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const signature = req.headers['stripe-signature'];
  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) return res.status(400).send('missing signature');
  const event = getStripe().webhooks.constructEvent(await buffer(req), signature, process.env.STRIPE_WEBHOOK_SECRET);
  const supabase = getServiceSupabase();

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    if (session.mode === 'subscription' && session.client_reference_id) {
      await supabase.from('schools').update({
        stripe_customer_id: String(session.customer ?? ''),
        stripe_subscription_id: String(session.subscription ?? ''),
        subscription_status: 'active',
      }).eq('id', session.client_reference_id);
    }
  }

  if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object;
    await supabase.from('schools').update({
      subscription_status: subscription.status,
    }).eq('stripe_subscription_id', subscription.id);
  }

  if (event.type === 'invoice.payment_failed') {
    const invoice = event.data.object;
    const subscriptionId = typeof invoice.parent?.subscription_details?.subscription === 'string'
      ? invoice.parent.subscription_details.subscription
      : undefined;
    if (subscriptionId) {
      await supabase.from('schools').update({ subscription_status: 'past_due' }).eq('stripe_subscription_id', subscriptionId);
    }
  }

  return res.status(200).json({ received: true });
}
