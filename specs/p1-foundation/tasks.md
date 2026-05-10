# P1 - Foundation Tasks

## 任务列表

| # | 任务 | 状态 | 产出 | 验证 |
|---|------|------|------|------|
| T001 | root package.json + pnpm-workspace.yaml + tsconfig.base.json | ✅ | 3 files | pnpm install |
| T002 | ESLint + Prettier 配置 | ✅ | .eslintrc.json .prettierrc | pnpm lint |
| T003 | Vitest workspace + .gitignore | ✅ | vitest.workspace.ts .gitignore | vitest |
| T004 | GitHub Actions CI | ✅ | .github/workflows/ci.yml | CI pass |
| T005 | @lnngfar/types package | ✅ | 2 files | types compile |
| T006 | @lnngfar/logger package + tests | ✅ | 4 files | 4 tests pass |
| T007 | @lnngfar/config-loader package + tests | ✅ | 4 files | 7 tests pass |
| T008 | @lnngfar/workspace-manager package + tests | ✅ | 4 files | 4 tests pass |
| T009 | spec 文档: plan.md tasks.md checklist.md | ✅ | 3 files | 文档完整 |

## 任务依赖

```
T001
 ├── T002 (并行)
 │    └── T005 → T006 → T007 → T008
 ├── T003 (并行)
 └── T004 (并行)
T009 (最后)
```

## 测试用例与 spec 对照

| Spec 要求 | 测试用例 |
|-----------|----------|
| createLogger 返回 Logger 接口 | logger: should create logger with name |
| LogLevel 控制输出 | logger: should silence debug when level is INFO |
| 输出格式含 [LEVEL] [name] | logger: should include timestamp and name |
| loadConfig 从文件读取 | config: should load config from lnngfar.config.json |
| 文件不存在抛异常 | config: should throw when no config file exists |
| validateConfig 校验 project/stack | config: 4 validation tests |
| loadWorkspace 扫描 packages/ | workspace: should load workspace with packages |
| createProject 创建项目目录 | workspace: should create project + verify files |
| 重复创建抛异常 | workspace: should throw if project exists |
