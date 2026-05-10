import { describe,it,expect } from 'vitest';
import { parseSpec, indexSpecs, loadSpecContext, syncSpecs } from '../index';
import { resolve } from 'node:path';

const specsRoot = resolve(__dirname, '../../../../specs');

describe('parseSpec',()=>{
  it('should parse p1 spec',()=>{
    const doc = parseSpec(resolve(specsRoot,'p1-foundation/spec.md'));
    expect(doc.status).toBe('done');
    expect(doc.requirements.length).toBeGreaterThan(0);
  });
});

describe('indexSpecs',()=>{
  it('should index all specs',()=>{
    const idx = indexSpecs(specsRoot);
    expect(Object.keys(idx.modules).length).toBeGreaterThanOrEqual(2);
    expect(idx.modules['p1-foundation']).toBeDefined();
  });
});

describe('loadSpecContext',()=>{
  it('should load module context',()=>{
    const ctx = loadSpecContext('p1-foundation', specsRoot);
    expect(ctx.status).toBe('done');
    expect(ctx.entities.length).toBeGreaterThan(0);
  });
});

describe('syncSpecs',()=>{
  it('should sync spec status',async()=>{
    await expect(syncSpecs('p1-foundation', specsRoot)).resolves.toBeUndefined();
  });
  it('should throw for unknown module',async()=>{
    await expect(syncSpecs('nope', specsRoot)).rejects.toThrow();
  });
});
