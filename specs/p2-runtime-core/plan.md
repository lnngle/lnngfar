# Implementation Plan: Runtime Core

**Branch**: `p2-runtime-core` | **Date**: 2026-05-11 | **Spec**: [spec.md](spec.md)

## Summary

构建 `@lnngfar/runtime`：Runtime Container + EventBus + ModuleLoader + ContextStore。纯 TypeScript 实现，无外部依赖。

## Technical Context

**Language/Version**: TypeScript 5.3+  
**Primary Dependencies**: @lnngfar/types, @lnngfar/logger  
**Testing**: Vitest  
**Target Platform**: Node.js 20+  
**Project Type**: library (Monorepo package)

## Constitution Check

| Gate | Status |
|------|--------|
| TypeScript strict | ✅ |
| ESLint no-explicit-any | ✅ |
| Tests ≥ 80% | ✅ 16 tests |
| Package naming @lnngfar/* | ✅ |

## Project Structure

```text
packages/runtime/
├── package.json
├── vitest.config.ts
├── src/
│   ├── index.ts          # Runtime + EventBus + ContextStore
│   └── __tests__/index.test.ts  # 16 tests
```
