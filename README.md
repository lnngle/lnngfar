# lnngfar

lnngfar 是一个 Blueprint 驱动的代码生成器内核。

## 当前状态

- 已内置 `lnngfar-blueprint-cocos`，可生成完整小游戏项目骨架。
- 生成流程固定为：环境校验 -> Blueprint 发现加载 -> Blueprint 校验 -> 生成执行 -> 测试执行。

## 核心边界

- 核心只负责：CLI 调度、Blueprint 发现、Blueprint 校验、Blueprint 执行。
- 技术栈能力由 Blueprint 提供，不内置在核心。
- 默认输出目录是当前工作目录下的“项目名子目录”，存在冲突文件或目录时直接失败。
- 执行生成命令时会有英文交互输入项目名；直接回车使用默认值。

## 环境要求

- Node.js >= 18 LTS
- npm >= 9

## 安装与命令可用性

### 方式 A：仓库开发态（推荐）

执行 `npm install` 后会自动构建 CLI。为避免与仓库文件冲突，请在目标空目录执行，并通过 `--prefix` 指向仓库：

```powershell
# 在 lnngfar 仓库根目录
npm install

# 切换到目标空目录（示例）
mkdir ..\demo-cocos-game
cd ..\demo-cocos-game

npx --prefix ..\lnngfar --no-install lnngfar cocos
# 或
npm exec --prefix ..\lnngfar -- lnngfar cocos
```

命令执行时会出现英文交互提示，例如：

```text
Enter project name (default: cocos-project):
```

默认项目名规则：`<blueprint后缀>-project`。
例如 `lnngfar-blueprint-cocos` 的后缀为 `cocos`，默认项目名即 `cocos-project`。

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

若直接回车不输入，默认使用 `cocos-project` 作为项目名。

最终生成目录示例：`<当前目录>/cocos-project`。

生成后将包含完整小游戏骨架，例如：

- `package.json`（包含 `creator.version`）
- `settings/v2/packages/project.json`
- `settings/v2/packages/program.json`
- `settings/v2/packages/builder.json`
- `assets/main.scene`
- `assets/script/Main.ts`

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

### 3) 交互输入项目名时输错格式

- 原因：项目名仅允许字母、数字、`-`、`_`。
- 处理：按提示重新输入；若多次输入非法，将自动回退默认项目名。

### 4) 导入 Cocos Creator Dashboard 提示“缺失编辑器”

- 原因：本机未安装模板指定的 Creator 版本，或 `package.json` 中 `creator.version` 与本机版本不一致。
- 处理：安装匹配版本，或将 `package.json` 的 `creator.version` 修改为本机已安装版本后重新导入。
- 可选：生成前设置环境变量 `LNNGFAR_COCOS_CREATOR_VERSION=3.x.y`，让模板按指定版本生成。

### 5) 初次执行较慢

- 原因：首次安装后会自动构建 TypeScript 产物。
- 处理：属于预期行为，后续重复执行会更快。

## 开发命令

```powershell
npm run lint
npm test
npm run build
```
