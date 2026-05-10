# API Contracts: Runtime Core

## 1. `boot(config: RuntimeConfig): Promise<void>`

- **Pre**: Runtime 处于 created 或 stopped 状态
- **Post**: 生命周期执行完成，状态为 ready/running
- **Error**: 模块 init 失败时抛异常

## 2. `registerModule(module: LnngfarModule): void`

- **Pre**: module.name 非空且未注册
- **Post**: 模块添加到注册表，若 Runtime 已 running 则调 init
- **Error**: 重复注册时抛 `ModuleAlreadyRegisteredError`

## 3. `emitEvent(event: string, data?: unknown): void`

- **Pre**: 无
- **Post**: 所有订阅该事件的 handler 被调用
- **Side Effect**: handler 内抛异常不阻断其他 handler

## 4. `loadContext(key: string, data: unknown): void`

- **Pre**: 无
- **Post**: data 存储在 context 中
