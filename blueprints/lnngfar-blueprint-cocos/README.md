# lnngfar-blueprint-cocos

用于生成可直接导入 Cocos Creator Dashboard 的小游戏项目脚手架。

## 包含内容

- Creator 工程元数据：`package.json`（含 `creator.version`）、`settings/v2/packages/*.json`
- oops 资源目录：`assets/bundle/`、`assets/libs/`、`assets/resources/`（含对应 `.meta`）
- 启动场景：`assets/main.scene`、`assets/main.scene.meta`
- 入口脚本：`assets/script/Main.ts`、`assets/script/Main.ts.meta`（三段启动模板方法）
- 初始化骨架：`assets/script/game/initialize/`、`assets/script/game/common/`
- 兼容配置：`.gitignore`、`tsconfig.json`、模板说明文档

## 模板目标

- 导入 Dashboard 后可直接打开并预览运行
- 具备可调试、可构建发布的基础工程结构
- 提供可选 oops 风格启动钩子，并保留无插件降级启动
- 保持简洁骨架，便于后续接入自定义玩法与资源
