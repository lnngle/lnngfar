// @lnngfar/runtime - lnngfar 运行时核心

import { createLogger } from '@lnngfar/logger';
import { LogLevel } from '@lnngfar/types';

// ── Types ──────────────────────────────────────────

export type RuntimeState = 'created' | 'booting' | 'init' | 'ready' | 'running' | 'shutting_down' | 'stopped';

export type EventHandler = (data?: unknown) => void | Promise<void>;

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
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);
  }

  off(event: string, handler: EventHandler): void {
    this.handlers.get(event)?.delete(handler);
  }

  emit(event: string, data?: unknown): void {
    this.handlers.get(event)?.forEach((handler) => {
      try {
        void handler(data);
      } catch (err) {
        logger.warn(`Event handler error for "${event}": ${err}`);
      }
    });
  }
}

// ── Context Store ──────────────────────────────────

class ContextStore {
  private storage = new Map<string, unknown>();

  load(key: string, data: unknown): void {
    this.storage.set(key, data);
  }

  get<T = unknown>(key: string): T | null {
    return (this.storage.get(key) as T) ?? null;
  }

  has(key: string): boolean {
    return this.storage.has(key);
  }
}

// ── Runtime ────────────────────────────────────────

const logger = createLogger('runtime', LogLevel.INFO);

export class Runtime {
  private _state: RuntimeState = 'created';
  private modules = new Map<string, LnngfarModule>();
  readonly events = new EventBus();
  readonly context = new ContextStore();

  get state(): RuntimeState {
    return this._state;
  }

  async boot(config: RuntimeConfig = {}): Promise<void> {
    if (this._state !== 'created' && this._state !== 'stopped') {
      throw new Error(`Cannot boot from state "${this._state}"`);
    }

    this._state = 'booting';
    logger.info('Runtime booting...');

    // Register pre-configured modules
    for (const mod of config.modules ?? []) {
      this.registerModule(mod);
    }

    // Load modules: call init hooks
    this._state = 'init';
    for (const [, mod] of this.modules) {
      if (mod.init) {
        logger.info(`Initializing module: ${mod.name}`);
        await mod.init();
      }
    }

    this._state = 'ready';
    this._state = 'running';
    this.events.emit('runtime:ready');
    logger.info('Runtime ready');
  }

  registerModule(module: LnngfarModule): void {
    if (this.modules.has(module.name)) {
      throw new Error(`Module "${module.name}" is already registered`);
    }
    this.modules.set(module.name, module);
    this.events.emit('module:registered', { name: module.name });
    logger.info(`Module registered: ${module.name}`);
  }

  unregisterModule(name: string): void {
    if (!this.modules.has(name)) {
      throw new Error(`Module "${name}" is not registered`);
    }
    this.modules.delete(name);
    this.events.emit('module:unregistered', { name });
  }

  getModule(name: string): LnngfarModule | undefined {
    return this.modules.get(name);
  }

  async shutdown(): Promise<void> {
    if (this._state === 'stopped' || this._state === 'created') {
      return; // idempotent
    }

    this._state = 'shutting_down';
    logger.info('Runtime shutting down...');

    // Shutdown in reverse registration order
    const reverse = Array.from(this.modules.values()).reverse();
    for (const mod of reverse) {
      if (mod.shutdown) {
        try {
          logger.info(`Shutting down module: ${mod.name}`);
          await mod.shutdown();
        } catch (err) {
          logger.error(`Module "${mod.name}" shutdown error: ${err}`);
        }
      }
    }

    this._state = 'stopped';
    this.events.emit('runtime:stopped');
    logger.info('Runtime stopped');
  }
}
