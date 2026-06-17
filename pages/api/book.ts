import type { NextApiRequest, NextApiResponse } from 'next';
import { bookingSchema, requireMethod } from '../../lib/api-helpers';
import { sendBookingConfirmation } from '../../lib/email';
import { getServiceSupabase } from '../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireMethod(req, res, 'POST')) return;
  const parsed = bookingSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'invalid_request' });
  const supabase = getServiceSupabase();
  const { data: bookingId, error } = await supabase.rpc('book_session', {
    p_session_id: parsed.data.sessionId,
    p_customer_name: parsed.data.name,
    p_customer_email: parsed.data.email,
    p_customer_phone: parsed.data.phone,
  });
  if (error) return res.status(error.message.includes('session_full') ? 409 : 500).json({ error: error.message });

  const { data: session } = await supabase
    .from('sessions')
    .select('schools(name)')
    .eq('id', parsed.data.sessionId)
    .single();
  const joinedSchool = session?.schools as { name?: string } | { name?: string }[] | null | undefined;
  const schoolName = Array.isArray(joinedSchool) ? joinedSchool[0]?.name : joinedSchool?.name;
  await sendBookingConfirmation(parsed.data.email, schoolName ?? 'your surf school');
  return res.status(200).json({ bookingId });
}
