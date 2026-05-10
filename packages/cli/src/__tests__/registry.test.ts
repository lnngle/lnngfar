import { describe, it, expect, afterEach } from 'vitest';
import { registry, type Command } from '../registry';
import { stubs } from '../commands/stubs';

const names: string[] = [];

function reg(cmd: Command): void {
  names.push(cmd.meta.name);
  try { registry.register(cmd); } catch { /* ok */ }
}

afterEach(() => {
  for (const name of names.splice(0)) registry.unregister(name);
});

describe('CommandRegistry', () => {
  it('should register and retrieve', () => {
    const cmd: Command = { meta: { name: 'x', description: 't' }, handle: async () => {} };
    reg(cmd);
    expect(registry.get('x')?.meta.name).toBe('x');
  });

  it('should show help for --help', async () => {
    expect(await registry.run(['--help'])).toBe(0);
  });

  it('should return 1 for unknown command', async () => {
    expect(await registry.run(['no-such'])).toBe(1);
  });

  it('should handle stub phase command', async () => {
    reg({ meta: { name: 'stack', description: 's', phase: 4 }, handle: async () => {} });
    expect(await registry.run(['stack'])).toBe(0);
  });

  it('should list commands', () => {
    reg({ meta: { name: 'init', description: 'init' }, handle: async () => {} });
    expect(registry.list().some((m) => m.name === 'init')).toBe(true);
  });
});

describe('stubs', () => {
  it('should have 5 stub commands', () => {
    expect(stubs).toHaveLength(5);
    expect(stubs[0].meta.name).toBe('stack');
    expect(stubs[0].meta.phase).toBe(4);
    expect(stubs[2].meta.phase).toBe(8);
    expect(stubs[4].meta.phase).toBe(12);
  });
});
