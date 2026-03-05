---
description: 在任务生成后，对 spec.md、plan.md、tasks.md 做只读一致性与质量分析。
---

## 用户输入

```text
$ARGUMENTS
```

在继续前，你**必须**考虑用户输入（若不为空）。

## 目标

在实现前识别三份核心产物之间的不一致、重复、歧义与欠定义问题。

## 运行约束

- **严格只读**：不得修改任何文件。
- 输出结构化分析报告。
- 可给出修复建议，但只有用户明确同意后才进入后续编辑流程。
- `.specify/memory/constitution.md` 为最高约束；与宪章冲突一律判定为 **CRITICAL**。

## 执行步骤

1. 执行 `.specify/scripts/powershell/check-prerequisites.ps1 -Json -RequireTasks -IncludeTasks`，解析：
   - `FEATURE_DIR`
   - `AVAILABLE_DOCS`
   - 派生路径：`SPEC`、`PLAN`、`TASKS`
2. 按最小必要上下文加载文档：
   - `spec.md`：概览、需求、用户故事、边界场景
   - `plan.md`：架构选择、数据模型、阶段、技术约束
   - `tasks.md`：任务 ID、描述、阶段、并行标记、文件路径
   - `constitution.md`：原则与 MUST/SHOULD 规则
3. 建立语义映射：
   - 需求清单（含稳定 key）
   - 用户动作清单
   - 任务-需求覆盖映射
   - 宪章规则集
4. 进行检测（最多 50 条高信号发现）：
   - 重复项
   - 歧义项
   - 欠定义项
   - 宪章冲突
   - 覆盖缺口
   - 跨文档不一致
5. 严重级别：CRITICAL / HIGH / MEDIUM / LOW。
6. 输出报告（仅文本，不写文件）：
   - 发现列表表格
   - 覆盖摘要表
   - 宪章冲突
   - 未映射任务
   - 统计指标（需求总数、任务总数、覆盖率、歧义数、重复数、严重问题数）
7. 给出下一步建议：
   - 有 CRITICAL：建议先修复再 `/speckit.implement`
   - 仅低/中风险：可继续但给出优化建议
8. 询问用户是否需要“Top N 问题的可执行修复建议”（不自动应用）。

## 输出规范

- 结论可复现、可操作。
- 不臆测不存在内容。
- 若 0 问题，仍输出完整通过报告与覆盖统计。

## 上下文

$ARGUMENTS
