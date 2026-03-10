# lnngfar-blueprint-cocos

## Blueprint 概览

`lnngfar-blueprint-cocos` 用于生成可直接导入 Cocos Creator 3.8 的小游戏工程。

该 Blueprint 面向“可持续工程化迭代”的项目，内置分阶段门禁、插件锁定、架构边界约束与多 AI 开发工作台。

## 市场展示信息

| 字段 | 值 |
| --- | --- |
| Blueprint 名称 | `cocos` |
| 包名 | `lnngfar-blueprint-cocos` |
| 目标引擎 | Cocos Creator 3.8.x |
| 语言 | TypeScript |
| 默认产物特性 | 资源骨架 + 业务脚本 + 工具链 + `ai/` 目录 |

## 核心特性

- 可直接导入 Dashboard 的 Creator 工程骨架。
- `tools/run-tests.js` 聚合质量门禁（配置、资源、架构、构建、热更新、启动、风格）。
- `extensions.lock.json` 锁定插件提交，保障可复现。
- 默认生成 `ai/` 目录，提供多 AI Code 协作技能模板。

## 生成产物（摘要）

- 工程元数据：`package.json`（含 `creator.version`）、`settings/v2/packages/*.json`
- 核心资源：`assets/main.scene`、`assets/bundle/*`、`assets/resources/config.json`
- 业务脚本：`assets/script/Main.ts`、`assets/script/game/*`
- 工程工具：`tools/*`、`tests/tools/*`
- AI 工作台：`ai/context`、`ai/policies`、`ai/skills`、`ai/templates`

## AI 目录规范

`ai/` 是 Blueprint 规范产物之一：

- 默认生成（按 Blueprint 规范）。
- 可通过 lnngfar 顶级参数关闭：`--ai-skills no`。
- 该参数是 lnngfar 统一能力，不是单 Blueprint 私有参数。

## 生成器入口

- 运行时入口：`generators/index.js`
- `blueprint.json.generatorEntry` 固定指向该文件
- 不维护同名双入口（如 `index.ts`）以避免实现漂移

## 适用场景

- 从 0 到 1 新建 Cocos 小游戏项目。
- 需要插件锁定与可复现环境的团队协作项目。
- 需要多 AI 工具协同开发并统一约束的项目。
