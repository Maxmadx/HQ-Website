import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { walkSources } from './imageOptimisation';

let tmpDir;

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'img-opt-'));
});

afterEach(async () => {
  await fs.rm(tmpDir, { recursive: true, force: true });
});

async function makeFixture(files) {
  for (const [rel, content] of Object.entries(files)) {
    const full = path.join(tmpDir, rel);
    await fs.mkdir(path.dirname(full), { recursive: true });
    await fs.writeFile(full, content);
  }
}

describe('walkSources', () => {
  it('returns paths to all jpg/jpeg/png/webp files under rootDir', async () => {
    await makeFixture({
      'r66/hero.jpg': 'fake',
      'r66/gallery/shot.png': 'fake',
      'logos/HQ.webp': 'fake',
      'docs/README.md': 'fake',
      'r66/data.json': 'fake',
    });
    const sources = await walkSources(tmpDir);
    const rel = sources.map(p => path.relative(tmpDir, p)).sort();
    expect(rel).toEqual([
      'logos/HQ.webp',
      'r66/gallery/shot.png',
      'r66/hero.jpg',
    ]);
  });

  it('skips directories named in skipDirs', async () => {
    await makeFixture({
      'r66/hero.jpg': 'fake',
      'optimised/already.avif': 'fake',
      'optimised/already.jpg': 'fake',
    });
    const sources = await walkSources(tmpDir, { skipDirs: ['optimised'] });
    const rel = sources.map(p => path.relative(tmpDir, p));
    expect(rel).toEqual(['r66/hero.jpg']);
  });

  it('returns empty array when rootDir does not exist', async () => {
    const sources = await walkSources(path.join(tmpDir, 'does-not-exist'));
    expect(sources).toEqual([]);
  });

  it('handles uppercase extensions case-insensitively', async () => {
    await makeFixture({
      'r66/HERO.JPG': 'fake',
      'r66/Logo.PNG': 'fake',
    });
    const sources = await walkSources(tmpDir);
    expect(sources).toHaveLength(2);
  });
});
