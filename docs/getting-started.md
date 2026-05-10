# lnngfar 快速开始指南

> 版本：v0.1.0  
> 日期：2026-05-10  
> 状态：规划中（CLI 待开发）

---

## 一、环境要求

### 1.1 前置依赖

| 依赖 | 版本要求 | 说明 |
|------|----------|------|
| Node.js | >= 18.0.0 | CLI 运行基础 |
| npm / pnpm / yarn | 最新版 | 包管理器 |
| Java | >= 17 | 后端开发（可选） |
| Git | >= 2.30 | 版本控制 |

### 1.2 安装检查

```bash
# 检查 Node.js 版本
node --version
# >= v18.0.0

# 检查 npm 版本
npm --version
# >= 9.0.0

# 检查 Git 版本
git --version
# >= 2.30.0
```

---

## 二、安装 lnngfar CLI

### 2.1 全局安装（待实现）

```bash
# 使用 npm 安装
npm install -g @lnngfar/cli

# 或使用 pnpm 安装
pnpm add -g @lnngfar/cli

# 验证安装
lnngfar --version
```

### 2.2 开发版本安装（待实现）

```bash
# 从 GitHub 安装最新开发版
npm install -g @lnngfar/cli@next

# 或从源码安装
git clone https://github.com/lnngfar/lnngfar.git
cd lnngfar
npm install
npm link
```

---

## 三、创建新项目

### 3.1 创建 Web 项目（待实现）

```bash
# 创建项目（交互式）
lnngfar create my-web-project

# 或指定技术栈
lnngfar create my-web-project --stack web

# 创建并进入目录
cd my-web-project
```

### 3.2 创建 uni-app 项目（待实现）

```bash
# 创建 uni-app 项目
lnngfar create my-uniapp-project --stack uniapp

# 进入目录
cd my-uniapp-project
```

---

## 四、项目结构概览

### 4.1 创建后的目录结构

```
my-web-project/
│
├── src/                    # 源代码
│   ├── modules/           # 业务模块（按规范）
│   │   └── README.md      # 模块说明
│   ├── shared/            # 共享资源
│   └── ...
│
├── .ai/                   # AI 上下文（核心）
│   ├── architecture.md
│   ├── module-map.md
│   └── context.md
│
├── specs/                 # 规范文档（核心）
│   ├── product.md
│   ├── entities.md
│   ├── api.md
│   └── ui.md
│
├── skills/                # 技能配置
│   └── crud.yaml
│
├── prompts/               # Prompt 库
│   ├── architect/
│   ├── backend/
│   └── frontend/
│
├── tests/                 # 测试
├── scripts/               # 脚本
├── docs/                  # 文档
│
├── package.json
├── tsconfig.json
├── vite.config.ts
│
└── README.md
```

### 4.2 核心目录说明

| 目录 | 说明 | 重要性 |
|------|------|--------|
| `.ai/` | AI 上下文目录 | ⭐⭐⭐ 核心 |
| `specs/` | 规范文档目录 | ⭐⭐⭐ 核心 |
| `skills/` | 技能配置 | ⭐⭐ 重要 |
| `prompts/` | Prompt 模板 | ⭐⭐ 重要 |
| `src/modules/` | 业务模块 | ⭐⭐⭐ 核心 |
| `src/shared/` | 共享资源 | ⭐⭐ 重要 |

---

## 五、常用命令

### 5.1 项目管理（待实现）

```bash
# 列出可用模板
lnngfar list

# 列出可用技能
lnngfar skill list

# 添加新模块
lnngfar add module-name

# 查看项目信息
lnngfar info
```

### 5.2 规范管理（待实现）

```bash
# 初始化规范
lnngfar spec init

# 添加规范文档
lnngfar spec add entities

# 查看规范状态
lnngfar spec status
```

### 5.3 开发命令（待实现）

```bash
# 安装依赖
pnpm install

# 开发模式
lnngfar dev

# 构建生产版本
lnngfar build

# 运行测试
lnngfar test

# 代码检查
lnngfar lint
```

### 5.4 AI 开发（待实现）

```bash
# AI 执行任务
lnngfar ai "添加用户管理模块"

# 查看当前上下文
lnngfar ai context

# AI 代码审查
lnngfar ai review

# AI 解释代码
lnngfar ai explain src/modules/user
```

### 5.5 修复命令（待实现）

```bash
# 自动修复问题
lnngfar repair

# 分析问题
lnngfar repair analyze

# 执行修复
lnngfar repair fix
```

---

## 六、开发工作流

### 6.1 日常开发流程

```
1. 查看当前任务
   lnngfar ai context

2. 开始开发
   打开 src/modules/your-module/

3. 编写代码
   - types/      # 先定义类型
   - api/       # 再实现接口
   - components/ # 最后实现组件

4. 运行测试
   lnngfar test

5. 提交代码
   git add .
   git commit -m "feat: add xxx"
```

### 6.2 AI 辅助开发流程

```
1. 描述需求
   lnngfar ai "添加订单列表页面，需要分页和筛选"

2. AI 生成代码
   - 阅读 specs/ 规范
   - 遵循 .ai/ 上下文
   - 生成符合规范的代码

3. 代码审查
   lnngfar ai review

4. 如有问题
   lnngfar repair
```

---

## 七、规范开发

### 7.1 Spec First 工作流

```markdown
需求 → spec → code

1. 编写产品规范 (specs/product.md)
2. 编写实体规范 (specs/entities.md)
3. 编写 API 规范 (specs/api.md)
4. 编写 UI 规范 (specs/ui.md)
5. AI 基于规范生成代码
```

### 7.2 规范示例

```markdown
<!-- specs/entities.md -->

# 实体规范

## User（用户）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | Long | 是 | 用户ID |
| username | String | 是 | 用户名 |
| email | String | 是 | 邮箱 |
| phone | String | 否 | 手机号 |
| status | Enum | 是 | 状态：ACTIVE/INACTIVE |

## Order（订单）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | Long | 是 | 订单ID |
| userId | Long | 是 | 用户ID |
| amount | Decimal | 是 | 订单金额 |
| status | Enum | 是 | 状态 |
```

---

## 八、模块开发规范

### 8.1 新建模块

```
src/modules/
└── your-module/
    ├── README.md           # 必须：模块说明
    ├── types/              # 必须：类型定义
    │   ├── index.ts
    │   └── your-module.types.ts
    ├── api/                # 必须：接口实现
    │   └── your-api.ts
    ├── store/              # 可选：状态管理
    │   └── your-store.ts
    ├── components/         # 可选：组件
    │   └── YourComponent.vue
    └── tests/             # 必须：测试
        └── your-module.test.ts
```

### 8.2 模块 README 模板

```markdown
# {Module Name} 模块

## 功能说明

简要描述模块的功能。

## API 接口

| 接口 | 方法 | 说明 |
|------|------|------|
| /api/xxx | GET | 获取列表 |

## 依赖

- shared (必须)

## 状态

- {storeName} - 状态管理
```

---

## 九、常见问题

### 9.1 Q&A

**Q: 如何添加新的业务模块？**

```bash
lnngfar add order
```

**Q: 如何更新现有模块？**

```bash
# 编辑 specs/ 规范
# 运行 AI 更新
lnngfar ai "更新订单模块"
```

**Q: 如何处理编译错误？**

```bash
# 自动修复
lnngfar repair

# 手动查看错误
lnngfar build
```

**Q: 如何导出项目配置？**

```bash
lnngfar export > project-config.json
```

---

## 十、下一步

- 📖 阅读 [产品设计文档](./product-design.md)
- 📖 阅读 [目录结构规范](./directory-structure.md)
- 📖 阅读 [开发路线图](./roadmap.md)
- 📖 关注 [官方 GitHub](https://github.com/lnngfar/lnngfar)

---

## 版本历史

| 版本 | 日期 | 变更 |
|------|------|------|
| v0.1.0 | 2026-05-10 | 初稿完成 |
