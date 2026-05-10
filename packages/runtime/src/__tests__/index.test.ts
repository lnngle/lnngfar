import { describe, it, expect, vi } from 'vitest';
import { Runtime, type LnngfarModule } from '../index';

describe('Runtime', () => {
  describe('lifecycle', () => {
    it('should boot and shutdown correctly', async () => {
      const rt = new Runtime();
      expect(rt.state).toBe('created');

      await rt.boot();
      expect(rt.state).toBe('running');

      await rt.shutdown();
      expect(rt.state).toBe('stopped');
    });

    it('should run module init hooks on boot', async () => {
      const initSpy = vi.fn();
      const mod: LnngfarModule = { name: 'test', init: initSpy };
      const rt = new Runtime();

      await rt.boot({ modules: [mod] });
      expect(initSpy).toHaveBeenCalledOnce();
    });

    it('should run module shutdown hooks on shutdown', async () => {
      const shutdownSpy = vi.fn();
      const mod: LnngfarModule = { name: 'test', shutdown: shutdownSpy };
      const rt = new Runtime();

      await rt.boot({ modules: [mod] });
      await rt.shutdown();
      expect(shutdownSpy).toHaveBeenCalledOnce();
    });

    it('should throw when booting from non-created/stopped state', async () => {
      const rt = new Runtime();
      await rt.boot();
      await expect(rt.boot()).rejects.toThrow('Cannot boot');
    });
  });

  describe('modules', () => {
    it('should register and unregister modules', () => {
      const rt = new Runtime();
      const mod: LnngfarModule = { name: 'test' };

      rt.registerModule(mod);
      expect(rt.getModule('test')).toBe(mod);

      rt.unregisterModule('test');
      expect(rt.getModule('test')).toBeUndefined();
    });

    it('should throw on duplicate registration', () => {
      const rt = new Runtime();
      rt.registerModule({ name: 'test' });
      expect(() => rt.registerModule({ name: 'test' })).toThrow('already registered');
    });
  });

  describe('events', () => {
    it('should emit and receive events', () => {
      const handler = vi.fn();
      const rt = new Runtime();

      rt.events.on('test:event', handler);
      rt.events.emit('test:event', { value: 42 });

      expect(handler).toHaveBeenCalledWith({ value: 42 });
    });

    it('should allow unsubscribing from events', () => {
      const handler = vi.fn();
      const rt = new Runtime();

      rt.events.on('test:event', handler);
      rt.events.off('test:event', handler);
      rt.events.emit('test:event');

      expect(handler).not.toHaveBeenCalled();
    });

    it('should not throw with no subscribers', () => {
      const rt = new Runtime();
      expect(() => rt.events.emit('no-subscribers')).not.toThrow();
    });

    it('should support 10 concurrent subscribers', () => {
      const rt = new Runtime();
      const handlers = Array.from({ length: 10 }, () => vi.fn());

      for (const h of handlers) rt.events.on('concurrent', h);
      rt.events.emit('concurrent', 'data');

      for (const h of handlers) expect(h).toHaveBeenCalled();
    });
  });

  describe('context', () => {
    it('should load and get context', () => {
      const rt = new Runtime();
      rt.context.load('specs', { module: 'user' });
      expect(rt.context.get('specs')).toEqual({ module: 'user' });
    });

    it('should return null for unknown key', () => {
      const rt = new Runtime();
      expect(rt.context.get('unknown')).toBeNull();
    });

    it('should overwrite existing context', () => {
      const rt = new Runtime();
      rt.context.load('key', 'old');
      rt.context.load('key', 'new');
      expect(rt.context.get('key')).toBe('new');
    });
  });

  describe('edge cases', () => {
    it('should be idempotent on double shutdown', async () => {
      const rt = new Runtime();
      await rt.boot();
      await rt.shutdown();
      await expect(rt.shutdown()).resolves.toBeUndefined();
    });

    it('should handle module shutdown errors gracefully', async () => {
      const mod: LnngfarModule = { name: 'bad', shutdown: () => Promise.reject('fail') };
      const rt = new Runtime();
      await rt.boot({ modules: [mod] });
      await expect(rt.shutdown()).resolves.toBeUndefined();
      expect(rt.state).toBe('stopped');
    });

    it('should emit runtime:ready on boot', () => {
      const handler = vi.fn();
      const rt = new Runtime();
      rt.events.on('runtime:ready', handler);

      rt.boot().then(() => {
        expect(handler).toHaveBeenCalled();
      });
    });
  });
});
