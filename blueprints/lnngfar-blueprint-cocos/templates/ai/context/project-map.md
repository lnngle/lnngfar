# 项目地图

## 核心目录

- `assets/script/`：核心业务代码，AI 主要改动区。
- `assets/resources/`：运行时配置与动态资源。
- `tools/`：质量门禁与工程化脚本。
- `tests/tools/`：工具脚本单测。
- `extensions/`：插件目录，由同步命令维护。
- `settings/v2/packages/`：Creator 工程配置。

## 主流程

1. 开发逻辑：`assets/script/**`
2. 运行门禁：`npm run test`
3. 问题定位：按 `run-tests` 阶段日志逐步排查

## 常用命令

- `npm run test`
- `npm run lint`
- `npm run typecheck`
- `npm run sync:extensions`
