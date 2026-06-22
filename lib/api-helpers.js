import { z } from 'zod';
export function slugify(value) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}
export function requireMethod(req, res, method) {
    if (req.method === method)
        return true;
    res.setHeader('allow', method);
    res.status(405).json({ error: 'method_not_allowed' });
    return false;
}
export const bookingSchema = z.object({
    sessionId: z.string().uuid(),
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().regex(/^(\+?61|0)4\d{8}$/, 'Australian mobile number required'),
    participants: z.coerce.number().int().min(1).max(4).default(1),
    notes: z.string().max(1000).optional().default(''),
});
