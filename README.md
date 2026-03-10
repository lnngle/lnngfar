# lnngfar

lnngfar 是一个 Blueprint 驱动的代码生成器内核。

## 当前状态

- 已内置 `lnngfar-blueprint-cocos`，可生成完整小游戏项目骨架。
- 生成流程固定为：环境校验 -> Blueprint 发现加载 -> Blueprint 校验 -> 生成执行 -> 测试执行。

## 核心边界

- 核心只负责：CLI 调度、Blueprint 发现、Blueprint 校验、Blueprint 执行。
- 技术栈能力由 Blueprint 提供，不内置在核心。
- 默认输出目录是当前工作目录下的“项目名子目录”，存在冲突文件或目录时直接失败。
- 执行生成命令时会有英文交互输入项目名；直接回车使用默认值。

## 环境要求

- Node.js >= 18 LTS
- npm >= 9

## 安装与命令可用性

### 方式 A：仓库开发态（推荐）

执行 `npm install` 后会自动构建 CLI。为避免与仓库文件冲突，请在目标空目录执行，并通过 `--prefix` 指向仓库：

```powershell
# 在 lnngfar 仓库根目录
npm install

# 切换到目标空目录（示例）
mkdir ..\demo-cocos-game
cd ..\demo-cocos-game

npx --prefix ..\lnngfar --no-install lnngfar cocos
# 或
npm exec --prefix ..\lnngfar -- lnngfar cocos

# 顶级覆盖参数：关闭 AI skills 目录
npx --prefix ..\lnngfar --no-install lnngfar cocos --ai-skills no
```

命令执行时会出现英文交互提示，例如：

```text
Enter project name (default: cocos-project):
```

默认项目名规则：`<blueprint后缀>-project`。
例如 `lnngfar-blueprint-cocos` 的后缀为 `cocos`，默认项目名即 `cocos-project`。

### 方式 B：全局命令态

如果希望直接输入 `lnngfar cocos`，请先进行全局 link：

```powershell
npm install
npm run setup:link
lnngfar cocos
```

取消全局 link：

```powershell
npm run setup:unlink
```

## 快速开始（生成完整小游戏项目）

请在一个空目录中执行，避免冲突检测失败。

```powershell
# 在 lnngfar 仓库根目录
npm install

# 切换到目标空目录（示例）
mkdir ..\demo-cocos-game
cd ..\demo-cocos-game

# 使用仓库开发态命令
npx --prefix ..\lnngfar --no-install lnngfar cocos
```

可选参数：

- `--ai-skills yes|no`：lnngfar 顶级覆盖参数。默认值为 `no`（即不传时按 Blueprint 规范生成，默认会有 `ai/` 目录）；传 `--ai-skills no` 可关闭 `ai/` 目录生成。

若直接回车不输入，默认使用 `cocos-project` 作为项目名。

最终生成目录示例：`<当前目录>/cocos-project`。

生成后将包含完整小游戏骨架，例如：

- `package.json`（包含 `creator.version`）
- `settings/v2/packages/project.json`
- `settings/v2/packages/program.json`
- `settings/v2/packages/builder.json`
- `assets/main.scene`
- `assets/script/Main.ts`
- `ai/skills`（多 AI Code 通用技能与策略模板，默认生成）

## 运行与验证

```powershell
npm run lint
npm test
npm run build
```

常用测试命令：

- `npm run test`：运行 unit + integration 基础测试集。
- `npm run test:coverage`：运行 unit/integration/contract 与 generator 测试并统计 `src/**` 覆盖率（门禁为 100%）。
- `npm run test:unit`：仅运行单元测试目录 `tests/unit`。
- `npm run test:integration`：运行集成与契约测试及 blueprint 生成器测试。
- `npm run test:e2e`：运行端到端测试目录 `tests/e2e`。
- `npm run test:template-tools`：运行 `lnngfar-blueprint-cocos/templates` 内工具测试。
- `npm run test:perf`：运行性能基准测试目录 `tests/performance`。
- `npm run test:all`：按顺序运行 `test` + `test:e2e` + `test:template-tools`。

## 测试用例说明（全量）

### 运行入口与分层

| 命令 | 覆盖范围 | 说明 |
| --- | --- | --- |
| `npm run test:unit` | `tests/unit/**/*.test.ts` | 核心模块单元行为与分支覆盖 |
| `npm run test:integration` | `tests/integration/**/*.test.ts` + `tests/contract/**/*.test.ts` + `blueprints/lnngfar-blueprint-cocos/tests/generator.spec.ts` | 集成链路、契约约束与蓝图生成器 |
| `npm run test:e2e` | `tests/e2e/**/*.test.ts` | 端到端首跑路径 |
| `npm run test:template-tools` | `blueprints/lnngfar-blueprint-cocos/templates/tests/tools/checkers.test.js` | 模板内工具脚本门禁 |
| `npm run test:perf` | `tests/performance/**/*.test.ts` | 性能基准与耗时观测 |
| `npm run test:coverage` | unit + integration + contract + generator | 覆盖率门禁（`src/**` 100%） |
| `npm run test:all` | `test` + `test:e2e` + `test:template-tools` | 日常全量质量回归 |

### Unit 用例（`tests/unit`）

| 文件 | 验证目标 |
| --- | --- |
| `tests/unit/blueprint-test-runner.test.ts` | Blueprint 测试文件收集、执行入口与失败输出行为 |
| `tests/unit/conflict-detector.test.ts` | 输出目录冲突检测规则 |
| `tests/unit/discovery-mapper.test.ts` | Blueprint 包名与逻辑名映射规则 |
| `tests/unit/env-check.test.ts` | Node 版本环境校验逻辑 |
| `tests/unit/execution-extra.test.ts` | 执行层补充分支（runner fallback、writer 边界等） |
| `tests/unit/generate-from-blueprint.test.ts` | 生成主流程编排、错误分支与性能参数解析 |
| `tests/unit/interaction-messages.test.ts` | CLI 交互文案与 locale 分支 |
| `tests/unit/local-blueprint-resolver.test.ts` | 内置/依赖 Blueprint 发现与解析优先级 |
| `tests/unit/pipeline.test.ts` | Pipeline 主流程阶段编排与异常转换 |
| `tests/unit/project-name-resolve.test.ts` | 交互输入下项目名解析与回退策略 |
| `tests/unit/project-name.test.ts` | 项目名格式校验规则 |
| `tests/unit/rendering-engine.test.ts` | 渲染器（模板替换、JSON patch）核心行为 |
| `tests/unit/rendering-validation-extra.test.ts` | 渲染配置加载与 Blueprint 校验补充分支 |
| `tests/unit/transactional-writer.test.ts` | 事务写入覆盖与原子替换行为 |
| `tests/unit/variable-resolver.test.ts` | 内置变量解析与环境变量注入策略 |

### Contract 用例（`tests/contract`）

| 文件 | 验证目标 |
| --- | --- |
| `tests/contract/cli-bin-entry.contract.test.ts` | `bin/lnngfar.js` 可直接执行并进入流水线 |
| `tests/contract/cli-cocos-success.contract.test.ts` | `cocos` Blueprint 最小成功契约产物 |
| `tests/contract/cli-external-cwd.contract.test.ts` | 仓库外目录执行 CLI 的发现与生成契约 |
| `tests/contract/local-discovery.contract.test.ts` | 本地内置 Blueprint 发现契约 |
| `tests/contract/prefix-validation.contract.test.ts` | Blueprint 包名前缀约束契约 |

### Integration 用例（`tests/integration`）

| 文件 | 验证目标 |
| --- | --- |
| `tests/integration/blueprint-upgrade-compat.int.test.ts` | Manifest 版本升级兼容性 |
| `tests/integration/cocos-generated-project-tests.int.test.ts` | 生成项目关键配置与资源完整性 |
| `tests/integration/cocos-minigame-template.int.test.ts` | 小游戏模板关键骨架文件存在性 |
| `tests/integration/cocos-template-parity.int.test.ts` | 生成结果与模板目录的文件集合/内容一致性 |
| `tests/integration/default-output-cwd.int.test.ts` | 默认输出目录规则（当前目录下项目子目录） |
| `tests/integration/deterministic-generation.int.test.ts` | 相同输入下输出确定性 |
| `tests/integration/error-stage-blueprint.int.test.ts` | Blueprint 阶段错误归类 |
| `tests/integration/error-stage-environment.int.test.ts` | 环境阶段错误归类 |
| `tests/integration/error-stage-testing.int.test.ts` | Blueprint 测试失败阶段归类 |
| `tests/integration/generation-conflict.int.test.ts` | 生成冲突路径阶段归类 |
| `tests/integration/manifest-validation.int.test.ts` | Manifest 缺字段时整体校验失败 |
| `tests/integration/third-party-extension.int.test.ts` | `node_modules` 第三方 Blueprint 发现链路 |

### E2E 用例（`tests/e2e`）

| 文件 | 验证目标 |
| --- | --- |
| `tests/e2e/first-run-success.e2e.test.ts` | 空目录首跑 CLI 成功生成项目 |

### Performance 用例（`tests/performance`）

| 文件 | 验证目标 |
| --- | --- |
| `tests/performance/cli-cocos-benchmark.perf.test.ts` | 完整生成链路耗时基准 |
| `tests/performance/rendering-large-template.perf.test.ts` | 大规模模板渲染计划与渲染耗时基准 |

### Blueprint 测试用例

| 文件 | 验证目标 |
| --- | --- |
| `blueprints/lnngfar-blueprint-cocos/tests/generator.spec.ts` | 生成器产物集合、二进制编码与占位变量行为 |
| `blueprints/lnngfar-blueprint-cocos/templates/tests/tools/checkers.test.js` | 模板内检查脚本、fixtures 与全链路门禁脚本 |

## 内置 Blueprint

- `lnngfar-blueprint-cocos`

## Blueprint 开发规范

以下内容由 `docs/blueprint-authoring.md` 合并而来。

### 命名规则

- npm 包名必须以 `lnngfar-blueprint-` 开头。
- 逻辑名称为前缀后缀部分，例如 `lnngfar-blueprint-cocos` 的逻辑名称是 `cocos`。

### 最小结构

每个 Blueprint 必须包含：

- `blueprint.json`
- `templates/`
- `generators/`
- `tests/`
- `README.md`

### blueprint.json 必需字段

- `name`
- `packageName`
- `version`
- `description`
- `target`
- `language`
- `engine`
- `testFramework`

### 生成器约定

- 生成器返回 `{ path, content }` 列表。
- 路径应为相对路径，内容应为确定性文本。
- 不得在生成器中引入随机值。

### 生成器入口约定

- 运行时入口以 `blueprint.json.generatorEntry` 为唯一来源。
- 每个 Blueprint 建议只保留一个运行时入口文件（推荐 `generators/index.js`）。
- 不建议同时维护同名双入口（如 `generators/index.js` 与 `generators/index.ts`），避免实现漂移。
- 如需类型声明，建议使用 `*.d.ts` 或独立类型文件，不与运行时入口同名。

### 第三方 Blueprint 接入

- 依赖接入：在项目根目录安装第三方包，例如 `npm install -D lnngfar-blueprint-xxx`。
- 命名约束：包名必须满足 `lnngfar-blueprint-<name>`。
- 发现机制：运行时会合并发现内置目录 `blueprints/` 与已安装依赖中的 Blueprint。
- 执行方式：安装后可直接执行 `lnngfar <name>`，其中 `<name>` 为包名前缀后缀部分。

## 生成架构说明

以下内容由 `docs/generation-architecture-refactor.md` 合并而来。

### 背景与目标

本次重构直接在当前项目结构下完成，目标是把生成能力从“蓝图内部散落实现”提升为“核心统一编排”，并保持现有蓝图兼容。

核心目标：

- 建立统一的变量解析机制，减少蓝图重复实现。
- 建立渲染计划（IR）与可插拔渲染执行链路。
- 建立事务式写入，避免部分写入导致的中间态。
- 保持现有 `lnngfar-blueprint-cocos` 可运行，并逐步收敛到通用框架。

### 架构概览

生成阶段由以下链路组成：

1. 变量解析：`resolveVariables`
2. 渲染配置加载：`loadRenderConfig`
3. 渲染计划构建：`buildRenderPlan`
4. 渲染计划执行：`renderPlan`
5. 冲突检测：`detectPathConflicts`
6. 事务写入：`writeArtifactsTransactionally`

对应主要文件：

- `src/execution/variables/variable-resolver.ts`
- `src/execution/rendering/render-config-loader.ts`
- `src/execution/rendering/render-plan-builder.ts`
- `src/execution/rendering/plan-renderer.ts`
- `src/execution/rendering/template-renderer.ts`
- `src/execution/rendering/json-patch-renderer.ts`
- `src/execution/transactional-writer.ts`
- `src/execution/generate-from-blueprint.ts`

### 模块设计

#### 1) 变量解析模块

文件：`src/execution/variables/variable-resolver.ts`

职责：

- 生成标准变量上下文，当前内置：`PROJECT_NAME`、`PROJECT_DESCRIPTION`、`BLUEPRINT_NAME`、`BLUEPRINT_PACKAGE_NAME`、`CREATOR_VERSION`（仅当环境变量存在时注入）。

设计点：

- 把变量定义从蓝图生成器中抽离，便于统一校验与复用。
- 避免强制覆盖 `CREATOR_VERSION`，保障蓝图可保留自身版本策略。

#### 2) 渲染配置加载模块

文件：`src/execution/rendering/render-config-loader.ts`

职责：

- 读取蓝图根目录渲染配置文件（默认 `render.config.json`）。
- 合并默认渲染规则与蓝图自定义规则。

默认规则：

- `templatePatterns`: `**/*`
- `jsonPatch`：
- `package.json` -> `name/description`
- `package-lock.json` -> 根 `name` 与 `packages[""].name`

扩展点：

- `blueprint.json` 新增可选字段 `renderConfigEntry`，可指定配置入口文件。

#### 3) 渲染计划构建模块

文件：`src/execution/rendering/render-plan-builder.ts`

职责：

- 把原始 artifacts 转换为计划化结构（RenderPlan）。
- 为每个产物分配渲染模式：`template`、`json-patch`、`passthrough`。
- 二进制文件自动透传。

设计点：

- 先计划再执行，便于后续加入审计、dry-run、可视化 diff。

#### 4) 渲染执行模块

文件：

- `src/execution/rendering/template-renderer.ts`
- `src/execution/rendering/json-patch-renderer.ts`
- `src/execution/rendering/plan-renderer.ts`

职责：

- 模板渲染：`{{VAR}}` 替换。
- JSON Patch：按 JSONPath 把变量值写入结构化字段。
- 统一输出 `GeneratedArtifact[]`。

设计点：

- JSON 渲染使用结构化设置，避免文本替换误伤。
- 支持空字符串键路径（如 `$.packages."".name`）。

#### 5) 事务写入模块

文件：`src/execution/transactional-writer.ts`

职责：

- 先写入临时目录，再原子迁移到目标目录。
- 失败时清理临时目录，避免输出目录脏状态。

设计点：

- 与冲突检测配合，减少“部分写入”风险。

#### 6) 生成入口整合

文件：`src/execution/generate-from-blueprint.ts`

职责：

- 加载 generator 并执行，获取原始 artifacts。
- 串联变量解析、渲染配置、计划构建、计划执行、冲突检测、事务写入。
- 对外维持原有错误模型与返回结构。

性能增强：

- 分批渲染 + 分批写入，降低大规模模板生成时峰值内存占用。
- 写入阶段支持并发，提升大量小文件场景的 I/O 吞吐。
- 支持性能 trace 日志，便于定位计划构建、渲染、写入各阶段耗时。

性能调优环境变量：

- `LNNGFAR_RENDER_BATCH_SIZE`：每批渲染与写入的文件数，默认 `500`。
- `LNNGFAR_WRITE_CONCURRENCY`：写入并发度，默认 `8`。
- `LNNGFAR_TRACE_PERF=1`：启用性能阶段日志。

### 蓝图侧改造

#### 1) 渲染配置落地

新增文件：`blueprints/lnngfar-blueprint-cocos/render.config.json`

作用：

- 显式声明该蓝图的模板透传与 JSON 字段补丁规则。

#### 2) 模板占位符标准化

更新文件：

- `blueprints/lnngfar-blueprint-cocos/templates/package.json`
- `blueprints/lnngfar-blueprint-cocos/templates/package-lock.json`

变化：

- 使用 `{{PROJECT_NAME}}` / `{{PROJECT_DESCRIPTION}}` 占位符。
- 由核心渲染器统一替换。

#### 3) 蓝图生成器收敛

文件：`blueprints/lnngfar-blueprint-cocos/generators/index.js`

变化：

- 继续保留 Creator 版本探测能力。
- 移除专有 `package-lock` 强绑定补丁逻辑，减少与核心渲染框架重复。

### 契约更新

更新内容：

- `src/core/contracts/blueprint-contract.ts` 增加 `renderConfigEntry` 可选字段。
- `src/validation/manifest-validator.ts` 增加 `renderConfigEntry` 校验。
- `specs/002-lnngfar-v1-core/contracts/blueprint.schema.json` 增加 `generatorEntry`、`renderConfigEntry` 可选字段。

### 回归验证

本次重构后，已通过覆盖主链路的测试集，包括：

- 单元：变量解析、渲染引擎、事务写入、项目名规则。
- 契约：CLI 成功路径、外部 cwd、bin 入口。
- 集成：默认输出、冲突、确定性、模板一致性、cocos 关键骨架。
- 蓝图生成器：`lnngfar-blueprint-cocos/tests/generator.spec.ts`。

性能测试：

- 新增 `tests/performance/rendering-large-template.perf.test.ts` 基准测试样例。
- 可通过 `npm run test:perf` 执行性能基准测试（默认不纳入 `test:all`）。

### 已知边界与后续建议

已完成：

- 变量解析、渲染计划、渲染执行、事务写入全链路落地。
- 蓝图可通过 `render.config.json` 扩展替换规则。

后续建议：

1. 增加 `--plan` / `--dry-run` 输出渲染计划，提升可观测性。
2. 扩展渲染器到 YAML/TS AST，提升结构化修改能力。
3. 增加变量 schema 文件与交互提示 schema，形成完整声明式输入契约。
4. 引入策略引擎（命名、目录边界、依赖边界）统一前后置校验。

## 常见问题

### 1) 执行 `lnngfar` 提示找不到命令

- 原因：当前 shell 未安装全局 link。
- 处理：优先用 `npx --no-install lnngfar cocos`，或执行 `npm run setup:link` 后再用 `lnngfar cocos`。

### 2) 执行 `lnngfar cocos` 报目录冲突

- 原因：目标目录已存在同名文件或目录。
- 处理：切换到空目录执行，或清理冲突文件后重试。

### 3) 交互输入项目名时输错格式

- 原因：项目名仅允许字母、数字、`-`、`_`。
- 处理：按提示重新输入；若多次输入非法，将自动回退默认项目名。

### 4) 导入 Cocos Creator Dashboard 提示“缺失编辑器”

- 原因：本机未安装模板指定的 Creator 版本，或 `package.json` 中 `creator.version` 与本机版本不一致。
- 处理：安装匹配版本，或将 `package.json` 的 `creator.version` 修改为本机已安装版本后重新导入。
- 可选：生成前设置环境变量 `LNNGFAR_COCOS_CREATOR_VERSION=3.x.y`，让模板按指定版本生成。

### 5) 初次执行较慢

- 原因：首次安装后会自动构建 TypeScript 产物。
- 处理：属于预期行为，后续重复执行会更快。

## 开发命令

```powershell
npm run lint
npm test
npm run build
```
