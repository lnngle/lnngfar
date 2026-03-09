# oops-game-kit

## 项目简介
`oops-game-kit` 是基于 Oops Framework 的 Cocos Creator 3.x 游戏模板，当前版本已经完成以下工程化建设：
- 启动链路分层与模块边界约束。
- 配置/资源/架构/构建/热更新门禁检查。
- fixtures 样例防回退机制。
- 统一插件更新命令（不再依赖 `.bat` / `.sh`）。

## 快速开始
### 1. 获取项目
```bash
git clone https://gitee.com/dgflash/oops-game-kit.git
```

### 2. 更新插件
```bash
npm run update:framework   # 克隆或更新 oops-plugin-framework
npm run update:hot-update  # 克隆或更新 oops-plugin-hot-update
npm run update:excel       # 克隆或更新 oops-plugin-excel-to-json
npm run update:all         # 一次性更新全部插件
```

### 3. 打开项目
- 在 Cocos Creator 中打开项目根目录。
- 若首次导入异常，建议删除 `temp/` 与 `library/` 后重开。

## 启动与环境
### 启动管线
`Main.ts` 使用阶段化管线：
- `配置预热`
- `模块绑定`
- `GUI 初始化`

### 环境优先级
- `globalThis.LNNGFAR_ENV`
- `oops.storage('env')`
- `assets/resources/config.json` 中的 `type`

支持值：`dev`、`test`、`prod`。

### 调试与性能开关
- Profiler 是否显示由 `DEBUG` 与 `config.<env>.stats` 共同决定。

## 架构边界
### 模块边界
- `assets/script/game/initialize`: 启动、资源预加载、首屏引导。
- `assets/script/game/initialize/view`: 仅做界面编排与流程跳转。
- `assets/script/game/initialize/components`: 可复用展示逻辑（如进度 Presenter）。
- `assets/script/game/initialize/layouts`: 布局级流程控制（如目录加载与状态跟踪）。
- `assets/script/game/account`: 账号域模型与账号界面。
- `assets/script/game/account/view`: 仅做账号界面编排。
- `assets/script/game/account/components`: 账号界面复用展示逻辑。
- `assets/script/game/account/layouts`: 账号界面布局控制逻辑。
- `assets/script/game/common`: 全局配置、类型、工具、单例容器。
- `assets/script/framework`: 对外部框架适配封装。

### 配置分层
- `RuntimeConfigGuards.ts`: 配置结构守卫。
- `RuntimeEnvResolver.ts`: 环境解析策略。
- `RuntimeConfigService.ts`: 配置加载缓存与运行时访问。
- `runtime-config-schema.ts`: 兼容导出门面。

### 资源加载策略
- 启动预加载白名单：当前默认 `common`。
- 目录加载统一支持超时与重试。
- `framework/ResourceLoader.ts` 为统一资源加载入口。

## 目录结构
```text
assets/
    bundle/
        gui/
            screens/      # 业务界面入口资源
            layouts/      # 复用布局资源
            components/   # 可复用组件资源
    resources/
        config.json     # 运行时配置
    script/
        Main.ts
        framework/
        game/
            account/
            common/
            initialize/
```

## 工程命令
### 更新命令
- `npm run update:framework`
- `npm run update:hot-update`
- `npm run update:excel`
- `npm run update:all`

### 测试与质量门禁
- `npm run test`: 执行全量门禁链路。
- `npm run test:unit`: 执行 Node 原生测试。
- `npm run test:coverage`: 覆盖率检查，门禁为：
    - `lines >= 90%`
    - `functions >= 90%`
    - `statements >= 90%`
    - `branches >= 80%`
- `npm run ci`: 类型检查 + 全量测试 + 风格检查。

### 分项门禁
- `npm run check:config`
- `npm run check:config-fixtures`
- `npm run check:config-structure`
- `npm run check:assets`
- `npm run check:assets-fixtures`
- `npm run check:architecture`
- `npm run check:architecture-fixtures`
- `npm run check:builder`
- `npm run check:builder-fixtures`
- `npm run check:hot-update`
- `npm run check:hot-update-fixtures`
- `npm run check:bootstrap`

## 架构门禁规则
`check:architecture` 当前包含：
- `components/layouts` 不允许反向依赖 `view`。
- `account` 域不允许依赖 `initialize` 域。
- `initialize` 域不允许依赖 `account/components`、`account/layouts`、`account/model` 实现层。

## 其他
- `npm run generate:table-types`: 从表数据生成 `generated-tables.d.ts`。
- `npm run typecheck`: 需先由 Creator 生成 `temp/tsconfig.cocos.json`。