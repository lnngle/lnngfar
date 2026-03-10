# 技术栈基线

## 运行时

- Cocos Creator 3.8.x
- TypeScript
- oops-framework 生态插件

## 工程化

- Node.js + npm scripts
- ESLint + Prettier
- node:test + c8

## 关键脚本

- `tools/run-tests.js`：总门禁入口
- `tools/check-architecture.js`：架构边界
- `tools/check-assets.js`：资源规范
- `tools/check-config.js`：配置合法性
- `tools/check-main-bootstrap.js`：启动链路关键逻辑

## 版本与依赖策略

- `extensions.lock.json` 锁定插件提交
- 插件更新通过 `sync:*` / `bump:*`
