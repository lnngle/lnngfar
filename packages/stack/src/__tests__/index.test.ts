import { describe, it, expect, beforeAll } from 'vitest';
import { writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { homedir } from 'node:os';
import { loadStack, installStack, validateStack, listStacks } from '../index';

const testStackDir = resolve(__dirname, '../../../../stacks/far-web-java');

describe('validateStack', () => {
  it('should validate far-web-java stack.yml', () => {
    const r = validateStack(testStackDir);
    expect(r.valid).toBe(true);
    expect(r.errors).toHaveLength(0);
  });

  it('should fail on empty directory', () => {
    const empty = resolve(__dirname, '../tmp-empty');
    mkdirSync(empty, { recursive: true });
    const r = validateStack(empty);
    expect(r.valid).toBe(false);
    expect(r.errors).toContain('stack.yml not found');
    rmSync(empty, { recursive: true, force: true });
  });

  it('should fail on missing required fields', () => {
    const badDir = resolve(__dirname, '../tmp-bad');
    mkdirSync(badDir, { recursive: true });
    writeFileSync(resolve(badDir, 'stack.yml'), 'type: fullstack\n');
    const r = validateStack(badDir);
    expect(r.errors.some((e) => e.includes('name'))).toBe(true);
    rmSync(badDir, { recursive: true, force: true });
  });
});

describe('installStack + loadStack', () => {
  it('should install and load far-web-java', () => {
    const name = 'far-web-java-test';
    // Clean up previous test install
    const target = join(homedir(), '.lnngfar', 'stacks', name);
    rmSync(target, { recursive: true, force: true });

    const s = installStack(name, testStackDir);
    expect(s.definition.name).toBe('far-web-java');
    expect(s.definition.version).toBe('0.1.0');
    expect(existsSync(target)).toBe(true);

    const loaded = loadStack(name);
    expect(loaded.definition.name).toBe('far-web-java');
  });
});

describe('listStacks', () => {
  it('should list installed stacks', () => {
    // At minimum, far-web-java-test should be installed from previous test
    const list = listStacks();
    expect(list.length).toBeGreaterThanOrEqual(1);
  });
});
