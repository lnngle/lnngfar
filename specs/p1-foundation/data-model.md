# Data Model: lnngfar Foundation

## 1. LnngfarConfig

项目配置根实体。

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| project | ProjectInfo | ✅ | 项目基本信息 |
| stack | StackRef | ✅ | 技术栈引用 |
| ai | AiConfig | 否 | AI 配置 |
| skills | string[] | 否 | 启用的 Skill 列表 |
| templates | TemplateConfig | 否 | 启用的模板 |
| test | TestConfig | 否 | 测试配置 |
| deploy | DeployConfig | 否 | 部署配置 |

校验规则：

- `project.name` 非空
- `stack.name` 非空
- 若 `ai.keyFrom === 'env'` 则 `ai.keyEnvVar` 必填

---

## 2. Workspace

Monorepo 工作区实体。

| 字段 | 类型 | 说明 |
|------|------|------|
| root | string | 工作区根目录绝对路径 |
| packages | PackageInfo[] | 已扫描的包列表 |
| config | LnngfarConfig \| null | 加载的配置（不存在时为 null） |

校验规则：

- `packages` 可以为空数组（`packages/` 目录为空或不存在）

---

## 3. Project

用户项目实体。

| 字段 | 类型 | 说明 |
|------|------|------|
| name | string | 项目名称 |
| path | string | 项目绝对路径 |
| config | LnngfarConfig | 项目配置 |

校验规则：

- `path` 下不能已有同名目录

---

## 4. Logger Interface

| 方法 | 签名 | 说明 |
|------|------|------|
| debug | `(msg, ...args) => void` | 调试信息 |
| info | `(msg, ...args) => void` | 常规信息 |
| warn | `(msg, ...args) => void` | 警告信息 |
| error | `(msg, ...args) => void` | 错误信息 |

---

## 5. LogLevel Enum

| 值 | 级别 | 说明 |
|----|------|------|
| 0 | DEBUG | 输出所有日志 |
| 1 | INFO | 输出 info/warn/error |
| 2 | WARN | 输出 warn/error |
| 3 | ERROR | 仅输出 error |
| 4 | SILENT | 无输出 |

---

## 依赖关系

```
@lnngfar/types          ← 0 依赖
@lnngfar/logger         ← @lnngfar/types
@lnngfar/config-loader  ← @lnngfar/types
@lnngfar/workspace-manager ← @lnngfar/types + @lnngfar/logger + @lnngfar/config-loader
```

约束：严格单向依赖，禁止循环引用。
