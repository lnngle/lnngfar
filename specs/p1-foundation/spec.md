# P1 - Foundation Spec

## 状态
status: done

## 目标
建立 lnngfar Monorepo 基础工程和开发工具链。

## Goals
- [x] pnpm workspace Monorepo
- [x] TypeScript strict mode
- [x] Vitest 测试框架（含 workspace config）
- [x] ESLint + Prettier
- [x] GitHub Actions CI
- [x] Git 忽略规则

## Core Modules

### @lnngfar/types
共享类型定义：LnngfarConfig, Workspace, Project, Logger, LogLevel

### @lnngfar/logger
统一日志模块：`createLogger(name, level)` → Logger { debug, info, warn, error }

### @lnngfar/config-loader
配置加载：`loadConfig(path)` → LnngfarConfig，`validateConfig(obj)` → boolean

### @lnngfar/workspace-manager
工作区管理：`loadWorkspace(root)` → Workspace，`createProject(name, opts)` → Project

## Deliverables
```
packages/
├── types/           (2 files: package.json, src/index.ts)
├── logger/          (3 files: package.json, src/index.ts, test)
├── config-loader/   (3 files: package.json, src/index.ts, test)
└── workspace-mgr/   (3 files: package.json, src/index.ts, test)

Root: package.json, pnpm-workspace.yaml, tsconfig.base.json,
      vitest.workspace.ts, .eslintrc.json, .prettierrc, .gitignore
```

## 验证
- `pnpm test` → 14 tests pass
- `pnpm lint` → 0 errors
