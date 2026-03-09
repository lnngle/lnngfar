# {{PROJECT_NAME}}

基于 `lnngfar-blueprint-cocos` 生成的 Cocos Creator 3.x 小游戏模板。

## 环境要求

- 已安装 Cocos Creator 3.8.7（或手动修改 `package.json` 中 `creator.version` 为本机已安装版本）

## 快速开始

1. 打开 Cocos Creator Dashboard。
2. 点击 `导入项目`，选择本项目根目录。
3. 打开项目后点击 `预览运行`，确认默认场景可启动。

## 调试与发布

- 调试：在 Creator 中使用浏览器预览或模拟器预览。
- 发布：在 Creator 中进入 `构建发布`，选择目标平台（Web、微信小游戏等）并构建。

## 目录说明

- `assets/main.scene`：默认启动场景。
- `assets/script/Main.ts`：默认入口组件脚本，内置三段启动模板方法：`initializeResources`、`initializeUi`、`openFirstScreen`。
- `assets/script/game/initialize/`：初始化流程骨架（资源预加载入口等）。
- `assets/script/game/common/config/GameUIConfig.ts`：UI 启动配置样例。
- `settings/v2/packages/project.json`：项目分辨率与通用配置。
- `settings/v2/packages/builder.json`：构建相关配置。
