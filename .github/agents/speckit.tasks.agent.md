---
description: 基于现有设计产物生成可执行、含依赖顺序的 tasks.md。
handoffs:
  - label: 一致性分析
    agent: speckit.analyze
    prompt: Run a project analysis for consistency
    send: true
  - label: 开始实现
    agent: speckit.implement
    prompt: Start the implementation in phases
    send: true
---

## 用户输入

```text
$ARGUMENTS
```

在继续前，你**必须**考虑用户输入（若不为空）。

## 执行大纲

1. **初始化**：执行 `.specify/scripts/powershell/check-prerequisites.ps1 -Json`，解析 `FEATURE_DIR` 与 `AVAILABLE_DOCS`。
2. **读取设计文档**：
   - 必需：`plan.md`、`spec.md`
   - 可选：`data-model.md`、`contracts/`、`research.md`、`quickstart.md`
3. **生成任务流程**：
   - 从 `plan.md` 提取技术栈、依赖与目录
   - 从 `spec.md` 提取用户故事优先级（P1/P2/P3）
   - 将实体/契约/调研决策映射到故事阶段
   - 生成按故事分组的任务
   - 生成依赖顺序与并行示例
   - 校验每个故事可独立实现与独立测试
4. **输出 tasks.md**：
   - 使用 `.specify/templates/tasks-template.md`
   - 含阶段划分、文件路径、依赖关系、并行机会、MVP 优先策略
5. **汇报摘要**：
   - 总任务数、每个故事任务数
   - 并行机会
   - 每个故事独立测试标准
   - 推荐 MVP 范围（通常 US1）
   - 格式校验结果

## 任务生成规则

### 强制组织原则

- 任务必须按用户故事分组，支持独立交付。
- 仅在规格显式要求测试或用户要求 TDD 时生成测试任务。

### 任务格式（强制）

每条任务必须严格使用：

```text
- [ ] [TaskID] [P?] [Story?] Description with file path
```

#### 格式含义

1. `- [ ]`：必须有复选框
2. `TaskID`：顺序编号（T001、T002...）
3. `[P]`：仅当可并行时标注
4. `[Story]`：仅故事阶段任务必填（如 `[US1]`）
5. 描述必须包含准确文件路径

### 阶段结构

- **Phase 1**：初始化
- **Phase 2**：基础阻塞能力（完成前不得进入故事阶段）
- **Phase 3+**：按优先级逐个用户故事
- **Final Phase**：完善与横切关注点

### 依赖原则

- 同文件任务顺序执行。
- 可并行任务必须互不依赖。
- 故事内通常遵循：测试（如需）→ 模型 → 服务 → 接口/集成。

## 结果要求

`tasks.md` 必须可立即执行，即每个任务都足够具体，LLM 无需额外上下文即可执行。
