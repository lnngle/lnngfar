# Implementation Plan: CLI System

**Branch**: `p3-cli-system` | **Spec**: [spec.md](spec.md)

## Technical Context

**Language**: TypeScript 5.3+  
**Dependencies**: @lnngfar/runtime, @lnngfar/workspace-manager, @lnngfar/logger  
**Package**: `packages/cli` + bin entry

## Constitution Check: ✅

## Structure

```text
packages/cli/
├── package.json         # bin: { "lnngfar": "./src/cli.ts" }
├── src/
│   ├── cli.ts           # Entry: Runtime boot + parse args + run
│   ├── registry.ts      # CommandRegistry
│   ├── commands/
│   │   ├── init.ts      # init command (real)
│   │   └── stubs.ts     # stack/spec/ai/verify/deploy stubs
│   └── __tests__/
│       ├── registry.test.ts
│       └── init.test.ts
```
