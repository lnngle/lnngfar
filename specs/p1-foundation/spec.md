# Feature Specification: lnngfar Foundation

**Feature Branch**: `p1-foundation`  
**Created**: 2026-05-10  
**Status**: Done  
**Input**: 建立 lnngfar Monorepo 基础工程和开发工具链，包含 4 个核心 package。

## User Scenarios & Testing

### User Story 1 - Monorepo 工作区就绪 (Priority: P1)

作为 lnngfar 核心开发者，我需要 pnpm Monorepo 工作区能正确加载 `packages/` 目录，这样后续阶段才能独立开发和测试各模块。

**Priority Rationale**: 没有工作区就没有后续所有 package 开发。

**Independent Test**: 仅需 `pnpm install` 后检查 `packages/` 下模块是否可被识别即可独立验证。

**Acceptance Scenarios**:

1. **Given** 仓库根目录有 `pnpm-workspace.yaml`, **When** 执行 `pnpm install`, **Then** 所有 packages/* 下的模块被正确链接且无错误。
2. **Given** 工作区中存在 `@lnngfar/types`, **When** 其他 package 通过 `workspace:*` 引用, **Then** 可以正常导入类型。

---

### User Story 2 - 统一类型系统 (Priority: P1)

作为模块开发者，我需要 `@lnngfar/types` 提供所有核心类型定义（LnngfarConfig, Workspace, Logger），这样其他模块可以基于统一契约开发。

**Priority Rationale**: 类型是所有模块的基础契约，必须最先完成。

**Independent Test**: 导入 `@lnngfar/types` 并实例化 `LnngfarConfig` 即可验证。

**Acceptance Scenarios**:

1. **Given** `@lnngfar/types` 包存在, **When** 导入 `LnngfarConfig` 类型, **Then** TypeScript 编译通过且字段完整。

---

### User Story 3 - 统一日志系统 (Priority: P2)

作为模块开发者，我需要 `createLogger(name)` 提供带级别控制的日志输出，使所有模块的日志格式统一且可调试。

**Priority Rationale**: 日志是调试基础，但可在类型系统完成后实现。

**Independent Test**: 调用 `createLogger('test')` 并验证 INFO/ERROR 级别输出格式。

**Acceptance Scenarios**:

1. **Given** logger 级别设为 INFO, **When** 调用 `debug()`, **Then** 无输出。
2. **Given** logger 级别设为 INFO, **When** 调用 `error('msg')`, **Then** 输出含 `[ERROR] [test] msg` 和时间戳。

---

### User Story 4 - 配置加载与校验 (Priority: P2)

作为项目初始化器，我需要 `loadConfig(path)` 能从 `project.yml` 或 `lnngfar.config.json` 读取配置，并校验 `project` 和 `stack` 字段存在。

**Priority Rationale**: 配置是项目入口，但依赖类型和日志。

**Independent Test**: 创建临时配置文件并调用 `loadConfig()` 验证。

**Acceptance Scenarios**:

1. **Given** 目录中存在 `lnngfar.config.json`, **When** 调用 `loadConfig(dir)`, **Then** 返回完整配置对象。
2. **Given** 配置缺少 `project` 字段, **When** 调用 `validateConfig()`, **Then** 抛出 TypeError。
3. **Given** 目录中无配置文件, **When** 调用 `loadConfig()`, **Then** 抛出 "No config file found" 错误。

---

### User Story 5 - 项目创建工作区管理 (Priority: P3)

作为 CLI 用户，我需要 `createProject(name)` 创建新项目目录并初始化 `lnngfar.config.json` 和 `specs/` 结构。

**Priority Rationale**: 面向最终用户，依赖所有前置模块。

**Independent Test**: 调用 `createProject('test')` 验证目录和文件结构。

**Acceptance Scenarios**:

1. **Given** 项目名 `'my-app'`, **When** 调用 `createProject('my-app')`, **Then** 目录创建并包含 `lnngfar.config.json`、`specs/product/`。
2. **Given** 目录已存在, **When** 再次创建, **Then** 抛出 "already exists" 错误。

---

## Edge Cases

- 当配置文件中 JSON 格式非法时，`loadConfig` 必须给出明确的 parse 错误信息。
- 当 logger 在 SILENT 级别时，所有方法不应有任何输出。
- 当 `packages/` 目录为空时，`loadWorkspace` 应返回空数组而非报错。
- 当 workspace 根目录不存在 `package.json` 时，`loadWorkspace` 应优雅降级（config 为 null）。

---

## Requirements

### Functional Requirements

- **FR-001**: 系统必须提供 pnpm Monorepo 工作区，`packages/*` 下所有子包通过 `workspace:*` 协议依赖。
- **FR-002**: 系统必须通过 `@lnngfar/types` 提供统一的 `LnngfarConfig`、`Workspace`、`Project`、`Logger` 类型定义。
- **FR-003**: 系统必须提供 `createLogger(name, level?)` 函数，返回含 `debug/info/warn/error` 方法的 Logger 对象，输出格式为 `[TIMESTAMP] [LEVEL] [NAME] message`。
- **FR-004**: 系统必须提供 `loadConfig(path)` 函数，支持 `.json` 和 `.yml` 两种配置格式。
- **FR-005**: 系统必须提供 `validateConfig(obj)` 函数，校验 `project` 和 `stack` 字段存在性。
- **FR-006**: 系统必须提供 `loadWorkspace(root)` 函数，扫描 `packages/` 并返回包列表。
- **FR-007**: 系统必须提供 `createProject(name, opts?)` 函数，创建项目目录及基础结构。
- **FR-008**: 系统必须通过 ESLint strict 模式保证代码质量，禁止 `any` 类型。
- **FR-009**: 系统必须通过 GitHub Actions CI 自动执行 lint + test + build。
- **FR-010**: 所有 package 必须包含 Vitest 单元测试。

### Key Entities

- **LnngfarConfig**: 项目配置实体，含 `project(ProjectInfo)`、`stack(StackRef)`、`ai(AiConfig)?`、`skills`、`templates`、`test(TestConfig)`、`deploy(DeployConfig)`。
- **Workspace**: 工作区实体，含 `root`、`packages(PackageInfo[])`、`config(LnngfarConfig|null)`。
- **Project**: 项目实体，含 `name`、`path`、`config`。
- **Logger**: 日志接口，含 `debug/info/warn/error` 方法，使用 `LogLevel` 枚举控制输出。

## Success Criteria

- **SC-001**: `pnpm install` 在 30 秒内完成，0 错误。
- **SC-002**: `pnpm test` 15 个测试用例 100% 通过。
- **SC-003**: `pnpm lint` 0 错误，`any` 类型 0 处违规。
- **SC-004**: GitHub CI push 触发后 2 分钟内完成 lint+test+build，全通过。
- **SC-005**: 4 个 package 依赖方向为 `types ← logger ← config ← workspace`（单向无循环）。

## Assumptions

- 开发者已安装 Node.js ≥ 20 和 pnpm ≥ 8。
- 项目仅使用 TypeScript，不包含其他语言。
- 配置校验不做深度 schema 验证（P6 Spec Engine 补充）。
- `createProject` 只创建目录结构，不安装任何 stack。
