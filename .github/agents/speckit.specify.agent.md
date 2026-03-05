---
description: 从自然语言功能描述创建或更新功能规格。
handoffs:
  - label: 构建技术计划
    agent: speckit.plan
    prompt: Create a plan for the spec. I am building with...
  - label: 澄清规格需求
    agent: speckit.clarify
    prompt: Clarify specification requirements
    send: true
---

## 用户输入

```text
$ARGUMENTS
```

在继续前，你**必须**考虑用户输入（若不为空）。

## 执行大纲

`/speckit.specify` 后面的文本就是功能描述。即使下方出现字面量 `$ARGUMENTS`，也应视为已提供描述；仅在用户输入为空时才报错。

### 1）生成分支短名（2-4 个词）

- 从功能描述中提取关键语义，生成简洁短名。
- 优先使用“动作-名词”风格（如 `user-auth`、`fix-payment-timeout`）。
- 保留技术缩写（OAuth2、API、JWT 等）。

### 2）创建分支前编号探测

- 先执行：`git fetch --all --prune`
- 在以下三处查找同短名的最大编号：
  - 远端分支：`refs/heads/[0-9]+-<short-name>`
  - 本地分支：`[0-9]+-<short-name>`
  - 规格目录：`specs/[0-9]+-<short-name>`
- 取最大编号 `N`，新编号用 `N+1`（若不存在则从 1 开始）。

### 3）仅执行一次建特性脚本

使用：`.specify/scripts/powershell/create-new-feature.ps1`

要求：
- 必须携带 `-Json`。
- 传入 `-Number N+1` 与 `-ShortName <short-name>`。
- 对同一功能只能执行一次该脚本。
- 从脚本 JSON 输出读取 `BRANCH_NAME` 与 `SPEC_FILE`。

单引号参数需转义（例如 `I'm Groot`）。

### 4）加载模板并生成规格

读取 `.specify/templates/spec-template.md`，按模板顺序填充内容：

1. 解析功能描述（为空则报错）
2. 抽取关键概念：参与者、动作、数据、约束
3. 对不明确项：
   - 先做合理默认假设
   - 仅在高影响且无合理默认时使用 `[NEEDS CLARIFICATION: ...]`
   - 最多 3 个，按影响优先级：范围 > 安全/隐私 > 体验 > 技术细节
4. 完成“用户场景与测试”（无法形成用户流则报错）
5. 生成功能需求（必须可测试）
6. 定义成功标准（可度量、与技术无关、可验证）
7. 涉及数据时定义关键实体

### 5）写入 SPEC_FILE

- 保持模板章节顺序与标题层级。
- 用具体内容替换占位符。

### 6）规格质量校验

在 `FEATURE_DIR/checklists/requirements.md` 创建质量清单，并完成校验：

- 若全部通过：标记通过。
- 若失败（不含澄清项）：回改规格并复验，最多 3 轮。
- 若仍有 `[NEEDS CLARIFICATION]`：
  - 提取并限制到最多 3 个高优先问题；
  - 用表格选项向用户提问；
  - 根据用户选择更新规格并复验。

### 7）输出结果

返回以下信息：
- 分支名
- 规格文件路径
- 清单结果
- 是否可进入下一阶段（`/speckit.clarify` 或 `/speckit.plan`）

## 编写原则

- 聚焦“用户需要什么、为什么需要”。
- 避免实现细节（语言、框架、API、代码结构）。
- 面向业务干系人，语言清晰。
- 不在规格正文内嵌额外检查清单（检查清单应单独文件）。

### 章节要求

- 必填章节必须完整。
- 可选章节按需保留，不适用则删除，不写 N/A。

### 生成建议

- 使用合理默认并在 Assumptions 记录。
- 仅在必要时添加澄清标记（最多 3 个）。
- 每条需求都应能通过“可测试、无歧义”检查。

### 成功标准要求

- 可度量（时间、比例、数量、速率等）。
- 与技术实现无关。
- 以用户/业务结果为中心。
- 不依赖实现细节即可验证。
