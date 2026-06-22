import { describe, expect, it } from 'vitest';
import { slugify } from '../lib/api-helpers';
describe('api helpers', () => {
    it('creates stable lowercase slugs', () => {
        expect(slugify('North Coast Surf School!')).toBe('north-coast-surf-school');
    });
});
