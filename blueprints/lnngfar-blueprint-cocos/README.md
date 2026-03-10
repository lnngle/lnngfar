# lnngfar-blueprint-cocos

用于生成可直接导入 Cocos Creator Dashboard 的小游戏项目脚手架。

## 包含内容

- Creator 工程元数据：`package.json`（含 `creator.version`）、`settings/v2/packages/*.json`
- oops 资源目录：`assets/bundle/`、`assets/libs/`、`assets/resources/`（含对应 `.meta`）
- 启动场景：`assets/main.scene`、`assets/main.scene.meta`
- 入口脚本：`assets/script/Main.ts`、`assets/script/Main.ts.meta`
- 初始化与业务脚本：`assets/script/game/`
- 兼容配置：`.gitignore`、`tsconfig.json`、模板说明文档

## 模板目标

- 导入 Dashboard 后可直接打开并预览运行
- 具备可调试、可构建发布的基础工程结构
- 生成时自动探测本机 Creator 版本并写入 `creator.version`
- 保持与 `oops-game-kit` 模板结构 1:1 对齐

## 生成器入口

- 本 Blueprint 的运行时入口为 `generators/index.js`。
- `blueprint.json.generatorEntry` 已固定指向该文件。
- 为避免双入口漂移，不再维护同名 `index.ts` 运行时实现。
