# lnngfar-blueprint-cocos

用于生成基于 oops-framework 设计风格的 Cocos Creator 小游戏项目脚手架。

## 包含内容

- 项目级配置：`package.json`、`tsconfig.json`、`jest.config.cjs`、`.gitignore`
- 游戏资源配置：`assets/resources/config/game-config.json`、`assets/resources/levels/level-001.json`
- 核心应用层：`assets/scripts/core/GameApp.ts`、`assets/scripts/entry/GameEntry.ts`
- 游戏玩法层：`assets/scripts/gameplay/` 下的循环、模型与系统模块
- 平台与 UI 层：`assets/scripts/platform/`、`assets/scripts/ui/`
- 模块示例与测试：`assets/scripts/modules/sample/`、`tests/*.spec.ts`

## 模板目标

- 开箱即用的小游戏项目目录结构
- 可直接运行的纯 TypeScript 玩法核心代码
- 可执行的模板测试样例，便于二次扩展与回归验证
