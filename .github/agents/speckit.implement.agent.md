---
description: 按 tasks.md 分阶段执行实现计划并持续跟踪状态。
---

## 用户输入

```text
$ARGUMENTS
```

在继续前，你**必须**考虑用户输入（若不为空）。

## 执行大纲

1. 执行 `.specify/scripts/powershell/check-prerequisites.ps1 -Json -RequireTasks -IncludeTasks`，解析 `FEATURE_DIR` 与 `AVAILABLE_DOCS`。
2. 检查 `FEATURE_DIR/checklists/`（若存在）：
   - 统计总项、已完成项、未完成项
   - 输出状态表
   - 若有未完成项，先询问用户是否继续；用户拒绝则停止
3. 读取实现上下文：
   - 必需：`tasks.md`、`plan.md`
   - 可选：`data-model.md`、`contracts/`、`research.md`、`quickstart.md`
4. 执行项目忽略文件校验与补全：
   - 根据仓库特征创建或补充 `.gitignore`、`.dockerignore`、`.eslintignore`、`.prettierignore` 等
   - 仅追加缺失关键模式，避免破坏现有配置
5. 解析 `tasks.md`：阶段、依赖、并行标记、文件路径。
6. 按计划执行实现：
   - 按阶段推进
   - 严格尊重依赖关系
   - 如适用遵循“测试先行”
   - 同文件任务顺序执行
7. 进度与异常：
   - 每完成任务汇报进度
   - 非并行任务失败时停止
   - 并行任务允许部分成功并报告失败项
   - 完成任务后在 `tasks.md` 勾选 `[X]`
8. 完成校验：
   - 所需任务已完成
   - 与规格一致
   - 测试与验证通过
   - 输出最终汇总

## 注意

若 `tasks.md` 缺失或不完整，建议先运行 `/speckit.tasks`。
