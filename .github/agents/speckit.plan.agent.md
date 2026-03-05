---
description: 使用计划模板执行实现规划流程并生成设计产物。
handoffs:
  - label: 创建任务清单
    agent: speckit.tasks
    prompt: Break the plan into tasks
    send: true
  - label: 创建检查清单
    agent: speckit.checklist
    prompt: Create a checklist for the following domain...
---

## 用户输入

```text
$ARGUMENTS
```

在继续前，你**必须**考虑用户输入（若不为空）。

## 执行大纲

1. **初始化**：在仓库根目录执行 `.specify/scripts/powershell/setup-plan.ps1 -Json`，解析 `FEATURE_SPEC`、`IMPL_PLAN`、`SPECS_DIR`、`BRANCH`。
2. **加载上下文**：读取 `FEATURE_SPEC` 与 `.specify/memory/constitution.md`，并加载已复制的 `IMPL_PLAN` 模板。
3. **执行计划流程**：
   - 填写 Technical Context（未知项标记为 `NEEDS CLARIFICATION`）
   - 基于宪章填写 Constitution Check
   - 评估门禁（不合理违规则报错）
   - Phase 0：生成 `research.md`（解决所有澄清项）
   - Phase 1：生成 `data-model.md`、`contracts/`、`quickstart.md`
   - Phase 1：执行 agent 上下文更新脚本
   - 设计后重新执行 Constitution Check
4. **结束并汇报**：在规划阶段结束后输出分支、`IMPL_PLAN` 路径与已生成产物。

## 分阶段说明

### Phase 0：梳理与调研

1. 从 Technical Context 抽取未知项：
   - 每个 `NEEDS CLARIFICATION` 生成调研任务
   - 每个依赖生成最佳实践任务
   - 每个集成点生成实现模式任务
2. 组织调研任务并汇总结论到 `research.md`：
   - Decision（决策）
   - Rationale（理由）
   - Alternatives considered（备选方案）

**输出**：`research.md`（全部澄清项已解决）

### Phase 1：设计与契约

**前提**：`research.md` 已完成

1. 从规格抽取实体生成 `data-model.md`：
   - 实体名、字段、关系
   - 来自需求的校验规则
   - 必要的状态迁移
2. 定义外部接口契约到 `contracts/`（若项目存在外部接口）：
   - 识别对外暴露接口
   - 采用适配项目类型的契约格式
   - 纯内部项目可跳过
3. 更新 agent 上下文：
   - 执行 `.specify/scripts/powershell/update-agent-context.ps1 -AgentType copilot`
   - 仅追加当前计划中的新增技术
   - 保留手工补充区内容

**输出**：`data-model.md`、`contracts/*`、`quickstart.md`、agent 上下文文件

## 关键规则

- 全程使用绝对路径。
- 门禁失败或存在未解决澄清项时必须报错并停止。
