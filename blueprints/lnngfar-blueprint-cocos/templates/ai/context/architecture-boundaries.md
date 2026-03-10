# 架构边界

## 领域

- `account`
- `initialize`
- `common`

## 硬约束（来自 check-architecture）

- `components/layouts` 不允许依赖 `view`。
- `account` 不允许依赖 `initialize`。
- `initialize` 不允许依赖 `account/components`、`account/layouts`、`account/model`。

## 启动链路约束（来自 check-main-bootstrap）

`Main.ts` 必须保留以下关键令牌：

- `BootstrapPipeline`
- `配置预热`
- `模块绑定`
- `GUI 初始化`
- `smc.bindModules`
- `guiAdapter.init`

## AI 输出要求

- 任何跨域改动必须先给出依赖影响说明。
- 修改 `Main.ts` 必须说明为何不破坏启动令牌约束。
