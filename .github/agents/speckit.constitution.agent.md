---
description: 根据交互输入创建或更新项目宪章，并同步检查依赖模板的一致性。
handoffs:
  - label: 构建规格
    agent: speckit.specify
    prompt: Implement the feature specification based on the updated constitution. I want to build...
---

## 用户输入

```text
$ARGUMENTS
```

在继续前，你**必须**考虑用户输入（若不为空）。

## 执行大纲

目标文件：`.specify/memory/constitution.md`

1. 读取当前宪章，识别所有 `[ALL_CAPS_IDENTIFIER]` 占位符。
2. 收集占位符值：
   - 优先使用用户输入
   - 否则从仓库上下文推断（README、文档、历史宪章）
   - 版本号遵循语义化：MAJOR/MINOR/PATCH
   - `LAST_AMENDED_DATE` 为本次修改日期，`RATIFICATION_DATE` 保留原值（未知可标注 TODO）
3. 生成新宪章：
   - 尽量替换全部占位符
   - 保持标题层级
   - 原则应可验证、可执行、措辞清晰
4. 同步一致性检查（必要时更新相关模板/文档）：
   - `.specify/templates/plan-template.md`
   - `.specify/templates/spec-template.md`
   - `.specify/templates/tasks-template.md`
   - `.specify/templates/commands/*.md`（若存在）
   - 运行时文档（README、docs 等）
5. 在宪章顶部追加同步影响报告（HTML 注释）：
   - 版本变化
   - 变更原则
   - 增删章节
   - 涉及模板文件
   - 待办项
6. 写回宪章并输出结果摘要：
   - 新版本及升版理由
   - 需人工跟进项
   - 建议提交信息

## 校验要求

- 不应留下无法解释的占位符。
- 版本号与影响报告一致。
- 日期格式：`YYYY-MM-DD`。
- 原则避免模糊词，必要时用 MUST/SHOULD 表达并给出理由。
