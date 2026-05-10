# Data Model: Runtime Core

## 1. RuntimeState

| 值 | 状态 | 说明 |
|----|------|------|
| created | 已创建 | 初始状态 |
| booting | 启动中 | boot 钩子执行中 |
| init | 初始化 | init 钩子执行中 |
| ready | 就绪 | 可接受请求 |
| running | 运行中 | 正常工作 |
| shutting_down | 关闭中 | shutdown 钩子执行中 |
| stopped | 已停止 | 完全关闭 |

## 2. LnngfarModule

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | ✅ | 模块唯一名称 |
| init | `() => Promise<void>` | 否 | 初始化钩子 |
| shutdown | `() => Promise<void>` | 否 | 关闭钩子 |

## 3. RuntimeConfig

| 字段 | 类型 | 说明 |
|------|------|------|
| modules | LnngfarModule[] | 预加载模块列表 |

## 4. EventBus

内部结构：
- `handlers: Map<string, Set<EventHandler>>`

## 5. ContextStore

内部结构：
- `storage: Map<string, unknown>`

## 状态迁移

```
created → booting → init → ready → running → shutting_down → stopped
              ↓       ↓      ↓                            ↑
              └───────┴──────┴────────────────────────────┘
                        (任意状态可直接 shutdown)
```
