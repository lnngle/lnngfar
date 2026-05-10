# lnngfar 详细产品设计

> 版本：v2.2  
> 日期：2026-05-10

---

# 一、产品概述

## 1.1 产品名称

lnngfar

## 1.2 产品定位

lnngfar = 基于 spec-kit 的 AI 软件工程运行时与工业化平台。
spec-kit：https://github.com/github/spec-kit

lnngfar 的核心目标：

- 通过「工业模板 + AI 智能」实现真实项目开发
- 通过 spec-kit 实现 AI 可持续演化的软件工程体系
- 通过 Stack 插件化形成长期生态能力
- 通过测试优先保障 AI 生成代码质量
- 通过生命周期管理实现真实项目长期维护

lnngfar 不是简单代码生成器。

lnngfar 是：

- AI 工程系统
- AI 软件工厂基础设施
- AI 软件工业化平台
- spec-kit runtime

## 1.3 lnngfar CLI 自身技术栈

| 组件 | 技术 | 说明 |
|------|------|------|
| CLI 运行时 | Node.js 20+ / TypeScript | 跨平台，npm 分发 |
| 包管理 | npm | `npm install -g lnngfar` |
| 模板引擎 | Handlebars / EJS | 模板渲染 |
| 配置解析 | js-yaml | YAML 配置解析 |
| 交互界面 | Inquirer.js | 命令行交互 |

---

## 1.4 核心交互流程

一个完整的开发流程示例：

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                         lnngfar 完整交互流程                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. 项目初始化                                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  $ lnngfar init                                                     │   │
│  │  ? 项目名称: my-app                                                 │   │
│  │  ? 选择 Stack: far-web-java                                         │   │
│  │  ? 选择初始模板: vue-admin                                          │   │
│  │  ? AI 模型: deepseek                                                │   │
│  │  ✓ 项目创建完成                                                     │   │
│  │  ✓ 生成目录结构、project.yml、specs/、tests/、deploy/               │   │
│  │  ✓ spec-kit 集成完成                                                │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│           │                                                                 │
│           ▼                                                                 │
│  2. 编辑规范                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  $ vim specs/product/user.md   # 编辑需求文档                       │   │
│  │  $ lnngfar spec parse          # Spec Engine 解析 specs             │   │
│  │  ✓ 实体识别: User, Role, Permission                                │   │
│  │  ✓ 关系识别: User N:M Role, Role N:M Permission                    │   │
│  │  ✓ 上下文更新: .lnngfar/ai/context.md                               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│           │                                                                 │
│           ▼                                                                 │
│  3. AI 增量开发                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  $ lnngfar ai "基于 specs/product/user.md 生成用户管理模块"         │   │
│  │                                                                     │   │
│  │  AI Runtime 工作流程:                                                │   │
│  │  ├─ Step 1: 上下文收集 (读取 specs/stack/.lnngfar)                  │   │
│  │  ├─ Step 2: Stack 加载 (匹配模板+技能)                              │   │
│  │  ├─ Step 3: Prompt 编排 (组合 system+specs+skills+templates)         │   │
│  │  ├─ Step 4.1: 生成测试 (单元测试) → 验证 ✅                          │   │
│  │  ├─ Step 4.2: 生成代码 (后端+前端)                                   │   │
│  │  ├─ Step 4.3: 运行全部测试 → 验证 ✅                                 │   │
│  │  └─ Step 5: 上下文更新 (更新 specs 状态)                             │   │
│  │                                                                     │   │
│  │  ✓ 后端: UserController, UserService, UserMapper                   │   │
│  │  ✓ 前端: UserList.vue, UserForm.vue                                 │   │
│  │  ✓ 测试: UserServiceTest, UserApiTest                               │   │
│  │  ✓ specs/product/user.md 更新为完成状态                              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│           │                                                                 │
│           ▼                                                                 │
│  4. 验证                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  $ lnngfar verify                                                  │   │
│  │  ✓ lint 通过                                                        │   │
│  │  ✓ unit test 通过 (13/13)                                           │   │
│  │  ✓ api test 通过 (8/8)                                             │   │
│  │  ✓ e2e test 通过 (5/5)                                             │   │
│  │  ✓ security scan 通过                                               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│           │                                                                 │
│           ▼                                                                 │
│  5. 部署                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  $ lnngfar deploy                                                  │   │
│  │  ✓ Docker 镜像构建完成                                             │   │
│  │  ✓ Docker Compose 启动                                              │   │
│  │  ✓ 健康检查通过: http://localhost:8080                              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  [可选] 持续开发:                                                            │
│   修改 specs → lnngfar ai --revise → lnngfar verify → lnngfar deploy       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

# 二、产品核心理念

## 2.1 Spec First

所有项目：

```text
需求
→ specs
→ tests (先生成单元测试)
→ implementation (再生成代码实现)
→ verify (运行全部测试)
→ deploy
```

不是：

```text
prompt → code
```

spec 是整个 AI 工程系统的核心。

spec 不只是文档。

spec 是：

- AI 长期记忆
- 工程上下文
- 架构约束
- 测试依据
- 生命周期基础

---

## 2.2 工业模板 + AI 智能

核心公式：

```text
工业模板（稳定）
+
AI 智能（变化）
=
低 Token 成本的持续开发
```

工业模板负责：

- 稳定架构
- 固定最佳实践
- 固定测试结构
- 固定部署结构
- 固定目录结构

AI 负责：

- 业务逻辑
- 增量演化
- 复杂业务生成
- 代码优化
- 测试补全

目标：

- 降低 Token 成本
- 降低 AI 漂移
- 提高稳定性
- 提高长期维护能力

---

## 2.3 Test First

lnngfar 所有项目必须：

```text
spec → tests → implementation
```

测试策略区分两种场景：

| 场景 | 策略 | 说明 |
|------|------|------|
| **模板生成**（CRUD/登录/RBAC） | 测试模板随代码模板一起生成 | 模板自带测试，init 时已通过验证 |
| **AI 增量生成**（业务逻辑） | 先生成单元测试 → 审查通过 → 再生成代码 → 运行全部测试 | E2E 测试需服务器运行，在代码部署后验证 |

**E2E 测试的定位**：E2E 测试在 `lnngfar verify` 阶段运行（此时服务器已在运行），不在代码生成阶段运行。代码生成阶段先生成单元测试和 API 测试作为"契约"，E2E 测试在后续验证阶段作为"集成验证"。

### 意图识别

AI Runtime 根据用户输入自动判断生成模式：

| 用户输入示例 | 识别模式 | 流程 |
|-------------|----------|------|
| "生成订单模块" | **新建模块** | 全流程：收集上下文 → 生成测试 → 生成代码 → 验证 |
| "修改用户登录逻辑" | **修改已有** | 增量：加载已有关联 spec → 只修改 diff |
| "给设备表增加位置字段" | **增量修改** | Entity+DML+DTO+前端表单 增量 |
| "优化设备查询性能" | **代码优化** | 只修改指定文件，保留行为不变 |
| "重构订单服务" | **重构已有** | 先生成新测试 → 重构代码 → 原测试必须全部通过 |

---

## 2.4 Stack 插件化

stack = 基于 spec-kit 的工程能力插件。

stack 不只是技术栈。

stack 是：

- specs
- templates
- skills
- tests
- deploy
- runtime
- workflows

的组合。

---

## 2.5 spec-kit 集成方式

lnngfar 深度集成 GitHub spec-kit，复用并扩展其核心能力：

```text
┌─────────────────────────────────────────────────────────────┐
│                    spec-kit 原生能力                         │
├─────────────────────────────────────────────────────────────┤
│  constitution      → 项目核心原则与约束                       │
│  specify           → 需求到规范的转换                         │
│  plan              → 开发计划与任务拆解                       │
│  tasks             → 任务分解与追踪                           │
│  hooks             → 生命周期钩子                             │
│  extensions        → 扩展点机制                              │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   lnngfar 扩展能力                           │
├─────────────────────────────────────────────────────────────┤
│  Stack Spec        → 技术栈级别 spec（复用 constitution）     │
│  Template Engine   → 工业模板系统（复用 hooks）               │
│  Skill Engine      → AI 技能引擎（复用 extensions）           │
│  AI Runtime        → Prompt 编排 + Context 裁剪              │
│  Lifecycle Engine  → 全生命周期（扩展 hooks 链）              │
│  Verify Pipeline   → 多级验证（lint + unit + api + e2e）     │
└─────────────────────────────────────────────────────────────┘
```

**spec-kit 钩子映射**（注：以下 hook 名称以实际 spec-kit API 为准）：

| spec-kit 阶段 | lnngfar 用途 |
|---------------|-------------|
| constitution 阶段 | 加载 stack.yml，初始化项目基础 |
| specify 阶段 | 加载 stack/specs 模板 |
| specify 完成后 | 更新 .lnngfar/ai/context.md |
| plan 阶段 | 注入 Template Engine 和 Skill Engine |
| tasks 完成后 | 关联模板任务和 AI 生成任务 |
| verify 完成后 | 触发 Lifecycle Engine 的 verify 阶段 |

---

# 三、lnngfar 总体架构

```text
┌──────────────────────────────────────┐
│              CLI / IDE               │
└────────────────┬─────────────────────┘
                 ↓
┌──────────────────────────────────────┐
│            lnngfar Core              │
│                                      │
│  Project Runtime                     │
│  Stack Manager                       │
│  Template Engine                     │
│  Spec Engine                         │
│  Skill Engine                        │
│  AI Runtime                          │
│  Lifecycle Engine                    │
└────────────────┬─────────────────────┘
                 ↓
┌──────────────────────────────────────┐
│              Stack Plugins           │
│                                      │
│ far-web-java                         │
│ far-mini-uni                         │
└──────────────────────────────────────┘
```

### AI Runtime 数据流（运行时）

```text
用户输入: lnngfar ai "生成订单模块"
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    AI Runtime 数据流                                         │
│                                                                             │
│  Step 0: 意图识别                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  解析用户输入 → 意图: 新建模块 → 模式: full_generation               │   │
│  │  其他意图: revise_existing | add_field | optimize | refactor         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│         │                                                                   │
│         ▼                                                                   │
│  Step 1: 上下文收集                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Context Manager                                                     │   │
│  │  ├─ 读取 specs/product/order.md   (需求上下文)       ~800 tokens     │   │
│  │  ├─ 读取 specs/domain/order.md   (领域上下文)        ~400 tokens     │   │
│  │  ├─ 读取 specs/api/order.md      (API 上下文)        ~300 tokens     │   │
│  │  └─ 读取 .lnngfar/ai/context.md (运行时上下文)      ~200 tokens     │   │
│  │  ----- 子计: ~1700 tokens ------                                     │   │
│  │                                                                     │   │
│  │  降级策略: specs/product/order.md 不存在时                            │   │
│  │  → 使用默认模板预设生成基础 spec                                      │   │
│  │  → 或在 context.md 中标记 "spec_missing: true"                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│         │                                                                   │
│         ▼                                                                   │
│  Step 2: Stack 加载                                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Stack Manager                                                       │   │
│  │  ├─ 读取 far-web-java/stack.yml                       ~600 tokens     │   │
│  │  ├─ 匹配模板: spring-rest, vue-admin                  ~500 tokens     │   │
│  │  └─ 匹配 skills: coding, testing                      ~300 tokens     │   │
│  │  ----- 子计: ~1400 tokens ------                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│         │                                                                   │
│         ▼                                                                   │
│  Step 3: Prompt 编排                                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Prompt Orchestrator                                                 │   │
│  │  ├─ System Prompt  ~160 tokens   (lnngfar 系统角色定义)               │   │
│  │  ├─ Spec Context    ~1700 tokens (模块规则和约束)                     │   │
│  │  ├─ Stack Context   ~1400 tokens (技术栈/模板/技能信息)               │   │
│  │  ├─ User Task       ~100 tokens  (用户原始输入)                       │   │
│  │  └─ Runtime Context ~200 tokens  (运行时记忆)                         │   │
│  │  ----- 总计: ~3560 tokens ------                                     │   │
│  │                                                                     │   │
│  │  权重说明 (控制 Prompt 组件的优先级，非 Token 分配):                   │   │
│  │  Spec Context (核心 40%) > Stack Context (30%) >                     │   │
│  │  Runtime (15%) > User Task (10%) > System (5%)                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│         │                                                                   │
│         ▼                                                                   │
│  Step 4: AI 生成                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Generation Pipeline                                                 │   │
│  │  ├─ 4.1 生成单元测试                                                  │   │
│  │  │   ├─ 后端: OrderServiceTest → verify ✅                            │   │
│  │  │   └─ 前端: OrderList.spec.ts → verify ✅                            │   │
│  │  │                                                                   │   │
│  │  ├─ 4.2 生成代码                                                      │   │
│  │  │   ├─ 后端: Controller + Service + Mapper + Entity + DTO          │   │
│  │  │   ├─ 前端: Page + Component + API                                │   │
│  │  │   └─ 生成 API 测试: OrderControllerApiTest                        │   │
│  │  │                                                                   │   │
│  │  ├─ 4.3 运行全部测试                                                   │   │
│  │  │   ├─ lint ✅                                                       │   │
│  │  │   ├─ unit test ✅                                                   │   │
│  │  │   └─ api test ✅                                                    │   │
│  │  │  (E2E 测试在 lnngfar verify 阶段运行，需要服务器启动)              │   │
│  │  │                                                                   │   │
│  │  └─ 失败处理                                                          │   │
│  │      ├─ 最多重试 3 次 (每次将错误信息反馈给 AI)                       │   │
│  │      ├─ 3 次后仍失败 → 回滚生成的文件 → 通知用户手动修复               │   │
│  │      └─ 记录失败原因到 .lnngfar/runtime/errors.md                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│         │                                                                   │
│         ▼                                                                   │
│  Step 5: 上下文更新                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  更新 specs/product/order.md (标记 status: building → done)          │   │
│  │  更新 .lnngfar/ai/context.md  (记录变更历史和模块状态)                 │   │
│  │  更新 .lnngfar/runtime/state.yml (同步生命周期状态)                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

# 四、核心模块设计

# 4.1 CLI 模块

## 目标

提供统一工程入口。

CLI 是：

- 项目初始化器
- Stack 管理器
- 生命周期入口
- AI 协作入口

---

## CLI 命令设计

### 初始化项目

```bash
lnngfar init
```

功能：

- 创建项目
- 选择 stack
- 初始化 specs
- 初始化 runtime
- 初始化 tests

---

### 安装 Stack

```bash
lnngfar stack add far-web-java
```

安装来源（按优先级）：

1. 官方 registry → `https://registry.lnngfar.dev/stacks/`
2. GitHub → `lnngfar stack add github:user/repo`
3. 本地路径 → `lnngfar stack add ./my-stack/`
4. 企业私服 → `lnngfar stack add --registry=https://registry.company.com`

Stack 安装到 `~/.lnngfar/stacks/<stack-name>/`

---

### Stack 兼容性

| Stack | 可共存 | 说明 |
|-------|--------|------|
| `far-web-java` + `far-mini-uni` | ✅ 是 | uni-app 复用 web 后端 API，生成到 `uniapp/` 目录 |
| `far-web-java` + `far-web-java` | ❌ 否 | 技术栈冲突 |
| 同一 Stack 不同版本 | ❌ 否 | 使用 `stack.lock` 锁定版本 |

---

### 规格管理

```bash
lnngfar spec parse         # 解析现有 specs，识别实体和关系
lnngfar spec generate      # 基于需求文档生成 spec 模板
```

功能：

- `spec parse`: 读取 specs/ 目录下已有 spec 文件，解析出实体、关系、API，更新 .lnngfar/ai/context.md
- `spec generate`: 基于用户输入的需求描述，生成 spec 文件模板到 specs/ 目录

---

### AI 增量开发

```bash
# 新建模块
lnngfar ai "生成订单模块"

# 修改已有代码
lnngfar ai --revise "修改用户登录逻辑，增加验证码验证"

# 带 spec 路径（精确控制上下文范围）
lnngfar ai "生成设备借用管理模块" --spec=specs/product/equipment.md
```

功能：

- 自动意图识别（新建 vs 修改 vs 优化）
- 读取 specs
- 读取 stack
- 读取 templates
- AI 增量生成
- 自动测试
- 自动更新 specs

---

### 验证

```bash
lnngfar verify
```

功能（统一执行全部验证）：

- lint 检查
- 单元测试
- API 测试
- E2E 测试（需要先部署或启动服务器）
- 安全扫描

> 注：原来的 `lnngfar test` 合并到 `lnngfar verify`，`lnngfar test` 作为 `lnngfar verify` 的别名保留。

`lnngfar verify` 支持子命令：

```bash
lnngfar verify --unit       # 仅单元测试
lnngfar verify --api        # 仅 API 测试
lnngfar verify --e2e        # 仅 E2E 测试
lnngfar verify --lint       # 仅 lint
```

---

### 部署

```bash
lnngfar deploy
```

功能：

- Docker
- Kubernetes
- CI/CD
- 云部署

---

### 运维

```bash
lnngfar ops
```

> 注：MVP 阶段 `lnngfar ops` 仅提供基础脚手架（生成监控配置模板），详细 AI 运维分析功能为第二阶段目标。

功能（MVP 阶段）：

- 生成 Docker Compose 配置
- 生成基础健康检查端点
- 生成日志收集配置

---

# 4.2 Spec Engine

## 核心定位

Spec Engine = spec-kit runtime。

负责：

- spec 管理
- spec 校验
- spec 解析
- spec 演化
- spec 索引
- spec 增量同步

---

## Spec 目录结构

```text
specs/
├── product/          # 产品需求（按模块组织）
│   ├── user.md
│   └── order.md
├── domain/           # 领域模型
│   ├── user.md
│   └── order.md
├── api/              # API 设计
├── ui/               # UI 规范
├── test/             # 测试规范
├── deploy/           # 部署规范
├── runtime/          # 运行时配置
└── workflows/        # 工作流定义
```

## Spec 文件模板

`specs/product/user.md` 示例：

```markdown
# User Module Spec

## 状态
status: planned  # planned | building | done | deprecated

## 实体
### User
| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| id | Long | 主键 | PK, AUTO |
| username | String(50) | 用户名 | UNIQUE, NOT NULL |
| password | String(100) | 密码(加密) | NOT NULL |
| realName | String(50) | 真实姓名 | |
| email | String(100) | 邮箱 | |
| phone | String(20) | 手机号 | |
| status | Integer | 状态 | DEFAULT 1 |

## 关系
- User N:M Role
- User 1:N UserRole

## API
- GET    /api/users          # 分页查询
- GET    /api/users/:id      # 详情查询
- POST   /api/users          # 创建
- PUT    /api/users/:id      # 更新
- DELETE /api/users/:id      # 删除

## 页面
- /user/list                 # 用户列表
- /user/create               # 新增用户
- /user/:id/edit             # 编辑用户

## 测试
- unit:  UserServiceTest
- api:   UserControllerApiTest
- e2e:   UserFlowE2eTest
```

### Spec 字段到实体代码映射规则

| Spec 约束 | far-web-java 映射 | far-mini-uni 映射 |
|-----------|-------------------|-------------------|
| `PK, AUTO` | `@TableId(type=IdType.AUTO)` | — (后端处理) |
| `UNIQUE` | `unique=true` in `@TableField` | — (后端校验) |
| `NOT NULL` | `@NotNull` + `nullable=false` | — (后端校验) |
| `DEFAULT 1` | `@TableField(fill=FieldFill.INSERT)` | — |
| `String(50)` | `@TableField` + DB varchar(50) | TypeScript `string` |
| `Long` | Java `Long` 类型 | TypeScript `number` |
| `Integer` | Java `Integer` 类型 | TypeScript `number` |
| `BigDecimal` | Java `BigDecimal` | TypeScript `number` |
| `LocalDate` | Java `LocalDate` | TypeScript `string` (ISO格式) |
| `DateTime` | `@JsonFormat` + `LocalDateTime` | TypeScript `string` (ISO格式) |

---

## Spec 核心能力

### 1. AI 长期记忆

specs 是 AI 的长期工程上下文。

### 2. 增量演化

AI 不重新生成项目。

只修改：

```text
changed specs
```

### 3. Token 降低

通过 spec 索引：

- 按模块读取
- 按领域读取
- 按上下文读取

减少 Token 消耗。

### 4. Spec 与代码双向同步

```text
specs → AI 生成代码
代码 → AI 更新 specs
```

AI 每次修改代码后自动检查是否需要更新对应 spec 的状态和内容。

---

# 4.3 Template Engine

## 核心定位

Template Engine = 工业模板系统。

不是简单代码模板。

而是：

- 工程模板
- 架构模板
- 测试模板
- 部署模板
- AI 工作流模板

---

## 模板层级

模板按以下优先级加载（数字越小优先级越高）：

```
1. 项目级模板 (templates/)        → 最高优先级，覆盖其他层级
2. 企业模板                        → 企业私有规范
3. 行业模板 (erp/ecommerce/cms)    → 领域专用
4. Stack 模板 (far-web-java 等)    → 技术栈默认
5. 基础模板 (crud/login/rbac)      → 通用默认
```

### 基础模板

例如：

- crud
- login
- rbac
- upload
- payment

### Stack 模板

#### far-web-java

包含：

- vue-admin
- spring-rest
- mybatis-crud
- jwt-auth
- docker-deploy

#### far-mini-uni

包含：

- uni-page
- uni-request
- uni-store
- mobile-layout

### 行业模板

例如：

- erp
- ecommerce
- cms
- game
- iot

### 企业模板

企业私有模板：

- 安全规范
- 编码规范
- 部署规范
- 企业组件库

---

## Template 与 Skill 冲突处理

当 Template 生成的代码与 Skill 规则的约束冲突时：

```
优先级: Skill 规则 > Template 默认值

示例:
  Template: Service 类不包含 @Transactional
  Coding Skill: "Service 层必须加 @Transactional"
  
  结果: AI Runtime 在生成代码后应用 Coding Skill，
        给 Service 方法补充 @Transactional 注解
```

---

# 4.4 Skill Engine

## 核心定位

Skill = AI 工程能力。

不是普通 prompt。

Skill 包含：

- 工程规则
- 编码规则
- 测试规则
- 部署规则
- review 规则
- 关联模板
- 修复策略

---

## Skill 结构定义

每个 Skill 是一个目录，包含以下文件：

```text
skills/coding/
├── skill.yaml          # Skill 定义
├── prompt.md           # 技能 Prompt（规则 + 约束）
├── rules/              # 规则文件
│   ├── java.md         # Java 编码规范
│   └── vue.md          # Vue 编码规范
├── templates/          # 关联的模板引用
│   └── refs.yaml       # 模板引用（不重复存储，引用 Template Engine）
├── tests/              # Skill 自身效果验证
│   └── validate.md     # 定义如何验证 Skill 是否生效
└── repair/             # 修复策略
    └── strategies.yaml # 常见错误 → 修复方案映射
```

### skill.yaml 完整定义

```yaml
# skills/coding/skill.yaml
name: coding
version: 1.0.0
description: 编码规范与最佳实践技能
type: rule  # rule | generator | reviewer

# 适用条件
applyWhen:
  stack: [far-web-java, far-mini-uni]
  phase: [develop]

# 规则权重
priority: 10  # 数字越大越优先

# Prompt 文件
prompt: prompt.md

# 关联模板（指向 Template Engine 中的模板）
templates:
  - template: crud
    backend: spring-rest
    frontend: vue-admin

# 修复策略
repairStrategies:
  - pattern: "NullPointerException"
    solution: "检查空值处理，使用 Optional"
  - pattern: "SQL injection"
    solution: "使用 MyBatis #{} 而不是 ${}"
  - pattern: "missing @Transactional"
    solution: "在 Service 方法上添加 @Transactional"

# 与其他 Skill 的关系
relations:
  requires: []
  conflicts: []
  enhances: [testing]
```

### Skill 与 Template 的关系

| 维度 | Template | Skill |
|------|----------|-------|
| **解决什么** | 确定性（代码骨架） | 规则/质量（代码血肉） |
| **形态** | 可替换的代码文件 | 不可替换的规则与约束 |
| **使用者** | Template Engine | AI Runtime（加载到 Prompt 中） |
| **变更频率** | 低（项目初始化时固定） | 中（根据需要调整规则） |
| **举例** | `UserController.java` 模板 | "Service 层必须加 @Transactional" 规则 |
| **冲突优先** | 低（可被 Skill 覆盖） | 高（覆盖模板生成的代码） |

### Skill 加载机制

```text
AI Runtime 启动
    │
    ├─ 读取 project.yml 中的 skills 列表
    │    skills: [coding, testing, security, review]
    │
    ├─ 读取每个 Skill 的 applyWhen
    │    coding: stack=far-web-java ✓, phase=develop ✓
    │
    ├─ 按 priority 排序
    │    security(20) > coding(10) > testing(5)
    │
    ├─ 加载 Skill 的 prompt.md → 拼接到 System Prompt
    └─ 加载 Skill 的 repair strategies → 注册到修复引擎
```

---

## Skill 目录

```text
skills/
├── coding/           # 编码规范
├── testing/          # 测试规则
├── deploy/           # 部署规则
├── security/         # 安全规则
├── review/           # 代码审查
└── performance/      # 性能规则
```

## Skill 能力

### coding skill

负责：

- 编码规范
- 架构规范
- 模块生成

### testing skill

负责：

- 测试优先
- 单元测试生成
- E2E 测试生成

### review skill

负责：

- AI Code Review
- 架构分析
- 性能分析

---

# 4.5 AI Runtime

## 核心定位

AI Runtime = AI 工程运行时。

不是聊天系统。

是：

- 工程上下文系统
- AI 协作系统
- AI 增量演化系统

---

## AI 工作流程

```text
意图识别 (新建 vs 修改)
→ 读取 specs
→ 读取 stack
→ 读取 templates
→ 读取 skills
→ 选择模板
→ 生成测试 (单元测试)
→ 生成代码
→ 验证 (unit + api)
→ 更新 specs
```

---

## AI Runtime 核心能力

### 1. Prompt Orchestration

组合：

```text
system
+ stack
+ specs
+ skills
+ templates
+ runtime
```

**编排权重**（控制 Prompt 组件的上下文优先级，数字越大 AI 越"重视"）：

| 组件 | 权重 | 说明 |
|------|------|------|
| specs | 40% | 当前模块的需求和规范（最核心） |
| stack + skills | 30% | 技术栈约束 + 编码规则 |
| runtime | 15% | 运行时上下文和记忆 |
| user task | 10% | 用户原始输入 |
| system | 5% | lnngfar 系统角色定义 |

### 2. Context 裁剪

只读取：

- **当前模块**：根据用户输入匹配 spec 目录下的模块
- **当前 spec**：只加载相关 spec 文件
- **当前测试**：只加载相关测试上下文
- **当前上下文**：.lnngfar/ai/context.md 中与该模块相关的部分

**裁剪策略**：

```text
输入: "生成订单模块"
    │
    ├─ 模块匹配: order
    │     specs/product/order.md    → 加载 ✅
    │     specs/domain/order.md     → 加载 ✅
    │     specs/api/order.md        → 加载 ✅
    │     specs/product/user.md     → 跳过 ✗ (不相关)
    │
    ├─ Token 预算: 128000
    │     当前已用: ~3560
    │     剩余可追加: ~124440
    │
    └─ 裁剪结果输出 → Prompt Orchestrator
```

### 3. 增量生成

AI 只修改变化部分。

不是全量重生成。

**增量 vs 全量决策逻辑**：

| 场景 | 策略 |
|------|------|
| 新增模块 | 全量生成该模块 |
| 修改已有模块 | 只修改 diff 部分 |
| 添加字段 | 增量：Entity+DML+DTO+前端表单 |
| 修改业务逻辑 | 增量：只修改 Service 层 |
| spec 结构变化 | 全量重新生成该模块 |
| 测试失败 | 增量：只修改未通过的部分 |

### 4. AI 可持续演化

项目长期维护时：

AI 仍然能理解项目。

---

### 5. 生成失败回滚机制

```text
AI 生成流程
    │
    ├─ Step 4.1: 生成测试
    │   ├─ 成功 → 进入 Step 4.2
    │   └─ 失败 → 重试 (最多 3 次)
    │       └─ 3 次后仍失败 → 回滚 → 通知用户
    │
    ├─ Step 4.2: 生成代码
    │   ├─ 成功 → 进入 Step 4.3
    │   └─ 失败 → 回滚 Step 4.2 生成的文件 → 通知用户
    │
    └─ Step 4.3: 运行测试
        ├─ lint 失败 → AI 自动修复 (最多 3 次)
        ├─ unit/api test 失败 → AI 自动修复 (最多 3 次)
        └─ 3 次后仍失败 → 回滚所有新文件 → 记录错误到 .lnngfar/runtime/errors.md
```

---

# 4.6 Lifecycle Engine

## 核心定位

统一项目生命周期管理。

覆盖：

- 初始化
- 开发
- 测试
- 部署
- 运维
- 演化

---

## 生命周期阶段

### init

项目初始化。

### develop

AI 增量开发。

### verify

自动验证：lint + unit test + api test + e2e test + 安全扫描。

verify 阶段结束后，可回到 develop 继续开发。

### deploy

自动部署。

### ops

运行监控（MVP 阶段仅生成监控配置模板）。

### evolve

AI 持续演化。

---

## Lifecycle 状态机

```text
         init
           ↓
        develop
          ↕  (双向：开发 → 验证 → 开发)
         verify
           ↓
         deploy
           ↓
          ops
           ↓
        evolve → back to develop (持续迭代)
```

状态同步文件：`.lnngfar/runtime/state.yml`

```yaml
# .lnngfar/runtime/state.yml
lifecycle:
  current: develop
  history:
    - phase: init
      time: "2026-05-10T10:00:00Z"
      status: done
    - phase: develop
      time: "2026-05-10T10:30:00Z"
      status: active
      module: user

modules:
  user:
    status: developing
    spec: specs/product/user.md
    lastVerify: "2026-05-10T11:00:00Z"
  order:
    status: planned
    spec: specs/product/order.md
```

---

# 五、项目配置设计

# 5.1 project.yml 完整配置

```yaml
# .lnngfar/project.yml

# 项目基本信息
project:
  name: my-app
  description: 企业设备管理系统
  version: 0.1.0
  created: "2026-05-10"

# 激活的 Stack
stack:
  name: far-web-java
  version: 1.0.0
  source: official

# AI 配置
ai:
  provider: deepseek
  model: deepseek-v3
  keyFrom: env  # env | file | system-keychain | enterprise-gateway
  keyEnvVar: DEEPSEEK_API_KEY
  maxTokens: 128000
  temperature: 0.1

# 启用的 Skill
skills:
  - coding
  - testing
  - security
  - review

# 启用的模板
templates:
  backend:
    - spring-rest
    - mybatis-crud
    - jwt-auth
  frontend:
    - vue-admin

# 测试配置
test:
  framework:
    backend: junit5
    frontend: vitest
  coverage:
    target: 80%
    enforce: warning  # warning | error | ignore

# 部署配置
deploy:
  docker: true
  kubernetes: false
```

---

# 5.2 stack.lock 文件格式

```yaml
# .lnngfar/stack.lock
stack:
  name: far-web-java
  version: 1.0.0
  resolved: "https://registry.lnngfar.dev/stacks/far-web-java/1.0.0"
  checksum: "sha256:abc123..."

skills:
  - name: coding
    version: 1.0.0
    checksum: "sha256:def456..."
  - name: testing
    version: 1.0.0
    checksum: "sha256:ghi789..."
```

---

# 5.3 项目目录结构（完整）

```text
my-project/
├── .lnngfar/                  # lnngfar 项目数据
│   ├── project.yml            # 项目配置
│   ├── stack.lock             # Stack 锁定文件
│   ├── ai/                    # AI 上下文
│   │   ├── context.md         # 当前上下文
│   │   └── history/           # AI 交互历史
│   ├── runtime/               # 运行时状态
│   │   ├── state.yml          # 生命周期状态
│   │   └── errors.md          # 错误记录
│   └── cache/                 # 本地缓存
│
├── specs/                     # 规格文档
│   ├── product/               # 产品需求（按模块）
│   │   ├── user.md
│   │   └── order.md
│   ├── domain/                # 领域模型
│   ├── api/                   # API 设计
│   ├── ui/                    # UI 规范
│   ├── test/                  # 测试规范
│   ├── deploy/                # 部署规范
│   ├── runtime/               # 运行时配置
│   └── workflows/             # 工作流
│
├── skills/                    # 项目级 Skill 覆盖
│   ├── coding/
│   └── testing/
│
├── templates/                 # 项目级模板覆盖（最高优先级）
│
├── backend/                   # 后端源码（far-web-java 生成）
│   ├── src/
│   │   └── main/
│   │       ├── java/com/example/
│   │       │   ├── module/
│   │       │   │   ├── user/
│   │       │   │   │   ├── controller/
│   │       │   │   │   ├── service/
│   │       │   │   │   ├── mapper/
│   │       │   │   │   ├── entity/
│   │       │   │   │   └── dto/
│   │       │   │   └── order/
│   │       │   └── common/
│   │       └── resources/
│   └── test/                   # 后端测试（Maven 惯例）
│       └── java/com/example/
│           └── module/
│               ├── user/
│               └── order/
│
├── frontend/                  # 前端源码（far-web-java 生成）
│   └── src/
│       ├── views/             # 页面
│       ├── api/               # API 调用
│       ├── components/        # 公共组件
│       ├── store/             # 状态管理
│       ├── utils/             # 工具
│       └── __tests__/         # 前端测试（Vitest 惯例）
│
├── uniapp/                    # 小程序源码（far-mini-uni 生成，可选）
│   └── src/
│       ├── pages/
│       ├── api/
│       ├── components/
│       └── stores/
│
├── tests/                     # E2E 测试和集成测试
│   └── e2e/
│
├── deploy/                    # 部署配置
│
└── docs/                      # 项目文档
```

> 注：单元测试放在对应技术栈的 test 目录（`backend/src/test/`、`frontend/src/__tests__/`），E2E 测试和跨模块集成测试放在项目根目录 `tests/`。

---

# 六、多开发者协作设计

## 6.1 .lnngfar/ 目录的 Git 管理

```gitignore
# .gitignore
.lnngfar/cache/
.lnngfar/ai/history/
.lnngfar/runtime/state.yml   # 个人运行时状态
.lnngfar/runtime/errors.md    # 个人错误记录
```

**需要提交到 Git 的**：

- `.lnngfar/project.yml` — 项目配置（团队共享）
- `.lnngfar/stack.lock` — Stack 版本锁定（团队共享）
- `.lnngfar/ai/context.md` — 项目上下文（团队共享）

**不提交到 Git 的**（个人）：

- `cache/`、`history/`、`state.yml`、`errors.md` — 运行时数据

---

## 6.2 多人协作场景

| 场景 | 处理方式 |
|------|----------|
| 开发者 A 修改 `specs/product/user.md` | `spec parse` 后更新 `context.md`，提交到 Git |
| 开发者 B 拉取 A 的修改 | `lnngfar sync` 同步 `context.md` 和 `stack.lock` |
| A 和 B 同时修改同一模块代码 | 依赖 Git merge，冲突由 AI 辅助解决 |
| Stack 版本更新 | 更新 `stack.lock`，`lnngfar stack update` 同步 |
| AI 生成代码冲突 | 标准 Git 冲突解决流程，AI Runtime 可以辅助 |

---

# 七、Stack 系统设计

# 7.1 Stack 定义

stack = 基于 spec-kit 的工业化工程能力包。

---

# 7.2 Stack 目录结构

```text
far-web-java/
├── stack.yml
├── specs/
├── templates/
├── skills/
├── prompts/
├── generators/
├── tests/
├── deploy/
└── runtime/
```

> 注：MVP 阶段 Stack 目录不含 `agents/`，等待第二阶段多 Agent 支持后再引入。

---

# 7.3 Stack 配置示例（完整）

```yaml
name: far-web-java
version: 1.0.0
type: fullstack
description: 企业级 Web 全栈技术栈

# 技术栈定义
technologies:
  frontend:
    framework: vue3
    language: typescript
    ui: element-plus
    state: pinia
    router: vue-router
    build: vite
  backend:
    framework: springboot
    language: java
    javaVersion: "17"
    orm: mybatis-plus
    security: spring-security
    auth: jwt
    build: maven
  database:
    type: mysql
    version: "8.0"

# 测试框架
test:
  frontend:
    unit: vitest
    e2e: playwright
  backend:
    unit: junit5
    api: spring-mockmvc

# 默认模板
templates:
  backend:
    - spring-rest
    - mybatis-crud
    - jwt-auth
  frontend:
    - vue-admin
    - element-form
    - auth-page

# 默认 Skill
skills:
  - coding
  - testing
  - security

# 部署选项
deploy:
  docker: true
  kubernetes: false
```

---

# 7.4 官方 Stack

## far-web-java

定位：

企业级 Web 全栈。

技术：

- Vue3 + TypeScript + Element Plus
- Spring Boot + MyBatis Plus
- MySQL
- JWT
- Docker

适用：

- ERP
- SaaS
- CMS
- 管理系统

---

## far-mini-uni

定位：

跨端小程序。

技术：

- uni-app + TypeScript
- uni-ui + uview-plus
- Pinia

后端方案（继承 far-web-java 的后端 API）：

适用场景为已有 far-web-java 后端，或在 `project.yml` 中附加指定后端 stack。

适用：

- 微信小程序
- 抖音小程序
- App

---

# 八、测试优先体系

# 8.1 测试流程

```text
spec
→ test (模板自带 或 AI 生成单元测试)
→ implementation
→ verify (unit + api + e2e)
```

---

# 8.2 测试生成策略

| 源码类型 | 测试来源 | 生成时机 | 验证方式 |
|----------|----------|----------|----------|
| **模板生成的 Controller** | 模板自带的测试类 | init 时 | 模板预先通过基础验证 |
| **模板生成的 Service** | 模板自带的测试类 | init 时 | 模板预先通过基础验证 |
| **模板生成的 Entity** | 模板自带的测试类 | init 时 | 模板预先通过基础验证（基础字段映射测试） |
| **AI 生成的 Service** | AI 优先生成测试 | generate 时 | 单元测试通过后再生成代码 |
| **AI 生成的前端页面** | AI 生成组件测试 | generate 时 | 组件渲染测试通过 |
| **用户手写代码** | AI 辅助补全测试 | 手动触发 | 建议覆盖率 ≥70% |

> 注：实体类（Entity）的"覆盖"指基本字段注解正确性测试，非传统代码覆盖率。模板自带测试保证注解配置正确。

---

# 8.3 测试类型

## 单元测试

覆盖：

- services
- utils
- domain logic

## API 测试

覆盖：

- REST API
- authentication
- authorization

## E2E 测试

覆盖（需服务器运行）：

- 用户流程
- 页面流程
- 核心业务流程

## AI 回归测试

覆盖：

- AI 修改稳定性
- AI 演化验证

---

# 九、安全设计

# 9.1 AI Key 管理

支持的 AI 提供商与 Key 配置：

```text
DEEPSEEK_API_KEY
OPENAI_API_KEY
GLM_API_KEY
```

---

# 9.2 安全机制

## 本地加密存储

优先本地。

## 系统密钥链

使用系统 Keychain。

## 权限隔离

不同项目独立。

## 企业模式

支持私有 AI Gateway。

## Key 保护完整方案

```text
优先级查找:
1. 环境变量 LNNGFAR_AI_API_KEY
2. 用户配置文件 ~/.lnngfar/key
3. 系统 Keychain (macOS/Windows)
4. 企业 AI Gateway 配置

安全规则:
- lnngfar 日志永远不输出 API Key
- lnngfar ai 交互记录中自动脱敏
- project.yml 中不存储 Key 原文
- 支持 Key 过期自动轮换提醒
```

---

# 十、开发模式

# 10.1 CLI 模式

用户本地开发。

# 10.2 IDE 模式

支持：

- VSCode
- Cursor
- Windsurf
- JetBrains

# 10.3 Cloud 模式

未来支持：

- 云端 AI 工厂
- 多 Agent
- 团队协作

---

# 十一、lnngfar 自举体系

# 11.1 lnngfar 本身基于 spec-kit 开发

lnngfar 自身必须：

```text
spec-kit
→ specs
→ AI generate
→ tests
→ evolve
```

# 11.2 Stack 生成项目也基于 spec-kit

所有生成项目：

必须存在：

```text
specs/
```

AI 后续持续演化项目。

---

# 十二、MVP 设计

# 第一阶段目标

只做：

- spec-kit 集成
- stack 系统
- industrial templates
- AI incremental generation
- test-first workflow
- 基础 verify/deploy

---

# 第一阶段 Stack

## far-web-java

## far-mini-uni

---

# 第一阶段 AI 能力

只支持：

- CRUD
- login
- RBAC
- simple business flow

---

# 第一阶段不做

- 多 Agent
- 云平台
- Stack Marketplace
- AI 自动运维（ops 仅生成监控配置模板）
- AI 自动架构优化
- 多开发者 AI 协作

---

# 十三、未来演进路线

# 第一阶段

AI 全栈生成器。

# 第二阶段

AI 软件工程平台。

# 第三阶段

AI 软件工厂。

# 第四阶段

Stack Marketplace。

形成：

- stack 生态
- template 生态
- skill 生态
- agent 生态

---

# 十四、竞争优势

| 能力              | lnngfar | 普通AI代码工具 |
| ----------------- | ------- | -------------- |
| spec-kit 集成      | ✓       | ×              |
| 工业模板           | ✓       | ×              |
| 测试优先           | ✓       | ×              |
| Stack 插件化       | ✓       | ×              |
| 生命周期管理       | ✓       | ×              |
| AI 持续演化        | ✓       | ×              |
| Token 优化         | ✓       | ×              |
| Skill 规则引擎     | ✓       | ×              |
| 意图识别           | ✓       | ×              |
| 生成失败回滚       | ✓       | ×              |

---

# 十五、最终产品定义

## 技术定义

lnngfar = 基于 spec-kit 的 AI 软件工程运行时与工业化平台。

## 产品定义

lnngfar = 一个通过"工业模板 + AI 智能"实现真实项目持续开发、维护与演化的 AI 全栈工程系统。

## 官网一句话

lnngfar = AI-native industrial software engineering platform.

---

## 变更记录

| 版本 | 日期 | 变更内容 |
|------|------|----------|
| v2.2 | 2026-05-10 | 修复 30 项缺陷：逻辑矛盾（5项）、概念冗余冲突（5项）、关键缺失（10项）、细节不足（8项）、命名/格式（2项）。详见缺陷检查报告 |
| v2.1 | 2026-05-10 | 全面优化：补充交互流程、AI Runtime 数据流、project.yml、Skill Engine 深化、spec-kit 集成方式、测试策略细化、目录结构完善 |
| v2.0 | 2026-05-10 | 基于 spec-kit 重新设计 |
