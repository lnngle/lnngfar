# lnngfar 目录结构规范

> 版本：v0.1.0  
> 日期：2026-05-10  

---

## 一、设计原则

### 1.1 核心目标

```
┌─────────────────────────────────────────────────────────────┐
│                    目录结构设计目标                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. AI 可理解                                               │
│     └── AI 能快速理解项目结构                                │
│                                                             │
│  2. 技术栈统一                                              │
│     └── Web、uni-app 等技术栈遵循相同思想                    │
│                                                             │
│  3. 模块化清晰                                              │
│     └── 每个业务模块独立完整                                  │
│                                                             │
│  4. 协作一致                                                │
│     └── 团队成员遵循统一规范                                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 关键原则

| 原则 | 说明 |
|------|------|
| **小模块** | 避免大型单体，每个模块独立完整 |
| **有文档** | 每个模块必须有 README.md |
| **类型安全** | types/ 目录定义所有类型 |
| **AI 上下文** | .ai/ 目录存放 AI 上下文文件 |

---

## 二、标准目录结构

### 2.1 完整项目结构

```
project/
│
├── src/                           # 源代码目录
│   │
│   ├── modules/                   # 【核心】业务模块
│   │   │
│   │   ├── user/                 # 示例：用户模块
│   │   │   │
│   │   │   ├── README.md         # 模块说明文档
│   │   │   │
│   │   │   ├── types/            # 类型定义
│   │   │   │   ├── index.ts      # 类型导出入口
│   │   │   │   ├── user.types.ts # 用户类型定义
│   │   │   │   ├── user.api.ts   # API 类型定义
│   │   │   │   └── user.events.ts # 事件类型定义
│   │   │   │
│   │   │   ├── api/              # 接口层（后端：Controller/Service）
│   │   │   │   ├── user.controller.ts
│   │   │   │   ├── user.service.ts
│   │   │   │   └── user.mapper.ts
│   │   │   │
│   │   │   ├── store/            # 状态管理（前端：Store/Pinia）
│   │   │   │   ├── user.store.ts
│   │   │   │   └── user.types.ts  # Store 类型
│   │   │   │
│   │   │   ├── components/       # UI 组件
│   │   │   │   ├── UserList.vue
│   │   │   │   ├── UserForm.vue
│   │   │   │   └── UserCard.vue
│   │   │   │
│   │   │   ├── pages/             # 页面（可选）
│   │   │   │   ├── UserListPage.vue
│   │   │   │   └── UserDetailPage.vue
│   │   │   │
│   │   │   ├── hooks/             # 组合式函数（可选）
│   │   │   │   └── useUser.ts
│   │   │   │
│   │   │   └── tests/             # 模块测试
│   │   │       ├── user.test.ts
│   │   │       ├── user.service.test.ts
│   │   │       └── user.e2e.ts
│   │   │
│   │   ├── order/                 # 示例：订单模块
│   │   │   ├── types/
│   │   │   ├── api/
│   │   │   ├── store/
│   │   │   ├── components/
│   │   │   └── tests/
│   │   │
│   │   └── inventory/             # 示例：库存模块
│   │       ├── ...
│   │
│   ├── shared/                    # 共享/公共模块
│   │   │
│   │   ├── components/           # 通用组件
│   │   │   ├── Button.vue
│   │   │   ├── Table.vue
│   │   │   ├── Modal.vue
│   │   │   └── index.ts
│   │   │
│   │   ├── hooks/                # 通用组合式函数
│   │   │   ├── useRequest.ts
│   │   │   ├── usePagination.ts
│   │   │   └── useForm.ts
│   │   │
│   │   ├── utils/                # 工具函数
│   │   │   ├── format.ts
│   │   │   ├── validate.ts
│   │   │   └── storage.ts
│   │   │
│   │   ├── constants/            # 常量定义
│   │   │   ├── app.ts
│   │   │   ├── api.ts
│   │   │   └── storage.ts
│   │   │
│   │   ├── types/                # 公共类型
│   │   │   ├── api.types.ts
│   │   │   ├── response.types.ts
│   │   │   └── index.ts
│   │   │
│   │   └── styles/               # 全局样式
│   │       ├── variables.scss
│   │       └── mixins.scss
│   │
│   ├── config/                   # 配置目录
│   │   ├── index.ts
│   │   ├── dev.ts
│   │   └── prod.ts
│   │
│   ├── router/                   # 路由配置
│   │   ├── index.ts
│   │   ├── routes.ts
│   │   └── guards.ts
│   │
│   ├── App.vue                   # 根组件
│   └── main.ts                   # 入口文件
│
├── public/                       # 静态资源
│   ├── favicon.ico
│   └── images/
│
├── .ai/                         # 【核心】AI 上下文目录
│   │
│   ├── architecture.md          # 项目架构说明
│   │                            # - 系统架构图
│   │                            # - 模块关系图
│   │                            # - 技术选型说明
│   │
│   ├── module-map.md            # 模块地图
│   │                            # - 模块依赖关系
│   │                            # - 接口契约
│   │                            # - 共享模块说明
│   │
│   ├── decisions.md             # 技术决策记录
│   │                            # - ADR (Architecture Decision Records)
│   │                            # - 决策原因和影响
│   │
│   ├── context.md               # 当前任务上下文
│   │                            # - 当前开发任务
│   │                            # - 最近变更
│   │                            # - 待处理事项
│   │
│   ├── memory/                   # AI 记忆目录
│   │   │   ├── sessions/       # 对话会话记录
│   │   │   ├── patterns/       # 识别的代码模式
│   │   │   └── learnings/      # 学习的业务知识
│   │
│   └── prompts/                 # 项目级 Prompt 模板
│       ├── task-template.md
│       └── review-template.md
│
├── specs/                       # 【核心】规范文档目录
│   │
│   ├── product.md               # 产品规范
│   │                            # - 产品愿景
│   │                            # - 目标用户
│   │                            # - 核心功能
│   │                            # - 成功标准
│   │
│   ├── entities.md              # 实体规范
│   │                            # - 领域模型
│   │                            # - 实体定义
│   │                            # - 关系图
│   │                            # - 约束规则
│   │
│   ├── api.md                   # API 规范
│   │                            # - 接口列表
│   │                            # - 请求/响应格式
│   │                            # - 错误码定义
│   │                            # - 认证方式
│   │
│   ├── ui.md                    # UI 规范
│   │                            # - 页面结构
│   │                            # - 交互流程
│   │                            # - 状态设计
│   │                            # - 响应式规则
│   │
│   └── flows.md                 # 流程规范
│       ├── business-flows.md    # 业务流程
│       ├── approval-flows.md    # 审批流程
│       └── system-flows.md      # 系统流程
│
├── skills/                      # 【核心】技能配置目录
│   │
│   ├── crud.yaml                # CRUD 技能配置
│   ├── auth.yaml                # 认证技能配置
│   ├── upload.yaml              # 上传技能配置
│   │
│   └── custom/                  # 自定义技能
│       └── my-skill.yaml
│
├── prompts/                     # 【核心】Prompt 库
│   │
│   ├── architect/                # 架构设计提示词
│   │   ├── system-prompt.md
│   │   ├── design-patterns.md
│   │   └── review-checklist.md
│   │
│   ├── backend/                  # 后端开发提示词
│   │   ├── entity-generation.md
│   │   ├── service-generation.md
│   │   └── api-documentation.md
│   │
│   ├── frontend/                 # 前端开发提示词
│   │   ├── component-generation.md
│   │   ├── page-generation.md
│   │   └── state-management.md
│   │
│   └── repair/                   # 修复提示词
│       ├── bug-analysis.md
│       ├── error-fix.md
│       └── test-fix.md
│
├── tests/                       # E2E 测试目录
│   ├── e2e/
│   │   ├── setup.ts
│   │   ├── user.spec.ts
│   │   └── order.spec.ts
│   │
│   └── reports/                  # 测试报告
│
├── scripts/                     # 脚本目录
│   ├── build.sh
│   ├── deploy.sh
│   └── db-migration.sh
│
├── docs/                        # 文档目录
│   ├── api/                     # API 文档
│   ├── dev-guide/               # 开发指南
│   └── deployment/              # 部署文档
│
├── .env                         # 环境变量（本地）
├── .env.example                 # 环境变量示例
├── .env.production              # 生产环境变量
│
├── package.json                 # 项目依赖
├── tsconfig.json               # TypeScript 配置
├── vite.config.ts              # Vite 配置
├── .gitignore                  # Git 忽略配置
├── .editorconfig               # 编辑器配置
├── .prettierrc                 # 代码格式化配置
├── .eslintrc                   # 代码检查配置
│
└── README.md                    # 项目说明
```

---

## 三、Web 项目结构（Vue3 + Spring Boot）

### 3.1 前端目录结构

```
web-frontend/
│
├── src/
│   ├── api/                     # API 请求层（替代 store/api）
│   │   ├── request.ts          # Axios 实例配置
│   │   ├── user.api.ts
│   │   ├── order.api.ts
│   │   └── index.ts
│   │
│   ├── modules/                # 业务模块
│   │   ├── user/
│   │   │   ├── types/
│   │   │   ├── api/
│   │   │   ├── store/
│   │   │   ├── components/
│   │   │   └── tests/
│   │   │
│   │   └── order/
│   │       └── ...
│   │
│   ├── shared/                 # 共享资源
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── constants/
│   │   └── types/
│   │
│   ├── router/
│   ├── App.vue
│   └── main.ts
│
├── .ai/
├── specs/
├── skills/
├── prompts/
│
└── package.json
```

### 3.2 后端目录结构

```
web-backend/
│
├── src/
│   ├── main/
│   │   ├── java/com/example/
│   │   │   │
│   │   │   ├── modules/         # 业务模块
│   │   │   │   ├── user/
│   │   │   │   │   ├── types/   # DTO/VO
│   │   │   │   │   ├── controller/
│   │   │   │   │   ├── service/
│   │   │   │   │   ├── mapper/
│   │   │   │   │   ├── entity/
│   │   │   │   │   └── UserApplication.java
│   │   │   │   │
│   │   │   │   └── order/
│   │   │   │       └── ...
│   │   │   │
│   │   │   ├── shared/          # 共享模块
│   │   │   │   ├── config/
│   │   │   │   ├── common/
│   │   │   │   ├── exception/
│   │   │   │   ├── security/
│   │   │   │   └── utils/
│   │   │   │
│   │   │   └── Application.java
│   │   │
│   │   └── resources/
│   │       ├── mapper/          # MyBatis XML
│   │       ├── application.yml
│   │       └── logback-spring.xml
│   │
│   └── test/
│       └── java/
│
├── .ai/
├── specs/
├── skills/
├── prompts/
│
├── pom.xml
└── README.md
```

---

## 四、uni-app 项目结构

### 4.1 目录结构

```
uniapp-project/
│
├── src/
│   ├── pages/                   # 页面
│   │   ├── user/
│   │   │   ├── user-list.vue
│   │   │   └── user-detail.vue
│   │   │
│   │   └── order/
│   │       └── ...
│   │
│   ├── modules/                # 【核心】业务模块
│   │   │
│   │   ├── user/               # 用户模块
│   │   │   ├── README.md
│   │   │   ├── types/          # 类型定义
│   │   │   │   ├── user.types.ts
│   │   │   │   └── user.api.ts
│   │   │   ├── api/            # API 调用
│   │   │   │   └── user.ts
│   │   │   ├── store/          # Store
│   │   │   │   └── user.ts
│   │   │   ├── components/     # 组件
│   │   │   │   ├── user-card.vue
│   │   │   │   └── user-form.vue
│   │   │   ├── pages/          # 页面
│   │   │   │   ├── user-list.vue
│   │   │   │   └── user-detail.vue
│   │   │   └── tests/
│   │   │
│   │   └── order/
│   │       └── ...
│   │
│   ├── static/                 # 静态资源
│   │
│   ├── uni_modules/           # uni-ui 组件
│   │
│   ├── shared/                 # 共享资源
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── constants/
│   │
│   ├── App.vue
│   ├── main.ts
│   ├── manifest.json
│   ├── pages.json
│   └── uni.scss
│
├── .ai/                        # 【核心】AI 上下文
├── specs/                      # 【核心】规范文档
├── skills/                     # 【核心】技能配置
├── prompts/                    # 【核心】Prompt 库
│
├── package.json
├── tsconfig.json
├── vite.config.ts
│
└── README.md
```

### 4.2 uni-app 模块示例

```
modules/user/
├── README.md              # 模块说明
│
├── types/
│   ├── index.ts           # 统一导出
│   ├── user.types.ts      # 用户类型
│   │   ├── User           # 用户实体
│   │   ├── UserQuery      # 查询参数
│   │   └── UserForm       # 表单数据
│   │
│   └── user.api.ts        # API 类型
│       ├── UserApiRes
│       └── UserApiReq
│
├── api/
│   ├── index.ts           # API 统一导出
│   └── user.ts            # 用户 API
│       ├── getUserList()
│       ├── getUserDetail()
│       ├── createUser()
│       ├── updateUser()
│       └── deleteUser()
│
├── store/
│   ├── index.ts
│   └── user.ts            # Pinia Store
│       ├── userList
│       ├── userDetail
│       ├── getUserList()
│       └── ...
│
├── components/            # 模块组件
│   ├── user-card.vue      # 用户卡片
│   ├── user-form.vue      # 用户表单
│   ├── user-avatar.vue    # 用户头像
│   └── user-selector.vue  # 用户选择器
│
├── pages/                 # 模块页面
│   ├── user-list.vue      # 用户列表页
│   ├── user-detail.vue    # 用户详情页
│   └── user-form.vue      # 用户编辑页
│
└── tests/                 # 模块测试
    ├── user.test.ts
    └── user.e2e.ts
```

---

## 五、模块 README 模板

### 5.1 模块 README.md

```markdown
# {Module Name} 模块

## 模块概述

简要描述模块的职责和功能。

## 核心能力

- [ ] 能力1
- [ ] 能力2
- [ ] 能力3

## 实体模型

| 实体 | 说明 | 主键 |
|------|------|------|
| User | 用户信息 | id |

## API 接口

| 接口 | 方法 | 说明 |
|------|------|------|
| /api/users | GET | 获取用户列表 |
| /api/users/:id | GET | 获取用户详情 |
| /api/users | POST | 创建用户 |
| /api/users/:id | PUT | 更新用户 |
| /api/users/:id | DELETE | 删除用户 |

## 依赖模块

- shared (必须)

## 被依赖模块

- order (可选)

## 状态管理

- `userStore` - 用户状态管理

## 路由

- `/user/list` - 用户列表页
- `/user/detail/:id` - 用户详情页

## 注意事项

- 暂无

## 更新日志

| 日期 | 版本 | 变更 |
|------|------|------|
| 2026-05-10 | v1.0.0 | 初始版本 |
```

---

## 六、验证清单

### 6.1 目录结构检查

```
✓ 新建模块是否遵循统一结构
✓ types/ 是否定义了所有类型
✓ 每个模块是否有 README.md
✓ .ai/ 目录是否包含必要文件
✓ specs/ 目录是否包含所有规范
```

### 6.2 AI 上下文检查

```
✓ .ai/architecture.md 是否存在
✓ .ai/module-map.md 是否存在
✓ .ai/decisions.md 是否记录技术决策
✓ .ai/context.md 是否为当前任务
```

### 6.3 规范文档检查

```
✓ specs/product.md 是否存在
✓ specs/entities.md 是否存在
✓ specs/api.md 是否存在
✓ specs/ui.md 是否存在
✓ specs/flows.md 是否存在
```

---

## 七、版本历史

| 版本 | 日期 | 变更 |
|------|------|------|
| v0.1.0 | 2026-05-10 | 初稿完成 |
