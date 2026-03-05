# lnngfar

lnngfar 是一个 Blueprint 驱动的代码生成器内核。

## 核心边界

- 核心只负责：CLI 调度、Blueprint 发现、Blueprint 校验、Blueprint 执行。
- 技术栈能力由 Blueprint 提供，不内置在核心。
- 默认输出目录是当前工作目录，存在任意冲突文件或目录时直接失败。

## 快速开始

```powershell
npm install
npm test
npm run build
node dist/src/cli/index.js cocos
```

## 内置 Blueprint

- `lnngfar-blueprint-cocos`

## 开发命令

```powershell
npm run lint
npm test
npm run build
```
