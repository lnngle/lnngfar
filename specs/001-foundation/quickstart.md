# Quickstart: lnngfar Foundation

## 前置

- Node.js ≥ 20: `node --version`
- pnpm ≥ 8: `pnpm --version`

## 安装

```bash
cd lnngfar
pnpm install
```

## 运行测试

```bash
pnpm test
```

**预期输出**: 15 tests passed

## Lint + Format

```bash
pnpm lint         # 预期: 0 errors
pnpm format:check # 预期: All matched files use Prettier code style!
```

## 快速验证 API

```bash
# 创建临时 Node 脚本验证各模块
node -e "
const { createLogger, LogLevel } = require('./packages/logger/src/index.ts');
const logger = createLogger('test', LogLevel.INFO);
logger.info('lnngfar foundation works');
"
```

**预期输出**: `[2026-05-10T...] [INFO] [test] lnngfar foundation works`

## 验证 Monorepo 结构

```bash
ls packages/
# types/  logger/  config-loader/  workspace-manager/
```

## 通过标准

- [x] `pnpm install` 无错误
- [x] `pnpm test` 15 tests pass
- [x] `pnpm lint` 0 errors
