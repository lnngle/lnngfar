---
description: 通过最多 5 个高价值问题识别规格中的关键不明确项，并将答案回写到规格中。
handoffs:
  - label: 构建技术计划
    agent: speckit.plan
    prompt: Create a plan for the spec. I am building with...
---

## 用户输入

```text
$ARGUMENTS
```

在继续前，你**必须**考虑用户输入（若不为空）。

## 目标

降低当前功能规格中的歧义与缺失决策点，并把澄清结果直接落地到 `spec.md`。

## 执行步骤

1. 在仓库根目录执行一次：
   `.specify/scripts/powershell/check-prerequisites.ps1 -Json -PathsOnly`
   并解析 `FEATURE_DIR`、`FEATURE_SPEC`（可选读取 `IMPL_PLAN`、`TASKS`）。
2. 读取规格并按分类扫描覆盖度（Clear/Partial/Missing）：
   - 功能范围
   - 领域与数据模型
   - 交互流程
   - 非功能属性
   - 外部依赖
   - 失败与边界场景
   - 约束与取舍
   - 术语一致性
   - 完成信号
   - 占位与模糊词
3. 生成优先级问题队列（最多 5 个）。
4. 交互提问规则：
   - 一次只问一个问题
   - 多选题给出推荐项与理由
   - 简答题给出建议答案与理由
   - 用户回答后校验并记录
   - 用户可用 `yes/recommended/suggested` 接受推荐
5. 每接受一个答案就立即集成到规格：
   - 首次写入时创建 `## Clarifications` 和当日会话小节
   - 追加 `- Q: ... → A: ...`
   - 将答案同步更新到最相关章节（需求、故事、数据模型、边界、NFR 等）
   - 移除被替代的冲突表述
6. 每次写入后执行校验：
   - 问答条目不重复
   - 总提问数 ≤ 5
   - 无新增矛盾
   - Markdown 结构合法
7. 保存 `FEATURE_SPEC`。
8. 输出总结：
   - 提问与回答数量
   - 更新文件路径
   - 受影响章节
   - 分类覆盖状态（Resolved/Deferred/Clear/Outstanding）
   - 建议下一步命令

## 行为规则

- 若无高价值歧义，返回：`No critical ambiguities detected worth formal clarification.`
- 若规格文件不存在，提示先执行 `/speckit.specify`。
- 尊重用户提前结束指令（如 stop/done/proceed）。
- 避免提出不影响功能正确性的低价值问题。

## 优先级上下文

$ARGUMENTS
