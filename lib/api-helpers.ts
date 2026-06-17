import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function requireMethod(req: NextApiRequest, res: NextApiResponse, method: string) {
  if (req.method === method) return true;
  res.setHeader('allow', method);
  res.status(405).json({ error: 'method_not_allowed' });
  return false;
}

export const bookingSchema = z.object({
  sessionId: z.string().uuid(),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional().default(''),
});
