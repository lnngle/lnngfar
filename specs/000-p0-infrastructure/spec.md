# Feature Specification: P0 Infrastructure Setup

**Feature Branch**: `000-p0-infrastructure`  
**Created**: 2026-05-10  
**Status**: Done  
**Input**: 准备 speckit 开发环境，验证工具链，优化 Hook 配置。

## User Scenarios & Testing

### User Story 1 - Speckit 命令可用 (Priority: P1)

作为开发者，我需要 `.codebuddy/commands/` 下 14 个 speckit 命令全部可用，这样后续 P 阶段才能执行 `/speckit.constitution`、`/speckit.specify` 等流程。

**Acceptance Scenarios**:

1. **Given** 仓库已克隆, **When** 检查 `.codebuddy/commands/`, **Then** 14 个 `speckit.*.md` 文件存在且可用于 AI 编码代理。

---

### User Story 2 - 运行时目录就绪 (Priority: P1)

作为 lnngfar 运行时，我需要 `.lnngfar/ai/` 和 `.lnngfar/runtime/` 目录存在，供后续阶段存储 AI 上下文和生命周期状态。

**Acceptance Scenarios**:

1. **Given** P0 完成后, **When** 检查 `.lnngfar/`, **Then** 包含 `ai/` 和 `runtime/` 子目录。

---

### User Story 3 - Hook 配置优化 (Priority: P2)

作为开发者，我需要 speckit 的 Hook 不会在每个阶段自动 commit，避免无意义的 Git 历史污染。仅保留 `before_constitution` 和 `before_specify` 必要的 Hook。

**Acceptance Scenarios**:

1. **Given** `.specify/extensions.yml`, **When** 检查 `before_plan`、`before_implement` 等 Hook, **Then** 其 `enabled` 值为 `false`。

---

## Requirements

- **FR-001**: Node.js ≥ 20 可用。
- **FR-002**: pnpm ≥ 8 可用。
- **FR-003**: `.codebuddy/commands/speckit.*.md` 14 个文件完整。
- **FR-004**: `specs/` 目录存在（存放阶段 spec）。
- **FR-005**: `.lnngfar/ai/` 和 `.lnngfar/runtime/` 目录存在。
- **FR-006**: `.specify/extensions.yml` 中非必要 auto-commit hook 已禁用（仅保留 `before_constitution` + `before_specify`）。

## Success Criteria

- **SC-001**: `node --version` 输出 ≥ v20。
- **SC-002**: `pnpm --version` 输出 ≥ 8。
- **SC-003**: `ls .codebuddy/commands/speckit.*.md | wc -l` = 14。
- **SC-004**: `.specify/extensions.yml` 中 `enabled: true` 的 auto-commit hook ≤ 2 个。
