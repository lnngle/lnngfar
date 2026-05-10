# P0 - Infrastructure Tasks

## 任务列表

| # | 任务 | 状态 | 验证方式 |
|---|------|------|----------|
| T001 | 验证 speckit 14 命令 | ✅ | `ls .codebuddy/commands/speckit.*.md` |
| T002 | 验证 Node.js ≥ 20 | ✅ | `node --version` → v24.15.0 |
| T003 | 安装 pnpm | ✅ | `pnpm --version` → 11.0.9 |
| T004 | 创建目录 specs/ | ✅ | `dir specs/` |
| T005 | 创建目录 .lnngfar/ai/ | ✅ | `dir .lnngfar/` |
| T006 | 创建目录 .lnngfar/runtime/ | ✅ | `dir .lnngfar/` |
| T007 | 禁用 auto-commit hooks | ✅ | extensions.yml 14 hooks → enabled: false |
| T008 | Git commit + push | ✅ | commit b19f70f |

## 任务依赖

```
T001 + T002
   ↓
T003 (无依赖)
   ↓
T004 + T005 + T006 (并行)
   ↓
T007
   ↓
T008
```
