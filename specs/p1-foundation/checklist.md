# P1 - Foundation Checklist

## 代码规范

- [x] TypeScript strict mode
- [x] ESLint no-explicit-any: error
- [x] Prettier formatted
- [x] kebab-case file naming

## 架构约束

- [x] pnpm workspace Monorepo
- [x] @lnngfar/* 包命名
- [x] 每个 package 独立 src/index.ts
- [x] 无循环依赖 (types ← logger ← config ← workspace ✓单向)

## 测试覆盖

| package | tests | 覆盖项 |
|---------|-------|--------|
| @lnngfar/logger | 4 | 创建/日志级别/格式/静默 |
| @lnngfar/config-loader | 7 | 加载/校验/异常 |
| @lnngfar/workspace-manager | 4 | 扫描/创建/异常 |
| **总计** | **15** | **-**

## CI

- [x] .github/workflows/ci.yml lint + test + build
- [x] push/PR 触发

## 回归测试

P1 回归 P0:
- [x] .codebuddy/commands/ 14 speckit 命令仍然可用
- [x] .lnngfar/ 目录未被意外覆盖

## 运行

```bash
pnpm test    # 15 tests should pass
pnpm lint    # 0 errors
```
