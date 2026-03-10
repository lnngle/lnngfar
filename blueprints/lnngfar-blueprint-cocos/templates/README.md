# {{PROJECT_NAME}}

`{{PROJECT_NAME}}` 是通过 [`lnngfar`](https://github.com/lnngle/lnngfar) 生成的 Cocos Creator 3.x 游戏工程模板，默认描述为：`{{PROJECT_DESCRIPTION}}`。

该模板面向“可直接导入 Dashboard 并持续工程化演进”的项目场景，内置以下能力：
- 启动链路分层与模块边界约束。
- 配置、资源、架构、构建、热更新的分项门禁。
- fixtures 样例防回退机制。
- 统一插件同步命令（跨平台，不依赖 `.bat` / `.sh`）。
- `extensions.lock.json` 固定插件提交，确保可复现。
- 内置 `ai/` 多 AI Code 通用技能工作台（可用于 Copilot、Qoder、CodeBuddy、Trae 等）。

## AI Skills 工作台

项目根目录 `ai/` 提供统一的 AI 开发上下文、目录边界策略与 12 个技能模板，用于不同 AI 工具协同开发同一项目。

- 先读：`ai/context/*`
- 再读：`ai/policies/*`
- 选择：`ai/skills/*`
- 复用：`ai/templates/*`

如果生成项目时使用 `--ai-skills no`，该目录不会生成。

## 快速开始

1. 安装依赖。

```bash
npm run install:all
```

2. 同步插件到锁定提交（首次建议执行）。

```bash
npm run sync:extensions
```

3. 在 Cocos Creator 中打开项目根目录。

4. 执行基础门禁，确认工程状态正常。

```bash
npm run test
```

首次导入若出现异常，建议删除 `temp/` 与 `library/` 后重开项目。

## 环境要求

- Node.js 与 npm。
- Git（插件同步依赖 `git clone/fetch/checkout`）。
- Cocos Creator 3.x（模板基线见 `package.json` 中的 `creator.version`）。

## scripts 命令说明（完整）

以下命令与 `package.json` 的 `scripts` 完全一致，可直接复制执行。

| 命令 | 作用 |
| --- | --- |
| `npm run install:all` | 一键安装根目录与 `extensions/*` 下所有子项目依赖。 |
| `npm run typecheck` | 执行类型检查包装脚本（依赖 Cocos 生成的 `temp/tsconfig.cocos.json`）。 |
| `npm run test` | 执行全量门禁链路（配置、资源、架构、构建、热更新、启动、风格）。 |
| `npm run test:unit` | 仅运行工具脚本单元测试 `tests/tools/*.test.js`。 |
| `npm run test:coverage` | 运行工具脚本单测并输出覆盖率报告（`c8`）。 |
| `npm run test:watch` | 以 watch 模式持续执行门禁链路。 |
| `npm run sync:framework` | 按 `extensions.lock.json` 将 `oops-plugin-framework` 同步到固定提交。 |
| `npm run sync:hot-update` | 按 `extensions.lock.json` 将 `oops-plugin-hot-update` 同步到固定提交。 |
| `npm run sync:excel` | 按 `extensions.lock.json` 将 `oops-plugin-excel-to-json` 同步到固定提交。 |
| `npm run sync:extensions` | 按 `extensions.lock.json` 一次性同步全部插件到固定提交。 |
| `npm run bump:framework` | 将 `oops-plugin-framework` 更新到远端最新主干并回写 lock 提交。 |
| `npm run bump:hot-update` | 将 `oops-plugin-hot-update` 更新到远端最新主干并回写 lock 提交。 |
| `npm run bump:excel` | 将 `oops-plugin-excel-to-json` 更新到远端最新主干并回写 lock 提交。 |
| `npm run bump:extensions` | 一次性将全部插件更新到远端最新主干并回写 `extensions.lock.json`。 |
| `npm run check:config` | 检查运行时配置内容合法性。 |
| `npm run check:config-fixtures` | 校验配置门禁 fixtures，防止检查逻辑回退。 |
| `npm run check:config-structure` | 检查运行时配置结构与分层约束。 |
| `npm run check:assets` | 检查资源目录与资源规范。 |
| `npm run check:assets-fixtures` | 校验资源门禁 fixtures。 |
| `npm run check:architecture` | 检查业务模块依赖边界与架构约束。 |
| `npm run check:architecture-fixtures` | 校验架构门禁 fixtures。 |
| `npm run check:builder` | 检查构建变体配置有效性。 |
| `npm run check:builder-fixtures` | 校验构建门禁 fixtures。 |
| `npm run check:hot-update` | 检查热更新清单与版本产物规则。 |
| `npm run check:hot-update-fixtures` | 校验热更新门禁 fixtures。 |
| `npm run check:bootstrap` | 检查启动流程与入口约束。 |
| `npm run generate:table-types` | 从表格数据生成 `generated-tables.d.ts` 类型声明。 |
| `npm run lint` | 执行统一风格检查聚合脚本。 |
| `npm run lint:eslint` | 仅执行 ESLint（`assets/script/**/*.ts`）。 |
| `npm run format:check` | 仅检查格式（Prettier，不自动改写）。 |
| `npm run ci` | CI 聚合命令：`typecheck + test + lint`。 |

## 启动与环境策略

### 启动管线

`Main.ts` 使用阶段化启动流程：
- `配置预热`
- `模块绑定`
- `GUI 初始化`

### 环境优先级

环境值读取优先级如下：
- `globalThis.LNNGFAR_ENV`
- `oops.storage('env')`
- `assets/resources/config.json` 中的 `type`

支持值：`dev`、`test`、`prod`。

### 调试与性能开关

- Profiler 是否显示由 `DEBUG` 与 `config.<env>.stats` 共同决定。

## 工程结构

以下目录结构与当前模板内容对齐，已省略部分 `.meta` 文件：

```text
.c8rc.json                                 # c8 覆盖率阈值与报告配置
.creator/                                  # Creator 工程内部模板目录
    asset-template/                        # Creator 资源创建模板
ai/                                        # 多 AI Code 技能工作台
    context/                               # 项目与架构上下文
    policies/                              # 可改目录、门禁与安全策略
    skills/                                # 12 个可组合开发技能
    templates/                             # 任务卡、测试计划模板
extensions.lock.json                       # 插件提交锁定文件（可复现）
.gitignore                                 # Git 忽略规则
.prettierignore                            # Prettier 忽略规则
assets/                                    # 游戏资源与脚本主目录
    bundle/                                # Asset Bundle 分包资源目录
        common/                            # 公共复用资源分包
        config/                            # 配置资源分包
        game/                              # 玩法资源分包
        gui/                               # UI 资源分包
            components/                    # 可复用 UI 组件资源
            layouts/                       # 界面布局资源
            screens/                       # 业务界面入口资源
        language/                          # 多语言资源分包
    libs/                                  # 第三方或外部导入库资源
    main.scene                             # 项目启动场景
    resources/                             # 动态加载资源根目录
        config.json                        # 运行时环境配置入口
    script/                                # 脚本源码目录
        Main.ts                            # 游戏启动入口脚本
        framework/                         # 对 Oops/Cocos 的封装适配层
            oops.ts                        # Oops 框架统一导出入口
            ResourceLoader.ts              # 统一资源加载器
        game/                              # 业务域代码目录
            account/                       # 账号业务域
            common/                        # 业务公共模块
            initialize/                    # 启动与首屏引导模块
excel/                                     # 表格源数据目录
    Language.xlsx                          # 多语言表示例
extensions/                                # 插件目录（由 sync/bump 命令维护）
    oops-plugin-excel-to-json/             # Excel 转 JSON 插件
    oops-plugin-framework/                 # Oops 主框架插件
    oops-plugin-hot-update/                # 热更新插件
settings/                                  # Creator 工程设置目录
    v2/                                    # Creator v2 结构配置目录
        default-profiles/                  # Creator 默认配置快照（当前可为空）
        packages/                          # Creator 包级配置集合
            builder.json                   # 构建参数配置
            cocos-service.json             # Cocos 服务相关配置
            device.json                    # 设备与调试配置
            engine.json                    # 引擎相关配置
            information.json               # 项目信息配置
            oops-plugin-excel-to-json.json # Excel 插件配置
            program.json                   # 程序运行参数配置
            project.json                   # 项目全局配置
tests/                                     # 测试目录
    tools/                                 # 工具脚本测试目录
        checkers.test.js                   # 门禁检查器相关单测
tools/                                     # 工程化工具与门禁脚本目录
    fixtures/                              # 门禁测试样例目录
        architecture/                      # 架构门禁样例
        assets/                            # 资源门禁样例
        builder/                           # 构建门禁样例
        config/                            # 配置门禁样例
        hot-update/                        # 热更新门禁样例
    check-architecture-fixtures.js         # 架构样例门禁检查
    check-architecture.js                  # 架构依赖边界检查
    check-assets-fixtures.js               # 资源样例门禁检查
    check-assets.js                        # 资源规范检查
    check-builder-fixtures.js              # 构建样例门禁检查
    check-builder-variants.js              # 构建变体配置检查
    check-config-fixtures.js               # 配置样例门禁检查
    check-config.js                        # 运行时配置检查
    check-hot-update-fixtures.js           # 热更新样例门禁检查
    check-hot-update-manifest.js           # 热更新清单检查
    check-main-bootstrap.js                # 启动链路检查
    check-runtime-config-structure.js      # 运行时配置分层检查
    check-style.js                         # 风格检查聚合入口
    generate-table-dts.js                  # 表数据生成 d.ts 声明
    install-all.js                         # 根与插件依赖一键安装脚本
    run-tests.js                           # 全量门禁编排入口
    typecheck.js                           # 类型检查包装脚本
    update-plugins.js                      # 插件同步与锁定版本更新脚本
eslint.config.cjs                          # ESLint 配置
LICENSE                                    # 开源许可证
package.json                               # 依赖与脚本配置
package-lock.json                          # npm 锁文件
prettier.config.cjs                        # Prettier 配置
README.md                                  # 项目说明文档（本文件）
tsconfig.json                              # TypeScript 编译配置
yarn.lock                                  # Yarn 锁文件（兼容保留）
```

## 模块边界约束

`check:architecture` 当前包含以下核心规则：
- `components/layouts` 不允许反向依赖 `view`。
- `account` 域不允许依赖 `initialize` 域。
- `initialize` 域不允许依赖 `account/components`、`account/layouts`、`account/model` 实现层。

## 质量门禁说明

`npm run test` 会按阶段执行门禁链路，覆盖配置、资源、架构、构建、热更新、启动和风格检查。

覆盖率门禁（见 `.c8rc.json`）：
- `lines >= 90%`
- `functions >= 90%`
- `statements >= 90%`
- `branches >= 80%`

## 常见问题

### `npm run typecheck` 显示“跳过类型检查”

`typecheck` 依赖 `temp/tsconfig.cocos.json`。请先在 Cocos Creator 中打开项目，让 Creator 生成该文件后再执行。

### 插件更新失败

请检查：
- 本机是否安装并可用 `git`。
- 网络是否可访问插件仓库。
- `extensions/` 目录是否有写权限。

### 插件目录存在但没有 `.git`

`sync` 命令会保留该目录现有内容并跳过 Git 操作，仅执行依赖安装。若要启用提交级锁定能力，请删除该目录后重新执行 `npm run sync:extensions`，让脚本重新克隆仓库。

### 首次导入项目异常

删除 `temp/` 与 `library/` 后重新打开项目，再执行一次 `npm run test` 验证环境。
