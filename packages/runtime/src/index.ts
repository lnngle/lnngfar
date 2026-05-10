// @lnngfar/runtime - lnngfar 运行时核心

import { createLogger } from '@lnngfar/logger';
import { LogLevel } from '@lnngfar/types';

// ── Types ──────────────────────────────────────────

export type RuntimeState = 'created' | 'booting' | 'init' | 'ready' | 'running' | 'shutting_down' | 'stopped';

export type EventHandler = (data?: unknown) => void | Promise<void>;
export type StateChangeHandler = (from: RuntimeState, to: RuntimeState) => void;

export interface LnngfarModule {
  name: string;
  init?: () => Promise<void>;
  shutdown?: () => Promise<void>;
}

export interface RuntimeConfig {
  modules?: LnngfarModule[];
}

// ── Event Bus ──────────────────────────────────────

class EventBus {
  private handlers = new Map<string, Set<EventHandler>>();

  on(event: string, handler: EventHandler): void {
    if (!this.handlers.has(event)) this.handlers.set(event, new Set());
    this.handlers.get(event)!.add(handler);
  }

  off(event: string, handler: EventHandler): void {
    this.handlers.get(event)?.delete(handler);
  }

  emit(event: string, data?: unknown): void {
    this.handlers.get(event)?.forEach((handler) => {
      try { void handler(data); } catch (err) {
        logger.warn(`Event handler error for "${event}": ${err}`);
      }
    });
  }
}

// ── Context Store ──────────────────────────────────

class ContextStore {
  private storage = new Map<string, unknown>();

  /** 加载上下文（同步存储，key 支持 a/b/c 路径格式） */
  load(key: string, data: unknown): void {
    // Normalize key to support nested dot-notation for structured access
    this.storage.set(key, data);
  }

  /** 异步加载（契约兼容，默认委托给同步 load） */
  async loadAsync(key: string): Promise<unknown> {
    return this.storage.get(key) ?? null;
  }

  get<T = unknown>(key: string): T | null {
    // Support dot-notation path: 'specs.product.user' looks up 'specs'→'product'→'user'
    const parts = key.split('.');
    let current: unknown = this.storage.get(parts[0]);
    for (let i = 1; i < parts.length && current !== null && current !== undefined; i++) {
      if (typeof current === 'object' && current !== null) {
        current = (current as Record<string, unknown>)[parts[i]];
      } else {
        return null;
      }
    }
    return current as T ?? null;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }
}

// ── Runtime ────────────────────────────────────────

const logger = createLogger('runtime', LogLevel.INFO);

export class Runtime {
  private _state: RuntimeState = 'created';
  private modules = new Map<string, LnngfarModule>();
  private stateListeners = new Set<StateChangeHandler>();
  readonly events = new EventBus();
  readonly context = new ContextStore();

  // ── State ────────────────────────────────────────

  get state(): RuntimeState { return this._state; }

  private setState(next: RuntimeState): void {
    const prev = this._state;
    this._state = next;
    this.stateListeners.forEach((fn) => { try { fn(prev, next); } catch {} });
    this.events.emit('runtime:state-change', { from: prev, to: next });
  }

  /** 注册状态变更监听器（P6/P8/P10 需要） */
  onStateChange(handler: StateChangeHandler): void {
    this.stateListeners.add(handler);
  }

  // ── Convenience: emitEvent / onEvent (contract-compatible) ──

  emitEvent(event: string, data?: unknown): void { this.events.emit(event, data); }
  onEvent(event: string, handler: EventHandler): void { this.events.on(event, handler); }

  // ── Context (contract-compatible) ──

  async loadContext(name: string): Promise<unknown> {
    return this.context.loadAsync(name);
  }

  // ── Lifecycle ─────────────────────────────────────

  async boot(config: RuntimeConfig = {}): Promise<void> {
    if (this._state !== 'created' && this._state !== 'stopped') {
      throw new Error(`Cannot boot from state "${this._state}"`);
    }

    this.setState('booting');
    logger.info('Runtime booting...');

    for (const mod of config.modules ?? []) this.registerModule(mod);

    this.setState('init');
    for (const [, mod] of this.modules) {
      if (mod.init) {
        logger.info(`Initializing module: ${mod.name}`);
        await mod.init();
      }
    }

    this.setState('ready');
    this.setState('running');
    this.events.emit('runtime:ready');
    logger.info('Runtime ready');
  }

  // ── Modules ───────────────────────────────────────

  registerModule(module: LnngfarModule): void {
    if (this.modules.has(module.name)) throw new Error(`Module "${module.name}" is already registered`);
    this.modules.set(module.name, module);
    this.events.emit('module:registered', { name: module.name });
    logger.info(`Module registered: ${module.name}`);
  }

  unregisterModule(name: string): void {
    if (!this.modules.has(name)) throw new Error(`Module "${name}" is not registered`);
    this.modules.delete(name);
    this.events.emit('module:unregistered', { name });
  }

  getModule(name: string): LnngfarModule | undefined { return this.modules.get(name); }

  /** 获取所有已注册模块名称（P3/P4/P10 需要） */
  getModules(): string[] { return Array.from(this.modules.keys()); }

  // ── Shutdown ──────────────────────────────────────

  async shutdown(): Promise<void> {
    if (this._state === 'stopped' || this._state === 'created') return;
    this.setState('shutting_down');
    logger.info('Runtime shutting down...');

    const reverse = Array.from(this.modules.values()).reverse();
    for (const mod of reverse) {
      if (mod.shutdown) {
        try {
          logger.info(`Shutting down module: ${mod.name}`);
          await mod.shutdown();
        } catch (err) { logger.error(`Module "${mod.name}" shutdown error: ${err}`); }
      }
    }

    this.setState('stopped');
    this.events.emit('runtime:stopped');
    logger.info('Runtime stopped');
  }
}
