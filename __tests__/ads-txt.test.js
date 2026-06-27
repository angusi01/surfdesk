import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

const ADS_TXT_ENTRY = 'google.com, pub-9341291547647066, DIRECT, f08c47fec0942fa0\n';

describe('ads.txt', () => {
  it('authorizes the portfolio AdSense account from the public root', async () => {
    const contents = await readFile(new URL('../public/ads.txt', import.meta.url), 'utf8');

    expect(contents).toBe(ADS_TXT_ENTRY);
  });
});
