# 实施计划：lnngfar v1 Blueprint 驱动内核与 cocos Blueprint 交付

**分支**: `002-lnngfar-v1-core` | **日期**: 2026-03-05 | **规格**: `D:\github\lnngfar\specs\002-lnngfar-v1-core\spec.md`
**输入**: 来自 `D:\github\lnngfar\specs\002-lnngfar-v1-core\spec.md` 的功能规格

## 摘要

交付一个 Node.js CLI 生成器内核，严格遵循“环境校验 → Blueprint 发现加载 → Blueprint 校验 → 生成执行 → 测试执行 → 结果输出”的固定流程，内置 `lnngfar-blueprint-cocos` 作为首个可运行 Blueprint，保证确定性生成、失败可观测、测试门禁与第三方可扩展能力。

## 技术上下文

**语言/版本**: TypeScript 5.x（运行时 Node.js `>=18 LTS`）  
**主要依赖**: `commander`（CLI）、`ajv`（blueprint.json 校验）、`fs-extra`（文件操作）、`jest`（自动化测试）  
**存储**: N/A（文件系统输出）  
**测试方案**: `jest`（核心单元/集成测试 + Blueprint 自身测试）  
**目标平台**: Windows/macOS/Linux 命令行环境  
**项目类型**: CLI + Blueprint 插件包  
**性能目标**: `lnngfar cocos` 在标准开发机 95% 场景下 2 分钟内完成  
**约束条件**: 本地依赖发现、冲突即失败、禁止随机生成、中文文档与交互  
**规模/范围**: v1 核心 + 1 个内置 Blueprint（`lnngfar-blueprint-cocos`）

### Tooling Compatibility Fields

**Language/Version**: TypeScript 5.x on Node.js >=18 LTS  
**Primary Dependencies**: commander, ajv, fs-extra, jest  
**Storage**: N/A  
**Project Type**: cli tool + blueprint packages

## 宪章检查（设计前）

*门禁：必须在第 0 阶段调研前通过；并在第 1 阶段设计后重新检查。*

- [x] 核心仅承担调度/发现/校验/执行职责，技术栈能力由 Blueprint 承担（满足原则 I）
- [x] 生成策略确定且可复现，目录冲突策略为“严格失败退出”（满足原则 II）
- [x] 已定义核心测试、Blueprint 测试与失败即中断规则（满足原则 III）
- [x] 错误阶段固定为环境/Blueprint/生成/测试，禁止静默失败（满足原则 IV）
- [x] 新增 Blueprint 不要求修改核心代码（满足原则 I、V）
- [x] 文档、交互、注释遵循中文约束（满足技术与交付约束）

**门禁结论**: PASS

## Phase 0：梳理与调研

1. 解析技术决策点（发现范围、冲突策略、测试边界、确定性策略）。
2. 对关键依赖形成选型结论（CLI 框架、JSON Schema 校验、测试框架）。
3. 输出 `research.md`，记录决策、理由、备选方案。

## Phase 1：设计与契约

1. 从规格抽取实体与状态流，输出 `data-model.md`。
2. 定义外部接口契约：
   - CLI 行为契约：`contracts/cli-contract.md`
   - Blueprint 元信息契约：`contracts/blueprint.schema.json`
3. 形成可执行验证路径，输出 `quickstart.md`。
4. 执行 agent 上下文更新脚本：`D:\github\lnngfar\.specify\scripts\powershell\update-agent-context.ps1 -AgentType copilot`。

## 宪章检查（设计后复核）

- [x] 设计中未引入核心内置技术栈生成逻辑（Blueprint 一等公民）
- [x] 数据模型与契约显式约束确定性与失败路径
- [x] quickstart 覆盖测试门禁与失败场景验证
- [x] 合同与模型支持第三方 Blueprint 独立接入
- [x] 未新增违反中文约束或不必要复杂抽象

**复核结论**: PASS

## 项目结构

### 文档（当前功能）

```text
D:/github/lnngfar/specs/002-lnngfar-v1-core/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── cli-contract.md
│   └── blueprint.schema.json
└── tasks.md（待 /speckit.tasks 生成）
```

### 源代码（仓库根目录）

```text
D:/github/lnngfar/
├── src/
│   ├── cli/
│   ├── core/
│   ├── discovery/
│   ├── validation/
│   ├── execution/
│   └── errors/
├── blueprints/
│   └── lnngfar-blueprint-cocos/
│       ├── blueprint.json
│       ├── templates/
│       ├── generators/
│       ├── tests/
│       └── README.md
└── tests/
    ├── unit/
    ├── integration/
    └── contract/
```

**结构决策**: 采用单仓库单体 CLI + 内置 Blueprint 子目录结构，便于 v1 快速实现与测试闭环。

## 复杂度追踪

本次计划未引入需要豁免的复杂度例外。

