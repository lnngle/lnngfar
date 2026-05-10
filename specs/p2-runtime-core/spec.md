# Feature Specification: Runtime Core

**Feature Branch**: `p2-runtime-core`  
**Created**: 2026-05-11  
**Status**: Building  
**Input**: 构建 lnngfar 运行时核心。

## User Scenarios & Testing

### User Story 1 - 运行时容器生命周期 (Priority: P1)

作为 Stack 开发者和 CLI 系统，我需要 Runtime Container 提供统一的 boot→init→load-modules→ready→shutdown 生命周期。

**Acceptance Scenarios**:

1. **Given** Runtime 已创建, **When** 调用 `boot()`, **Then** 依次执行 boot→init→ready，返回 ready 状态。
2. **Given** Runtime 处于 running, **When** 调用 `shutdown()`, **Then** 所有模块的 shutdown 回调被调用。

### User Story 2 - 事件总线 (Priority: P1)

模块间通过 Event Bus 松耦合通信。

**Acceptance Scenarios**:

1. **Given** 模块 A 订阅 `module:loaded`, **When** 发布该事件, **Then** 模块 A 收到通知。
2. **Given** 模块 B 取消订阅, **When** 再次发布, **Then** 模块 B 不再收到。

### User Story 3 - 模块加载 (Priority: P2)

Module Loader 支持动态加载/卸载 `LnngfarModule`。

**Acceptance Scenarios**:

1. **Given** 合法模块, **When** `registerModule()`, **Then** 模块 init 钩子被调用。
2. **Given** 已注册模块, **When** `unregisterModule()`, **Then** shutdown 钩子被调用。

### User Story 4 - 上下文系统 (Priority: P2)

Context System 提供 key-value 数据存储。

**Acceptance Scenarios**:

1. **Given** context 为空, **When** `loadContext('specs', data)`, **Then** `getContext('specs')` 返回 data。
2. **Given** 查询不存在 key, **When** `getContext('unknown')`, **Then** 返回 null。

## Edge Cases

- 重复注册同名模块抛出错误。
- 关闭未启动的 Runtime 不抛异常（幂等）。
- 事件无订阅者时发布不报错。
- shut down 中模块异常不影响其他模块。

## Requirements

- **FR-001**: `boot(config)` 按序执行 boot→init→load-modules→ready。
- **FR-002**: `shutdown()` 逆序调用模块 shutdown。
- **FR-003**: `registerModule(module)` + `unregisterModule(name)`。
- **FR-004**: `emitEvent(event, data?)` + `onEvent(event, handler)`。
- **FR-005**: `loadContext(key, data)` + `getContext(key)`。
- **FR-006**: Runtime 暴露生命周期状态。
- **FR-007**: 模块实现 `LnngfarModule` 接口（name + init? + shutdown?）。

## Success Criteria

- **SC-001**: boot→shutdown 生命周期回调顺序正确。
- **SC-002**: 事件总线支持 ≥10 并发订阅者。
- **SC-003**: 回归 P0+P1 全部测试通过。
