# lnngfar

> AI-native industrial software engineering platform.

**lnngfar** (Long AI Native Engineering Runtime) 基于 GitHub [spec-kit](https://github.com/github/spec-kit) 构建，是一个 AI 原生的软件工程运行时与工业化平台。

核心思想：**"用工业模板解决确定性，用 AI 解决创造性"**

## 项目结构

```
lnngfar/
├── packages/              # Monorepo (14 packages)
│   ├── types/             # @lnngfar/types
│   ├── logger/            # @lnngfar/logger
│   ├── config-loader/     # @lnngfar/config-loader
│   ├── workspace-manager/ # @lnngfar/workspace-manager
│   ├── runtime/           # @lnngfar/runtime
│   ├── cli/               # @lnngfar/cli
│   ├── stack/             # @lnngfar/stack
│   ├── template/          # @lnngfar/template
│   ├── spec/              # @lnngfar/spec-engine
│   ├── skill/             # @lnngfar/skill
│   ├── ai-runtime/        # @lnngfar/ai-runtime
│   ├── testing/           # @lnngfar/testing
│   └── lifecycle/         # @lnngfar/lifecycle
├── stacks/                # Official stacks
│   ├── far-web-java/      # Vue3 + Spring Boot
│   └── far-mini-uni/      # uni-app cross-platform
├── specs/                 # Specification documents (P0-P11)
├── docs/                  # Design documents
├── .specify/              # spec-kit configuration
└── .codebuddy/            # AI agent commands
```

## 快速开始

### 环境要求

- Node.js ≥ 20
- pnpm ≥ 8

### 安装

```bash
git clone https://github.com/lnngle/lnngfar.git
cd lnngfar
pnpm install
```

### 运行测试

```bash
pnpm test
```

### 创建项目

```bash
pnpm --filter @lnngfar/cli exec tsx src/cli.ts init my-app
```

### 安装 Stack

```bash
pnpm --filter @lnngfar/cli exec tsx src/cli.ts stack add far-web-java ./stacks/far-web-java
```

## 架构

```
CLI / IDE
    ↓
lnngfar Core (Runtime + Stack + Template + Spec + Skill + AI + Lifecycle)
    ↓
Stack Plugins (far-web-java, far-mini-uni)
```

## 技术栈

| 领域 | 技术 |
|------|------|
| Language | TypeScript 5.3+ (strict) |
| Monorepo | pnpm workspace |
| Testing | Vitest |
| Linting | ESLint + Prettier |
| CI | GitHub Actions |
| AI | spec-kit + deepseek/openai/glm |

## 开发流程

遵循 **Spec-Driven Development**:

```text
constitution → specify → plan → tasks → implement → checklist → verify
```

详见 [`docs/lnngfar-speckit.md`](docs/lnngfar-speckit.md)

## 文档

- [产品设计文档](docs/lnngfar-design.md)
- [speckit 实现计划](docs/lnngfar-speckit.md)
- [阶段开发模板](specs/STAGE_TEMPLATE.md)
- [阶段检查清单](specs/STAGE_CHECKLIST.md)
- [启动门禁](.lnngfar/PRE_STAGE_GATE.md)

## License

MIT
