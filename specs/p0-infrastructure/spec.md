# P0 - Speckit Infrastructure Setup Spec

## 状态
status: done

## 目标
准备 speckit 开发环境，确保后续 P 阶段可正常执行。

## Goals
- [x] 验证 `.codebuddy/commands/` 中 14 个 speckit 命令可用
- [x] Node.js ≥ 20 + pnpm ≥ 8
- [x] 创建 `specs/`、`.lnngfar/ai/`、`.lnngfar/runtime/` 目录
- [x] 优化 `.specify/extensions.yml`，移除过多 auto-commit hook

## Non Goals
- 不编写代码
- 不创建 package

## Deliverables
- `.lnngfar/` 目录就绪
- `specs/` 目录就绪
- `extensions.yml` hook 清理完成

## 验证
- `ls .codebuddy/commands/speckit.*.md` → 14 个文件
- `node --version` → v24.15.0
- `pnpm --version` → 11.0.9
