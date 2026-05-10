# lnngfar Speckit 实现计划

> 基于 GitHub spec-kit 的 lnngfar 自举实现方案
> speckit 版本：0.8.8
> 集成环境：codebuddy

---

# 一、Speckit 阶段映射

speckit 提供 8 个核心阶段 + Git 扩展，lnngfar 实现中每个 P 阶段都遵循此循环：

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    speckit 阶段 ↔ lnngfar P 阶段映射                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  /speckit.constitution   →  建立/更新项目宪法 (P1 时创建，后续复用)         │
│  /speckit.specify        →  编写当前 P 阶段的 spec 文档                     │
│  /speckit.clarify        →  澄清 spec 中的模糊点（可选）                    │
│  /speckit.plan           →  生成 tech-spec + data-model + api-design        │
│  /speckit.tasks          →  分解为原子 task，生成 task.md                   │
│  /speckit.implement      →  AI task-by-task 逐任务实现                       │
│  /speckit.checklist       →  生成质量检查清单（覆盖测试/安全/性能）          │
│  /speckit.analyze        →  代码审查 + 架构一致性分析                       │
│                                                                             │
│  + lnngfar verify         →  lint + unit + api + e2e (lnngfar 自举验证)    │
│  + 回归验证                →  重新运行 P1-P(N-1) 全部已有测试               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

# 二、总体原则

每个 P 阶段必须遵循：

- **Spec First**：先写 spec，再 plan，再 implement
- **Test First**：测试先行于实现代码
- **独立边界**：每个阶段独立 spec、独立测试、AI 可独立理解
- **Token 可控**：按模块拆分，只加载当前阶段相关上下文
- **回归验证**：每阶段结束时运行全部已有测试
- **Contracts**：阶段间明确定义 API 契约

---

# 三、Speckit 基础设施准备 (P0)

在开始 P1 之前，确保 speckit 环境可用：

```bash
# 1. 验证 speckit 命令可用
$ ls .codebuddy/commands/
speckit.constitution.md  speckit.clarify.md    speckit.plan.md
speckit.specify.md       speckit.tasks.md      speckit.implement.md
speckit.checklist.md     speckit.analyze.md
speckit.git.initialize.md  speckit.git.feature.md  speckit.git.commit.md

# 2. 初始化 speckit 目录结构
$ mkdir -p specs/ .lnngfar/ai/ .lnngfar/runtime/

# 3. 清理过多 auto-commit hook
# 编辑 .specify/extensions.yml，仅保留:
#   before_constitution: speckit.git.initialize
#   before_specify:     speckit.git.feature
#   其余 auto-commit 改为 optional: true 或删除
```

---

# P1 - Foundation：lnngfar 基础工程

## 目标

初始化 lnngfar 基础工程，建立 Monorepo 和开发工具链。

## Goals

- 初始化 pnpm Monorepo (`packages/` + `apps/`)
- 初始化 TypeScript 工程 (tsconfig + types)
- 初始化 Vitest 测试框架
- 初始化 ESLint + Prettier
- 初始化 Git Hooks (lint-staged)
- 初始化基础 CI (GitHub Actions)
- 初始化 speckit 目录 (`specs/`)

## Non Goals

- 不实现 AI Runtime
- 不实现 Stack System
- 不实现模板渲染
- 不实现 CLI 命令

## speckit 执行流程

```
/speckit.constitution  → 编写 lnngfar 项目宪法
/speckit.specify       → 编写 P1-foundation spec
/speckit.plan          → 生成 Monorepo 架构 plan
/speckit.tasks         → 分解为 task.md
/speckit.implement     → AI 逐任务实现
/speckit.checklist      → 质量检查清单
/speckit.analyze       → 代码审查
```

## 项目宪法 (constitution.md) 要点

```markdown
# lnngfar Constitution

## 代码规范
- 语言：TypeScript strict mode
- 格式：Prettier (2 spaces, single quote, semicolons)
- Lint：ESLint (recommended + typescript)
- 命名：camelCase 函数/变量, PascalCase 类/接口

## 架构约束
- Monorepo: pnpm workspace
- 包命名：@lnngfar/<package-name>
- 测试：Vitest, coverage ≥ 80%
- 构建：每个 package 独立 build

## 质量标准
- 每个 package 必须有单元测试
- PR 必须通过 lint + test + build
- 禁止 any 类型（仅测试文件允许）
```

## Core Modules

### workspace-manager
负责 workspace 管理。

### config-loader
负责配置读取 (`lnngfar.config.json`, `project.yml`)。

### logger
负责统一日志。

## APIs (阶段输出契约)

```ts
// @lnngfar/workspace-manager
export function loadWorkspace(path: string): Workspace
export function createProject(name: string, opts: CreateOptions): Project

// @lnngfar/config-loader
export function loadConfig(path: string): LnngfarConfig
export function validateConfig(config: unknown): config is LnngfarConfig

// @lnngfar/logger
export function createLogger(name: string): Logger
export interface Logger { info, warn, error, debug }
```

## Deliverables

```text
packages/
├── workspace-manager/     # @lnngfar/workspace-manager
├── config-loader/         # @lnngfar/config-loader
├── logger/                # @lnngfar/logger
└── types/                 # @lnngfar/types (共享类型)

specs/
├── p1-foundation/
│   ├── spec.md
│   ├── plan.md
│   └── tasks.md
└── p2-runtime/           # 下一阶段 spec 占位
```

## Tests

- workspace 创建/加载测试
- config 读取/校验测试
- logger 级别/格式化测试

## 回归验证

P1 是第一阶段，无前置阶段需要回归。

---

# P2 - Runtime Core：运行时核心

## 目标

构建 lnngfar Runtime Core，提供插件化运行时容器。

## Goals

- Runtime Container (boot/init/shutdown)
- Event Bus (发布/订阅)
- Context System (上下文管理)
- Module Loader (模块加载/卸载)
- Runtime 生命周期管理
- Configuration Runtime

## Non Goals

- 不实现 AI
- 不实现 Stack
- 不实现模板渲染

## speckit 执行流程

```
/speckit.specify   → P2-runtime spec
/speckit.clarify   → (可选) 澄清 Runtime 边界
/speckit.plan      → Runtime 架构 plan
/speckit.tasks     → 任务分解
/speckit.implement → 逐任务实现
/speckit.checklist  → 质量检查
/speckit.analyze   → 代码审查
```

## Core Modules

### runtime-container
Runtime 容器，管理模块注册和生命周期。

### event-bus
事件总线，支持模块间松耦合通信。

### module-loader
模块加载器，支持加载/卸载 Stack 和 Skill。

### context-runtime
上下文系统，管理项目全局上下文。

## Runtime Lifecycle

```text
boot → init → load-modules → ready → [running] → shutdown
```

## APIs (阶段输出契约)

```ts
// @lnngfar/runtime
export interface Runtime {
  boot(config: RuntimeConfig): Promise<void>
  registerModule(module: LnngfarModule): void
  unregisterModule(name: string): void
  emitEvent(event: string, data?: unknown): void
  onEvent(event: string, handler: EventHandler): void
  loadContext(name: string): Promise<Context>
  shutdown(): Promise<void>
}
```

## Tests

- runtime lifecycle (boot → ready → shutdown)
- event publish/subscribe
- module register/unregister
- context load/store

## 回归验证

```bash
lnngfar verify  # 重新运行 P1 全部测试
```

---

# P3 - CLI System：命令行系统

## 目标

构建 lnngfar CLI 系统，提供统一工程入口。

## Goals

- CLI framework (命令注册/路由)
- command system (命令生命周期)
- interactive prompts (交互式选择)
- terminal logger (彩色终端输出)
- command lifecycle (pre/post hooks)

## Commands (MVP)

P3 完成命令框架（registerCommand/runCommand/showPrompt），具体命令实现分散在后续阶段：

```bash
lnngfar init              # ✅ P3 实现
lnngfar stack add/remove  # 🔜 P4 实现 (P3 仅注册占位)
lnngfar spec parse        # 🔜 P6 实现 (P3 仅注册占位)
lnngfar ai                # 🔜 P8 实现 (P3 仅注册占位)
lnngfar verify            # 🔜 P10 实现 (P3 仅注册占位)
lnngfar deploy            # 🔜 P12 实现 (P3 仅注册占位)
```

> 未实现的命令在 P3 通过 stub 输出 `"lnngfar <command>: 将在 P{N} 阶段实现"`。

## speckit 执行流程

```
/speckit.specify   → P3-cli spec
/speckit.plan      → CLI 架构 plan
/speckit.tasks     → 任务分解
/speckit.implement → 逐命令实现
/speckit.checklist  → 质量检查
/speckit.analyze   → 代码审查
```

## Core Modules

### command-registry
命令注册中心。

### prompt-system
交互式提示。

### terminal-ui
终端 UI 渲染。

### command-runner
命令执行器。

## APIs

```ts
// @lnngfar/cli
export function registerCommand(name: string, cmd: Command): void
export function runCommand(argv: string[]): Promise<void>
export function showPrompt<T>(questions: Question[]): Promise<T>
```

## Tests

- 命令注册/路由测试
- 交互式 prompt 测试
- `lnngfar init` 端到端测试

## 回归验证

```bash
lnngfar verify  # P1 + P2 全部测试
```

---

# P4 - Stack System（含最小验证 Stack）

## 目标

构建 Stack 插件体系，同步开发 `far-web-java` 最小版用于验证。

## Goals

- Stack 标准定义
- Stack Loader (加载/解析 stack.yml)
- Stack Installer (install/uninstall)
- Stack Resolver (依赖解析)
- Stack Validator (合法性校验)
- **同步开发 far-web-java 最小版**（仅含项目脚手架模板）

## Non Goals

- 不实现完整的 far-web-java 所有模板
- 不实现 AI orchestration
- 不实现 Template 渲染

## 为什么 P4 要内嵌 P11a？

P4 Stack System 需要一个**真实的 Stack 来验证加载/安装/校验功能**。如果等到 P11 才开发官方 Stack，P4-P10 之间 Stack System 无法端到端验证。因此 P4 同步开发 `far-web-java@0.1` 最小版：

```text
far-web-java@0.1
├── stack.yml              # 最小配置
├── templates/project/     # 仅项目脚手架
│   ├── pnpm-workspace.yaml
│   ├── tsconfig.json
│   └── package.json
└── specs/
    └── stack.spec.md
```

## speckit 执行流程

P4 包含两个子模块，通过一个统一的 spec 文件描述，依次执行：

```
# 1. 编写合并 spec
/speckit.specify   → 编写 P4-stack-system spec (包含 Stack System + far-web-java@0.1 两个子模块)

# 2. 生成统一 plan
/speckit.plan      → 生成 plan，分两部分：
                      Part A: Stack Loader/Installer/Validator
                      Part B: far-web-java@0.1 最小 Stack

# 3. 任务分解 (先 A 后 B)
/speckit.tasks     → 任务分解：先完成 Stack System，再构建 far-web-java

# 4. 逐任务实现
/speckit.implement → 逐任务实现

# 5. 质量检查
/speckit.checklist  → 质量检查 (覆盖 Stack System + far-web-java 加载测试)

# 6. 代码审查
/speckit.analyze   → 代码审查
```

## Stack 目录结构

```text
far-web-java/
├── stack.yml
├── specs/
├── templates/
│   └── project/          # P4 最小版仅含项目脚手架
├── skills/
├── tests/
└── deploy/
```

## Core Modules

### stack-loader
Stack 加载和解析。

### stack-installer
Stack 安装/卸载。

### stack-validator
Stack 合法性校验。

### dependency-resolver
Stack 依赖解析。

## APIs

```ts
// @lnngfar/stack
export function installStack(name: string, source: string): Promise<void>
export function loadStack(name: string): Stack
export function validateStack(path: string): ValidationResult
export function resolveDependencies(stack: Stack): Stack[]
```

## Tests

- stack.yml 解析测试
- stack 安装/卸载测试
- stack 校验测试（非法配置拒绝）
- **far-web-java 加载集成测试**（验证真实 Stack 可被加载）

## 回归验证

```bash
lnngfar verify  # P1 + P2 + P3 全部测试
```

---

# P5 - Template Engine：模板引擎

## 目标

构建工业模板系统，支持 Handlebars 模板渲染。

## Goals

- Template Rendering (Handlebars/EJS)
- Template Variables (变量注入)
- Template Composition (模板组合)
- Stack Template Override (多层级覆盖)
- Shared Templates (公共模板)
- Industrial Templates (工业级模板)

## Non Goals

- 不实现 AI Runtime

## speckit 执行流程

```
/speckit.specify   → P5-template spec
/speckit.plan      → Template Engine 架构
/speckit.tasks     → 任务分解
/speckit.implement → 逐任务实现
/speckit.checklist  → 质量检查
/speckit.analyze   → 代码审查
```

## Template 层级 (优先级从高到低)

1. 项目级模板 (`templates/`)
2. 企业模板
3. Stack 模板 (`far-web-java/templates/`)
4. 共享模板 (`packages/templates/`)

## Core Modules

### template-loader
模板加载（按优先级查找）。

### template-renderer
模板渲染引擎。

### variable-engine
变量注入和默认值。

### composition-engine
模板组合与片段复用。

## APIs

```ts
// @lnngfar/template
export function renderTemplate(name: string, vars: Variables): string
export function loadTemplate(name: string, stack?: string): Template
export function composeTemplate(templates: Template[]): Template
```

## Tests

- 模板渲染测试
- 变量注入测试
- 多层级覆盖测试
- 模板组合测试

## 回归验证

```bash
lnngfar verify  # P1 + P2 + P3 + P4 全部测试
```

---

# P6 - Spec Engine：规范引擎

## 目标

构建 Spec Runtime，实现与 speckit 的双向同步。

## Goals

- Spec Parser (解析 specs/ 目录)
- Spec Indexing (索引和检索)
- Spec Context Loader (上下文加载)
- Spec Validation (规范校验)
- **Spec Sync** (代码 ↔ spec 双向同步)
- Spec Evolution (增量演化)

## speckit 执行流程

```
/speckit.specify   → P6-spec-engine spec
/speckit.plan      → Spec Engine 架构
/speckit.tasks     → 任务分解
/speckit.implement → 逐任务实现
/speckit.checklist  → 质量检查
/speckit.analyze   → 代码审查
```

## 与 speckit 的集成点

Spec Engine 不是替代 speckit，是**增强 speckit**：

| speckit 功能 | Spec Engine 增强 |
|-------------|------------------|
| `/speckit.specify` 生成 spec | Spec Parser 解析已有 spec 供 AI 使用 |
| 手动管理 spec 状态 | Spec Sync 自动更新 spec status |
| N/A | Spec Indexing 按模块索引 Token 优化 |
| N/A | Spec Evolution 增量演化 |

## Core Modules

### spec-parser
解析 `specs/product/*.md`。

### spec-indexer
按模块索引，支持按需加载。

### spec-loader
加载模块上下文供 AI Runtime 使用。

### spec-sync
代码修改后自动更新 spec status。

## APIs

```ts
// @lnngfar/spec
export function parseSpec(path: string): SpecDocument
export function indexSpecs(root: string): SpecIndex
export function loadSpecContext(module: string): SpecContext
export function syncSpecs(module: string): Promise<void>
```

## Tests

- spec 解析测试 (Markdown → SpecDocument)
- 索引与检索测试 (按模块查询)
- sync 测试 (代码变更 → spec 更新)

## 回归验证

```bash
lnngfar verify  # P1-P5 全部测试
```

---

# P7 - Skill Engine：技能引擎

## 目标

构建 Skill 系统，实现 AI 工程能力的模块化封装。

## Goals

- Skill Standard (skill.yaml 标准)
- Skill Loader (加载/校验)
- Skill Composition (技能组合)
- Skill Runtime (技能执行)
- Skill Registry (技能注册中心)

## Non Goals

- 不实现 AI Runtime orchestration (待 P8)

## speckit 执行流程

```
/speckit.specify   → P7-skill-engine spec
/speckit.plan      → Skill Engine 架构
/speckit.tasks     → 任务分解
/speckit.implement → 逐任务实现
/speckit.checklist  → 质量检查
/speckit.analyze   → 代码审查
```

## Skill Types

### coding skill
编码规范与最佳实践。

### testing skill
测试优先规则。

### deploy skill
部署规则。

### review skill
AI Code Review 规则。

## Core Modules

### skill-loader
Skill 加载和校验。

### skill-runner
Skill 执行。

### skill-registry
Skill 注册/查找。

## APIs

```ts
// @lnngfar/skill
export function loadSkill(name: string): Skill
export function loadSkillsFromStack(stack: Stack): Skill[]
export function runSkill(skill: Skill, context: SkillContext): Promise<SkillResult>
export function composeSkills(skills: Skill[]): ComposedSkill
```

## Tests

- skill.yaml 解析测试
- Skill 加载/执行测试
- Skill 组合测试

## 回归验证

```bash
lnngfar verify  # P1-P6 全部测试
```

---

# P8 - AI Runtime：AI 工程运行时

## 目标

构建 AI 工程运行时，实现 Prompt Orchestration + Token 优化。

## Goals

- **Prompt Orchestration** (system+specs+stack+skills 组合)
- **Context Strategy** (模块级上下文加载与裁剪)
- **Token Optimization** (按需加载，降低 Token)
- **Incremental Generation** (增量生成，不全量重写)
- **Intent Recognition** (识别新建/修改/优化意图)
- Spec-aware Generation (基于 spec 的代码生成)

## Non Goals

- 不实现 autonomous agents
- 不实现多 Agent 协作

## speckit 执行流程

```
/speckit.specify   → P8-ai-runtime spec
/speckit.plan      → AI Runtime 架构 + 数据流
/speckit.tasks     → 任务分解
/speckit.implement → 逐任务实现
/speckit.checklist  → 质量检查
/speckit.analyze   → 代码审查
```

## AI Workflow

```text
Intent Recognition (新建 vs 修改 vs 优化)
→ Context Collection (读取 specs/stack/skills)
→ Prompt Orchestration (组合 system+specs+skills)
→ Generation Pipeline
    ├─ Step 1: 生成测试
    ├─ Step 2: 生成代码
    └─ Step 3: 验证
→ Context Update (更新 specs + runtime state)
```

## Core Modules

### prompt-orchestrator
Prompt 编排（组合 system+specs+skills+templates）。

### context-loader
上下文加载（按模块裁剪）。

### generation-runtime
增量代码生成。

### token-optimizer
Token 预算控制与优化。

### intent-analyzer
意图识别（新建/修改/优化/重构）。

## APIs

```ts
// @lnngfar/ai-runtime
export function buildPrompt(task: AiTask): Prompt
export function loadContext(module: string): AiContext
export function generateIncrementalCode(task: AiTask): Promise<GenerationResult>
export function optimizeTokens(context: AiContext, budget: number): AiContext
export function analyzeIntent(input: string): Intent
export function handleGenerationFailure(error: GenerationError): Promise<void>
```

## Tests

- Prompt 编排测试 (验证输出的 Prompt 包含所有组件)
- Context 裁剪测试 (验证无关模块被跳过)
- Token 优化测试 (验证 Token 不超预算)
- 意图识别测试 (5 种 intent 准确率)
- 生成失败回滚测试 (3 次重试→回滚→记录错误)

## 回归验证

```bash
lnngfar verify  # P1-P7 全部测试
```

---

# P9 - Testing Runtime：测试优先体系

## 目标

构建测试优先体系，集成 Vitest 统一测试运行。

## Goals

- Test-first Workflow (spec→test→implement 流程)
- Unit Testing (Vitest 集成)
- API Testing (supertest 集成)
- E2E Testing (playwright 集成)
- Quality Gates (质量门禁)
- AI Regression Testing (AI 修改后的回归)

## Non Goals

- 不实现 cloud testing

## speckit 执行流程

```
/speckit.specify   → P9-testing spec
/speckit.plan      → Testing Runtime 架构
/speckit.tasks     → 任务分解
/speckit.implement → 逐任务实现
/speckit.checklist  → 质量检查
/speckit.analyze   → 代码审查
```

## 与 speckit 的关系

| speckit 阶段 | Testing Runtime 接管 |
|-------------|---------------------|
| `/speckit.checklist` | 质量门禁：覆盖率 ≥80% |
| `/speckit.analyze` | AI 回归测试：检查 AI 修改是否破坏现有功能 |
| N/A | `lnngfar verify` 命令统一入口 |

## Workflow

```text
spec → tests (先生成测试) → implementation (再生成代码) → verify (lint+unit+api+e2e)
```

## Core Modules

### test-runner
统一测试运行器（集成 Vitest）。

### quality-gate
质量门禁（lint + coverage + types）。

### regression-engine
AI 回归测试引擎。

## APIs

```ts
// @lnngfar/testing
export function runTests(pattern: string): Promise<TestResult>
export function runRegressionTests(): Promise<TestResult>
export function validateQuality(gates: QualityGate[]): Promise<QualityResult>
```

## Tests

- 测试运行器集成测试
- 质量门禁测试
- 回归测试引擎测试

## 回归验证

```bash
lnngfar verify  # P1-P8 全部测试
```

---

# P10 - Lifecycle Runtime：生命周期管理

## 目标

构建项目全生命周期管理：init → develop → verify → deploy → evolve。

## Goals

- init lifecycle (项目初始化)
- develop lifecycle (AI 增量开发)
- verify lifecycle (质量验证)
- deploy lifecycle (部署)
- evolve lifecycle (持续演化)
- **`lnngfar verify` 命令实现** (集成 P9 Testing Runtime)

## Non Goals

- 不实现 enterprise orchestration

## speckit 执行流程

```
/speckit.specify   → P10-lifecycle spec
/speckit.plan      → Lifecycle Runtime 架构
/speckit.tasks     → 任务分解
/speckit.implement → 逐任务实现
/speckit.checklist  → 质量检查
/speckit.analyze   → 代码审查
```

## Lifecycle 状态机

```text
init → develop ↕ verify → deploy → ops → evolve → back to develop
```

## Core Modules

### lifecycle-manager
生命周期管理器。

### workflow-engine
工作流引擎。

### project-state-manager
项目状态管理器 (`.lnngfar/runtime/state.yml`)。

## APIs

```ts
// @lnngfar/lifecycle
export function startLifecycle(phase: LifecyclePhase): Promise<void>
export function runWorkflow(name: string): Promise<WorkflowResult>
export function updateProjectState(state: Partial<ProjectState>): Promise<void>
export function getCurrentState(): ProjectState
```

## Tests

- 生命周期流转测试
- 工作流执行测试
- state.yml 读写测试

## 回归验证

```bash
lnngfar verify  # P1-P9 全部测试
```

---

# P11 - Official Stacks：官方 Stack 完整版

## 目标

在 P4 最小版基础上，完成两个官方 Stack 的完整模板和技能。

## Goals

- far-web-java 完整版（全部模板 + 技能）
- far-mini-uni 完整版（全部模板 + 技能）
- shared templates (CRUD/login/RBAC/upload)
- shared skills (coding/testing/security)

## Non Goals

- 不实现行业模板 (erp/ecommerce)
- 不实现企业定制

## speckit 执行流程

```
/speckit.specify   → P11-stacks spec
/speckit.plan      → Stack 完整版 plan
/speckit.tasks     → 任务分解
/speckit.implement → 逐任务实现
/speckit.checklist  → 质量检查
/speckit.analyze   → 代码审查
```

## far-web-java 完整版

```text
far-web-java/
├── stack.yml
├── templates/
│   ├── project/          # 项目脚手架 (P4 完成)
│   ├── module/           # 模块模板 (P11 新增)
│   │   ├── spring-rest/
│   │   ├── mybatis-crud/
│   │   └── jwt-auth/
│   └── frontend/         # 前端模板 (P11 新增)
│       ├── vue-admin/
│       ├── element-form/
│       └── auth-page/
├── skills/
│   ├── coding.yaml
│   ├── testing.yaml
│   └── security.yaml
├── specs/
├── tests/
└── deploy/
```

## far-mini-uni 完整版

```text
far-mini-uni/
├── stack.yml
├── templates/
│   ├── project/          # uni-app 脚手架
│   ├── page/
│   │   ├── uni-page/
│   │   ├── uni-request/
│   │   └── uni-store/
│   └── component/
│       └── mobile-layout/
├── skills/
├── specs/
└── tests/
```

## Tests

- `far-web-java` 项目脚手架生成测试
- `far-mini-uni` 项目脚手架生成测试
- CRUD 模板渲染测试
- 模板覆盖率测试

## 回归验证

```bash
lnngfar verify  # P1-P10 全部测试
lnngfar verify --e2e  # 端到端：用 lnngfar init + stack add 创建测试项目
```

---

# P12 - Deploy Runtime：部署运行时

## 目标

构建部署体系：Docker + CI/CD + Release。

## Goals

- Docker Deploy (Dockerfile 生成 + 镜像构建)
- CI/CD (GitHub Actions pipeline 生成)
- Environment Management (dev/staging/prod)
- Release Workflow (版本发布)

## Non Goals

- 不实现 Kubernetes orchestration

## speckit 执行流程

```
/speckit.specify   → P12-deploy spec
/speckit.plan      → Deploy Runtime 架构
/speckit.tasks     → 任务分解
/speckit.implement → 逐任务实现
/speckit.checklist  → 质量检查
/speckit.analyze   → 代码审查
```

## Core Modules

### deploy-runner
部署执行器。

### release-manager
版本发布管理。

### env-manager
环境配置管理。

## APIs

```ts
// @lnngfar/deploy
export function buildProject(targets: BuildTarget[]): Promise<BuildResult>
export function deployProject(env: string): Promise<DeployResult>
export function releaseProject(version: string): Promise<ReleaseResult>
```

## Tests

- Docker 镜像构建测试
- CI/CD pipeline 生成测试
- 多环境部署配置测试

## 回归验证

```bash
lnngfar verify  # P1-P11 全部测试
```

---

# P13 - Security Runtime：安全运行时

## 目标

构建安全体系：Key 管理 + 权限控制 + 沙箱。

## Goals

- API Key Security (加密存储+脱敏)
- Local Encryption (本地加密)
- Permission Control (权限隔离)
- Sandbox Runtime (AI 生成代码沙箱执行)
- Enterprise Security Gateway (企业模式)

## Non Goals

- 不实现 cloud IAM

## speckit 执行流程

```
/speckit.specify   → P13-security spec
/speckit.plan      → Security Runtime 架构
/speckit.tasks     → 任务分解
/speckit.implement → 逐任务实现
/speckit.checklist  → 质量检查
/speckit.analyze   → 代码审查
```

## Core Modules

### key-manager
API Key 管理（优先级查找链 + 加密）。

### permission-manager
项目级权限隔离。

### sandbox-runtime
AI 生成代码安全执行。

## APIs

```ts
// @lnngfar/security
export function storeKey(provider: string, key: string): Promise<void>
export function loadKey(provider: string): Promise<string | null>
export function checkPermission(project: string, action: string): boolean
export function runInSandbox(code: string): Promise<SandboxResult>
```

## Tests

- Key 加密/解密测试
- 权限检查测试
- 沙箱执行测试

## 回归验证

```bash
lnngfar verify  # P1-P12 全部测试
```

---

# P14 - IDE Integration：IDE 集成

## 目标

构建 VSCode/Cursor 扩展，提供 IDE 内 speckit 命令面板。

## Goals

- VSCode Extension (命令面板 + 侧边栏)
- Cursor Integration
- Terminal Integration
- Project Sync (IDE ↔ .lnngfar 状态同步)

## Non Goals

- 不实现 cloud IDE

## speckit 执行流程

```
/speckit.specify   → P14-ide spec
/speckit.plan      → IDE Integration 架构
/speckit.tasks     → 任务分解
/speckit.implement → 逐任务实现
/speckit.checklist  → 质量检查
/speckit.analyze   → 代码审查
```

## Core Modules

### vscode-extension
VSCode 扩展插件。

### editor-sync
IDE 项目状态同步。

### command-bridge
speckit 命令 ↔ IDE 命令面板桥接。

## APIs

```ts
// @lnngfar/ide
export function syncProject(path: string): Promise<void>
export function runEditorCommand(command: string): Promise<void>
export function getProjectStatus(): ProjectStatus
```

## Tests

- 扩展激活测试
- 命令面板注册测试
- 状态同步测试

## 回归验证

```bash
lnngfar verify  # P1-P13 全部测试
```

---

# P15 - Ecosystem Runtime：生态运行时

## 目标

构建 Stack/Template/Skill 市场和注册中心。

## Goals

- Stack Marketplace (发布/浏览/安装)
- Template Marketplace
- Skill Marketplace
- Enterprise Registry (企业私有注册中心)

## Non Goals

- 不实现社交平台

## speckit 执行流程

```
/speckit.specify   → P15-ecosystem spec
/speckit.plan      → Ecosystem 架构
/speckit.tasks     → 任务分解
/speckit.implement → 逐任务实现
/speckit.checklist  → 质量检查
/speckit.analyze   → 代码审查
```

## Core Modules

### marketplace-runtime
市场核心：包元数据管理。

### package-publisher
发布工具：校验 + 签名 + 上传。

### registry-sync
注册中心同步。

## Package 规范

每个 marketplace package 必须包含：

```text
far-xxx/
├── stack.yml          # 包元数据
├── package.json       # npm 兼容
├── CHANGELOG.md
├── LICENSE
└── ...
```

## APIs

```ts
// @lnngfar/ecosystem
export function publishStack(path: string): Promise<PublishResult>
export function installMarketplacePackage(name: string): Promise<void>
export function searchPackages(query: string): Promise<PackageInfo[]>
export function syncRegistry(registry: RegistryConfig): Promise<void>
```

## Tests

- 包发布/安装测试
- 注册中心同步测试
- 包版本管理测试

## 回归验证

```bash
lnngfar verify  # P1-P14 全部测试
```

## 端到端集成测试

P15 完成后，执行完整集成测试：

```bash
lnngfar init my-test-app
lnngfar stack add far-web-java
lnngfar spec parse specs/product/user.md
lnngfar ai "生成用户管理模块"
lnngfar verify
lnngfar deploy
```

---

# 四、最终 AI 开发工作流

每个 P 阶段执行：

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                      每个 P 阶段的 speckit 循环                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. /speckit.constitution   (P1 首次创建，后续复用)                          │
│  2. /speckit.specify        → 编写 specs/p{N}-{name}/spec.md               │
│  3. /speckit.clarify        → (可选) 澄清 spec 中的模糊点                   │
│  4. /speckit.plan           → 生成 tech-spec + data-model + api-design      │
│  5. /speckit.tasks          → 分解为 task.md 原子任务                       │
│  6. /speckit.implement      → AI task-by-task 逐任务实现                    │
│  7. /speckit.checklist       → 生成质量检查清单 (覆盖测试/安全/性能)         │
│  8. /speckit.analyze        → 代码审查 + 架构一致性分析                     │
│                                                                             │
│  [验收]                                                                     │
│  9. lnngfar verify           → lint + unit + api + e2e                     │
│  10. 回归验证                → 重新运行 P1-P(N-1) 全部已有测试              │
│  11. 更新 specs/             → 标记 status: done                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

最终形成：

```text
spec-driven (spec-kit)
+
test-first (Testing Runtime)
+
incremental-evolution (AI Runtime + Lifecycle)
=
lnngfar AI 工程系统
```

---

# 五、P 阶段依赖图

```text
P0 (Speckit Setup)
 │
 P1 (Foundation)
 │
 P2 (Runtime Core)
 │
 P3 (CLI System)
 │
 P4 (Stack System + far-web-java@0.1)  ← 同步开发最小版用于验证
 │
 ├── P5 (Template Engine)
 │    │
 │    ├── P6 (Spec Engine)
 │    │    │
 │    │    ├── P7 (Skill Engine)
 │    │    │    │
 │    │    │    P8 (AI Runtime)        ← 依赖 P6 Spec + P7 Skill
 │    │    │    │
 │    │    │    P9 (Testing Runtime)
 │    │    │    │
 │    │    │    P10 (Lifecycle)
 │    │    │    │
 │    │    │    ├── P11 (Official Stacks)  ← 依赖 P4 最小版 + P5 模板
 │    │    │    │
 │    │    │    ├── P12 (Deploy)         ← 提前到 IDE 之前
 │    │    │    │
 │    │    │    ├── P13 (Security)
 │    │    │    │
 │    │    │    ├── P14 (IDE)
 │    │    │    │
 │    │    │    P15 (Ecosystem)
```

---

# 六、Hook 优化建议

当前 `.specify/extensions.yml` 配置建议优化：

```yaml
# 建议保留的 hook（需要时启用）
before_constitution:
  - extension: git
    command: speckit.git.initialize
    enabled: true
    optional: false

before_specify:
  - extension: git
    command: speckit.git.feature
    enabled: true
    optional: false

# 建议添加的 lnngfar 专用 hook (手动实现)
after_implement:
  - extension: lnngfar
    command: lnngfar.update-specs      # 代码生成后更新 spec 状态
    enabled: true
    optional: true

after_verify:
  - extension: lnngfar
    command: lnngfar.update-state      # 验证后更新 runtime state
    enabled: true
    optional: true

# 其余 auto-commit hook 建议删除或改为 enabled: false
# before_clarify/before_plan/before_tasks/before_implement
# → 改为通过 Git 命令行手动 commit
```
