# lnngfar

lnngfar 是一个 Blueprint 驱动的代码生成器内核。

## 当前状态

- 已内置 `lnngfar-blueprint-cocos`，可生成完整小游戏项目骨架。
- 生成流程固定为：环境校验 -> Blueprint 发现加载 -> Blueprint 校验 -> 生成执行 -> 测试执行。

## 核心边界

- 核心只负责：CLI 调度、Blueprint 发现、Blueprint 校验、Blueprint 执行。
- 技术栈能力由 Blueprint 提供，不内置在核心。
- 默认输出目录是当前工作目录，存在任意冲突文件或目录时直接失败。

## 环境要求

- Node.js >= 18 LTS
- npm >= 9

## 安装与命令可用性

### 方式 A：仓库开发态（推荐）

执行 `npm install` 后会自动构建 CLI，可直接使用 `npx` 或 `npm exec` 调用：

```powershell
npm install
npx --no-install lnngfar cocos
# 或
npm exec -- lnngfar cocos
```

### 方式 B：全局命令态

如果希望直接输入 `lnngfar cocos`，请先进行全局 link：

```powershell
npm install
npm run setup:link
lnngfar cocos
```

取消全局 link：

```powershell
npm run setup:unlink
```

## 快速开始（生成完整小游戏项目）

请在一个空目录中执行，避免冲突检测失败。

```powershell
# 在 lnngfar 仓库根目录
npm install

# 切换到目标空目录（示例）
mkdir ..\demo-cocos-game
cd ..\demo-cocos-game

# 使用仓库开发态命令
npx --prefix ..\lnngfar --no-install lnngfar cocos
```

生成后将包含完整小游戏骨架，例如：

- `assets/resources/config/game-config.json`
- `assets/resources/levels/level-001.json`
- `assets/scripts/entry/GameEntry.ts`
- `assets/scripts/core/GameApp.ts`
- `assets/scripts/gameplay/GameLoop.ts`
- `assets/scripts/platform/MiniGamePlatformAdapter.ts`
- `assets/scripts/ui/HudView.ts`
- `tests/game-loop.spec.ts`

## 运行与验证

```powershell
npm run lint
npm test
npm run build
```

## 内置 Blueprint

- `lnngfar-blueprint-cocos`

## 常见问题

### 1) 执行 `lnngfar` 提示找不到命令

- 原因：当前 shell 未安装全局 link。
- 处理：优先用 `npx --no-install lnngfar cocos`，或执行 `npm run setup:link` 后再用 `lnngfar cocos`。

### 2) 执行 `lnngfar cocos` 报目录冲突

- 原因：目标目录已存在同名文件或目录。
- 处理：切换到空目录执行，或清理冲突文件后重试。

### 3) 初次执行较慢

- 原因：首次安装后会自动构建 TypeScript 产物。
- 处理：属于预期行为，后续重复执行会更快。

## 开发命令

```powershell
npm run lint
npm test
npm run build
```
