# API Contracts: lnngfar Foundation

## 1. @lnngfar/logger Contract

### `createLogger(name: string, level?: LogLevel): Logger`

- **Precondition**: `name` 非空字符串
- **Postcondition**: 返回的 Logger 对象遵循 LogLevel 控制
- **Type**: `level` 默认值 `LogLevel.INFO`
- **Error**: N/A（无副作用的纯构造函数）

---

## 2. @lnngfar/config-loader Contract

### `loadConfig(path: string): LnngfarConfig`

- **Precondition**: `path` 为有效目录路径
- **Postcondition**: 返回经过校验的 `LnngfarConfig`
- **Error**: `No config file found` 若无配置文件；`Invalid JSON` 若 JSON 解析失败
- **Side Effect**: 仅读取文件，无写入

### `validateConfig(config: unknown): config is LnngfarConfig`

- **Precondition**: 无
- **Postcondition**: `true` 返回表示类型收窄为 `LnngfarConfig`
- **Error**: 抛出 `TypeError` 若缺少 `project` 或 `stack` 字段
- **Side Effect**: 无

---

## 3. @lnngfar/workspace-manager Contract

### `loadWorkspace(rootPath: string): Workspace`

- **Precondition**: `rootPath` 为有效目录路径
- **Postcondition**: 返回 `Workspace` 对象，`packages` 可能为空数组
- **Error**: N/A（无配置文件时 `config` 为 null，不抛异常）
- **Side Effect**: 仅读取目录信息

### `createProject(name: string, opts?: CreateOptions): Project`

- **Precondition**: `name` 非空，目录不存在
- **Postcondition**: 项目目录创建，包含 `lnngfar.config.json` 和 `specs/` 基础结构
- **Error**: `Project directory already exists` 若目录已存在
- **Side Effect**: 创建目录和文件

---

## Module Dependency Contract

```
┌─────────────────┐
│  @lnngfar/types  │  ← 0 依赖
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌────────┐ ┌──────────────┐
│ logger │ │ config-loader │  ← 仅依赖 types
└───┬────┘ └──────┬───────┘
    │              │
    └──────┬───────┘
           ▼
  ┌─────────────────┐
  │ workspace-manager│  ← 依赖 types + logger + config
  └─────────────────┘
```

违反此依赖方向的 PR 必须被拒绝。
