# Feature Specification: CLI System

**Feature Branch**: `p3-cli-system` | **Status**: Building

## User Scenarios

### US1 - 命令注册与路由 (P1)
**Given** 注册了 `init` 命令, **When** 执行 `runCommand(['init'])`, **Then** init handler 被调用。
**Given** 未知命令, **When** 执行, **Then** 显示帮助。

### US2 - `lnngfar init` (P1)
**Given** 空目录, **When** `lnngfar init my-app`, **Then** 创建项目目录含 lnngfar.config.json。

### US3 - 占位命令 (P2)
**When** `lnngfar stack`, **Then** 提示 `P4 阶段实现`。

## Requirements
- **FR-001**: `registerCommand(name, cmd)` + `runCommand(argv)`
- **FR-002**: `lnngfar init <name>` → `createProject()`
- **FR-003**: 占位命令输出 `将在 P{N} 阶段实现`
- **FR-004**: CLI 作为 Runtime LnngfarModule
- **FR-005**: `lnngfar --help` 列出所有命令

## Success Criteria
- **SC-001**: `lnngfar init test-app` 创建项目目录
- **SC-002**: 未知命令显示帮助
- **SC-003**: 回归 P0-P2 全部测试通过
