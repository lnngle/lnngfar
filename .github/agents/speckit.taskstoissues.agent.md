---
description: 将现有任务清单转换为具备依赖顺序的 GitHub Issues。
tools: ['github/github-mcp-server/issue_write']
---

## 用户输入

```text
$ARGUMENTS
```

在继续前，你**必须**考虑用户输入（若不为空）。

## 执行步骤

1. 执行 `.specify/scripts/powershell/check-prerequisites.ps1 -Json -RequireTasks -IncludeTasks`，解析 `FEATURE_DIR` 与文档列表。
2. 从结果中定位 `tasks` 文件路径。
3. 执行：

```bash
git config --get remote.origin.url
```

4. **仅当远端是 GitHub URL 时**继续。
5. 遍历任务清单，使用 GitHub MCP 为每个任务创建对应 issue。

> [!CAUTION]
> 绝对禁止在与当前远端不匹配的仓库创建 issue。
