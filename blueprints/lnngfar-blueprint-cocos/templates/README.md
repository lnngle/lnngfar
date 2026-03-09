# {{PROJECT_NAME}}

基于 `lnngfar-blueprint-cocos` 生成的 Cocos Creator 3.x 小游戏模板。

## 环境要求

- 已安装 Cocos Creator（生成时会自动探测本机版本并写入 `package.json.creator.version`）
- 如需强制指定版本，可在生成前设置环境变量：`LNNGFAR_COCOS_CREATOR_VERSION=3.x.y`

## 快速开始

1. 打开 Cocos Creator Dashboard。
2. 点击 `导入项目`，选择本项目根目录。
3. 打开项目后点击 `预览运行`，确认默认场景可启动。

## 调试与发布

- 调试：在 Creator 中使用浏览器预览或模拟器预览。
- 发布：在 Creator 中进入 `构建发布`，选择目标平台（Web、微信小游戏等）并构建。

## 测试

- 单元测试：`npm run test:unit`
- 集成测试：`npm run test:integration`
- 全量测试：`npm test`

## 目录说明

- `assets/bundle/`：动态分包资源目录（界面、通用素材等）。
- `assets/libs/`：第三方运行库资源（示例：`seedrandom`）。
- `assets/resources/`：默认资源与配置目录。
- `assets/main.scene`：默认启动场景。
- `assets/script/Main.ts`：默认入口组件脚本，内置三段启动模板方法：`initializeResources`、`initializeUi`、`openFirstScreen`。
- `assets/script/game/initialize/`：初始化流程骨架（资源预加载入口等）。
- `assets/script/game/common/config/GameUIConfig.ts`：UI 启动配置样例。
- `settings/v2/packages/project.json`：项目分辨率与通用配置。
- `settings/v2/packages/builder.json`：构建相关配置。
- `tests/unit/`：模板单元测试样例。
- `tests/integration/`：模板集成测试样例。
