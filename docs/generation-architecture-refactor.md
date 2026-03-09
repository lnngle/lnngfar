# lnngfar 生成架构重构设计说明

## 背景与目标
本次重构直接在当前项目结构下完成，目标是把生成能力从“蓝图内部散落实现”提升为“核心统一编排”，并保持现有蓝图兼容。

核心目标：
- 建立统一的变量解析机制，减少蓝图重复实现。
- 建立渲染计划（IR）与可插拔渲染执行链路。
- 建立事务式写入，避免部分写入导致的中间态。
- 保持现有 `lnngfar-blueprint-cocos` 可运行，并逐步收敛到通用框架。

## 架构概览
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

## 模块设计

### 1) 变量解析模块
文件：`src/execution/variables/variable-resolver.ts`

职责：
- 生成标准变量上下文，当前内置：
  - `PROJECT_NAME`
  - `PROJECT_DESCRIPTION`
  - `BLUEPRINT_NAME`
  - `BLUEPRINT_PACKAGE_NAME`
  - `CREATOR_VERSION`（仅当环境变量存在时注入）

设计点：
- 把变量定义从蓝图生成器中抽离，便于统一校验与复用。
- 避免强制覆盖 `CREATOR_VERSION`，保障蓝图可保留自身版本策略。

### 2) 渲染配置加载模块
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

### 3) 渲染计划构建模块
文件：`src/execution/rendering/render-plan-builder.ts`

职责：
- 把原始 artifacts 转换为计划化结构（RenderPlan）。
- 为每个产物分配渲染模式：
  - `template`
  - `json-patch`
  - `passthrough`
- 二进制文件自动透传。

设计点：
- 先计划再执行，便于后续加入审计、dry-run、可视化 diff。

### 4) 渲染执行模块
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

### 5) 事务写入模块
文件：`src/execution/transactional-writer.ts`

职责：
- 先写入临时目录，再原子迁移到目标目录。
- 失败时清理临时目录，避免输出目录脏状态。

设计点：
- 与冲突检测配合，减少“部分写入”风险。

### 6) 生成入口整合
文件：`src/execution/generate-from-blueprint.ts`

职责：
- 加载 generator 并执行，获取原始 artifacts。
- 串联变量解析、渲染配置、计划构建、计划执行、冲突检测、事务写入。
- 对外维持原有错误模型与返回结构。

## 蓝图侧改造

### 1) 渲染配置落地
新增文件：`blueprints/lnngfar-blueprint-cocos/render.config.json`

作用：
- 显式声明该蓝图的模板透传与 JSON 字段补丁规则。

### 2) 模板占位符标准化
更新文件：
- `blueprints/lnngfar-blueprint-cocos/templates/package.json`
- `blueprints/lnngfar-blueprint-cocos/templates/package-lock.json`

变化：
- 使用 `{{PROJECT_NAME}}` / `{{PROJECT_DESCRIPTION}}` 占位符。
- 由核心渲染器统一替换。

### 3) 蓝图生成器收敛
文件：`blueprints/lnngfar-blueprint-cocos/generators/index.js`

变化：
- 继续保留 Creator 版本探测能力。
- 移除专有 `package-lock` 强绑定补丁逻辑，减少与核心渲染框架重复。

## 契约更新

更新内容：
- `src/core/contracts/blueprint-contract.ts`
  - `BlueprintManifest` 增加可选字段：`renderConfigEntry`
- `src/validation/manifest-validator.ts`
  - 增加 `renderConfigEntry` 校验
- `specs/002-lnngfar-v1-core/contracts/blueprint.schema.json`
  - 增加 `generatorEntry`、`renderConfigEntry` 可选字段

## 回归验证
本次重构后，已通过覆盖主链路的测试集，包括：
- 单元：变量解析、渲染引擎、事务写入、项目名规则
- 契约：CLI 成功路径、外部 cwd、bin 入口
- 集成：默认输出、冲突、确定性、模板一致性、cocos 关键骨架
- 蓝图生成器：`lnngfar-blueprint-cocos/tests/generator.spec.ts`

## 已知边界与后续建议

已完成：
- 变量解析、渲染计划、渲染执行、事务写入全链路落地。
- 蓝图可通过 `render.config.json` 扩展替换规则。

后续建议：
1. 增加 `--plan` / `--dry-run` 输出渲染计划，提升可观测性。
2. 扩展渲染器到 YAML/TS AST，提升结构化修改能力。
3. 增加变量 schema 文件与交互提示 schema，形成完整声明式输入契约。
4. 引入策略引擎（命名、目录边界、依赖边界）统一前后置校验。
