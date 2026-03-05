# Quickstart：lnngfar v1 验证流程

## 1. 前置条件

- 操作系统：Windows/macOS/Linux
- Node.js：`>= 18 LTS`
- 在仓库根目录执行命令：`D:\github\lnngfar`

## 2. 安装依赖

```powershell
npm install
```

说明：安装后会自动构建 CLI，可直接用 `npx` 或 `npm exec` 调用。

## 3. 运行核心测试

```powershell
npm test
```

期望：核心测试全部通过。

## 4. 验证 Blueprint 发现与校验

### 正常路径

```powershell
npx --no-install lnngfar cocos
# 或
npm exec -- lnngfar cocos
```

若需要全局命令：

```powershell
npm run setup:link
lnngfar cocos
```

期望：
- 按固定阶段输出执行进度
- 生成完整小游戏工程脚手架（含项目配置、资源配置、玩法循环、平台适配、UI 与测试）
- 执行 Blueprint 自身测试并通过

关键文件检查（示例）：
- `README.md`
- `assets/resources/config/game-config.json`
- `assets/scripts/core/GameApp.ts`
- `assets/scripts/gameplay/GameLoop.ts`
- `assets/scripts/platform/MiniGamePlatformAdapter.ts`
- `tests/game-loop.spec.ts`

### 异常路径 1：未知 Blueprint

```powershell
lnngfar unknown
```

期望：
- 失败阶段为 `blueprint`
- 输出可用 Blueprint 列表

### 异常路径 2：目录冲突

在非空目录（存在任意冲突文件或目录）执行：

```powershell
lnngfar cocos
```

期望：
- 失败阶段为 `generation`
- 输出“在空目录执行或先清理冲突文件后重试”建议

## 5. 确定性验证

1. 在两个全新空目录分别执行 `lnngfar cocos`。
2. 对比产物目录结构与文件内容（忽略无业务意义的本地临时文件）。

期望：两次产物一致。

## 6. 第三方 Blueprint 扩展验证

1. 新增一个符合 `lnngfar-blueprint-*` 命名与结构规范的本地依赖 Blueprint。
2. 重新安装依赖并执行对应命令。

期望：
- 不修改核心代码即可被发现并执行。
- 若 manifest/结构不合规，明确在 `blueprint` 阶段失败。
