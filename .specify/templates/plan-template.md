# 实施计划：[FEATURE]

**分支**: `[###-feature-name]` | **日期**: [DATE] | **规格**: [link]
**输入**: 来自 `/specs/[###-feature-name]/spec.md` 的功能规格

**说明**: 本模板由 `/speckit.plan` 命令填充。执行流程见 `.specify/templates/plan-template.md`。

## 摘要

[从功能规格中提取：核心需求 + 来自 research 的技术方案]

## 技术上下文

<!--
  需要动作：请将本节替换为项目的实际技术细节。
  此处结构仅用于提供参考，以指导迭代过程。
-->

**语言/版本**: [例如 Python 3.11、Swift 5.9、Rust 1.75，或 NEEDS CLARIFICATION]  
**主要依赖**: [例如 FastAPI、UIKit、LLVM，或 NEEDS CLARIFICATION]  
**存储**: [如适用，例如 PostgreSQL、CoreData、文件系统，或 N/A]  
**测试方案**: [例如 pytest、XCTest、cargo test，或 NEEDS CLARIFICATION]  
**目标平台**: [例如 Linux 服务器、iOS 15+、WASM，或 NEEDS CLARIFICATION]
**项目类型**: [例如 library/cli/web-service/mobile-app/compiler/desktop-app，或 NEEDS CLARIFICATION]  
**性能目标**: [领域相关，如 1000 req/s、每秒处理 1 万行、60 fps，或 NEEDS CLARIFICATION]  
**约束条件**: [领域相关，如 p95 < 200ms、内存 < 100MB、离线可用，或 NEEDS CLARIFICATION]  
**规模/范围**: [领域相关，如 1 万用户、100 万行代码、50 个页面，或 NEEDS CLARIFICATION]

## 宪章检查

*门禁：必须在第 0 阶段调研前通过；并在第 1 阶段设计后重新检查。*

- [ ] 核心是否仅承担调度/发现/校验/执行职责，未内置技术栈生成逻辑（Blueprint 一等公民）
- [ ] 生成流程是否保证确定性，且目录冲突策略为“严格失败退出”
- [ ] 是否定义并落实测试门禁（核心测试、Blueprint 测试、失败即中断）
- [ ] 错误处理是否覆盖环境/Blueprint/生成/测试四阶段，且无静默失败
- [ ] 扩展方案是否支持“不修改核心代码即可新增 Blueprint”
- [ ] 文档、交互与新增注释是否符合中文约束

## 项目结构

### 文档（当前功能）

```text
specs/[###-feature]/
├── plan.md              # 本文件（/speckit.plan 命令输出）
├── research.md          # 第 0 阶段输出（/speckit.plan）
├── data-model.md        # 第 1 阶段输出（/speckit.plan）
├── quickstart.md        # 第 1 阶段输出（/speckit.plan）
├── contracts/           # 第 1 阶段输出（/speckit.plan）
└── tasks.md             # 第 2 阶段输出（/speckit.tasks 生成，非 /speckit.plan 生成）
```

### 源代码（仓库根目录）
<!--
  需要动作：请将下方占位目录树替换为该功能的实际目录结构。
  删除未使用选项，并以真实路径展开（如 apps/admin、packages/xxx）。
  交付的计划中不应保留 “Option” 标签。
-->

```text
# [REMOVE IF UNUSED] 选项 1：单体项目（默认）
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [REMOVE IF UNUSED] 选项 2：Web 应用（检测到 "frontend" + "backend" 时）
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [REMOVE IF UNUSED] 选项 3：移动端 + API（检测到 "iOS/Android" 时）
api/
└── [与上方 backend 类似]

ios/ or android/
└── [平台特定结构：功能模块、界面流程、平台测试]
```

**结构决策**: [记录选择的结构，并引用上方实际目录]

## 复杂度追踪

> **仅当宪章检查存在且必须说明的例外时填写**

| 例外项 | 必要原因 | 被拒绝的更简方案及原因 |
|--------|----------|------------------------|
| [例如：第 4 个子项目] | [当前需求] | [为什么 3 个子项目不够] |
| [例如：Repository 模式] | [具体问题] | [为什么直接访问数据库不够] |
