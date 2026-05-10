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
      await new Runtime().boot({ modules: [{ name: 'test', init: initSpy }] });
      expect(initSpy).toHaveBeenCalledOnce();
    });

    it('should run shutdown hooks on shutdown', async () => {
      const sd = vi.fn();
      const rt = new Runtime();
      await rt.boot({ modules: [{ name: 'test', shutdown: sd }] });
      await rt.shutdown();
      expect(sd).toHaveBeenCalledOnce();
    });

    it('should throw when booting from non-created state', async () => {
      const rt = new Runtime();
      await rt.boot();
      await expect(rt.boot()).rejects.toThrow('Cannot boot');
    });
  });

  describe('modules', () => {
    it('should register and unregister', () => {
      const rt = new Runtime();
      rt.registerModule({ name: 'test' });
      expect(rt.getModule('test')).toBeDefined();
      rt.unregisterModule('test');
      expect(rt.getModule('test')).toBeUndefined();
    });

    it('should throw on duplicate', () => {
      const rt = new Runtime();
      rt.registerModule({ name: 'test' });
      expect(() => rt.registerModule({ name: 'test' })).toThrow('already registered');
    });

    it('should list all modules via getModules()', () => {
      const rt = new Runtime();
      rt.registerModule({ name: 'a' });
      rt.registerModule({ name: 'b' });
      expect(rt.getModules()).toEqual(['a', 'b']);
    });
  });

  describe('events', () => {
    it('should emit and receive', () => {
      const handler = vi.fn();
      const rt = new Runtime();
      rt.events.on('test:event', handler);
      rt.emitEvent('test:event', { value: 42 });
      expect(handler).toHaveBeenCalledWith({ value: 42 });
    });

    it('should unsub via off()', () => {
      const h = vi.fn();
      const rt = new Runtime();
      rt.events.on('e', h);
      rt.events.off('e', h);
      rt.emitEvent('e');
      expect(h).not.toHaveBeenCalled();
    });

    it('should support onEvent() contract API', () => {
      const h = vi.fn();
      const rt = new Runtime();
      rt.onEvent('x', h);
      rt.emitEvent('x', 'data');
      expect(h).toHaveBeenCalledWith('data');
    });

    it('should handle 10 concurrent subscribers', () => {
      const rt = new Runtime();
      const hs = Array.from({ length: 10 }, () => vi.fn());
      for (const h of hs) rt.events.on('c', h);
      rt.events.emit('c', 'data');
      for (const h of hs) expect(h).toHaveBeenCalled();
    });
  });

  describe('context', () => {
    it('should load and get context', () => {
      const rt = new Runtime();
      rt.context.load('specs', { module: 'user' });
      expect(rt.context.get('specs')).toEqual({ module: 'user' });
    });

    it('should support dot-notation lookup', () => {
      const rt = new Runtime();
      rt.context.load('specs', { product: { user: { status: 'done' } } });
      expect(rt.context.get('specs.product.user')).toEqual({ status: 'done' });
    });

    it('should return null for unknown key', () => {
      expect(new Runtime().context.get('unknown')).toBeNull();
    });

    it('should support loadContext() contract API', async () => {
      const rt = new Runtime();
      rt.context.load('specs', { module: 'user' });
      expect(await rt.loadContext('specs')).toEqual({ module: 'user' });
    });
  });

  describe('state change', () => {
    it('should notify on state transitions', async () => {
      const listener = vi.fn();
      const rt = new Runtime();
      rt.onStateChange(listener);
      await rt.boot();
      expect(listener).toHaveBeenCalled();
    });

    it('should emit runtime:state-change event', async () => {
      const h = vi.fn();
      const rt = new Runtime();
      rt.events.on('runtime:state-change', h);
      await rt.boot();
      expect(h).toHaveBeenCalledWith(
        expect.objectContaining({ from: 'created', to: 'booting' }),
      );
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
      const rt = new Runtime();
      await rt.boot({ modules: [{ name: 'bad', shutdown: () => Promise.reject('fail') }] });
      await rt.shutdown();
      expect(rt.state).toBe('stopped');
    });
  });
});
