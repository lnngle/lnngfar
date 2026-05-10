# lnngfar 产品设计文档

> 版本：v0.1.0  
> 日期：2026-05-10  
> 状态：初稿

---

## 一、产品概述

### 1.1 产品定位

**lnngfar** (Long AI Native Engineering Runtime) 是一个 AI 原生的软件工程运行时（AI Native Engineering Runtime），旨在构建让 AI 能长期稳定、低 token 成本、可持续演化地开发和维护真实项目的工程体系。

### 1.2 核心理念

> **"用工业模板解决确定性，用 AI 解决创造性"**

```
┌─────────────────────────────────────────────────────────────┐
│                    lnngfar 核心理念                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────────────────┐     ┌─────────────────────┐      │
│   │    工业模板层        │     │      AI 智能层       │      │
│   │   (确定性部分)       │  +  │   (创造性部分)       │      │
│   ├─────────────────────┤     ├─────────────────────┤      │
│   │  • 登录鉴权         │     │  • 复杂业务逻辑       │      │
│   │  • CRUD 操作        │     │  • 特殊业务规则       │      │
│   │  • 路由请求         │     │  • 工作流设计        │      │
│   │  • 基础架构         │     │  • 智能决策能力      │      │
│   │  • 跨端能力         │     │  • 领域创新          │      │
│   └─────────────────────┘     └─────────────────────┘      │
│                                                             │
│   模板 → 高稳定、低成本、可复用                              │
│   AI  → 增量开发、持续演化、智能维护                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 1.3 设计原则

| 原则 | 说明 |
|------|------|
| **Spec First** | 需求 → 规范 → 架构 → 代码，而非 Prompt → 直接代码 |
| **Runtime 中心** | 以运行时为核心，而非一次性代码生成器 |
| **AI Friendly** | 为 AI 构建长期上下文，优化 AI 可理解性 |
| **渐进演化** | 基于规范的结构化演化，而非手改代码 |
| **工业模板优先** | 避免 AI 全量生成，控制 Token 成本 |

---

## 二、核心架构

### 2.1 整体架构图

```
┌─────────────────────────────────────────────────────────────────────┐
│                          lnngfar 运行时平台                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                      AI Runtime                             │   │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌──────────┐ │   │
│  │  │ Context   │  │  Prompt   │  │  Memory   │  │  Tools   │ │   │
│  │  │ Manager   │  │ Runtime   │  │  System   │  │ Registry │ │   │
│  │  └───────────┘  └───────────┘  └───────────┘  └──────────┘ │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                    │                                │
│  ┌───────────────┬─────────────────┼─────────────────┬──────────┐ │
│  │               │                 │                 │          │ │
│  ▼               ▼                 ▼                 ▼          ▼  │
│ ┌─────────┐  ┌──────────┐   ┌──────────┐    ┌────────┐  ┌───────┐│
│ │  Spec   │  │ Template  │   │  Skill   │    │Repair  │  │ Stack ││
│ │ Engine  │  │ Engine    │   │ System   │    │Engine  │  │Runtime││
│ └────┬────┘  └────┬─────┘   └────┬─────┘    └───┬────┘  └───┬───┘│
│      │            │               │             │           │    │
│      └────────────┴───────────────┴─────────────┴───────────┘    │
│                                 │                                  │
│                                 ▼                                  │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Project Runtime                           │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────────────┐  │   │
│  │  │  .ai/   │  │ specs/  │  │ skills/ │  │ prompts/       │  │   │
│  │  │ Context │  │ Specs   │  │ Skills  │  │ Prompt Library │  │   │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.2 五大核心引擎

| 引擎 | 职责 | 核心价值 |
|------|------|----------|
| **Spec Engine** | 结构化规范管理（需求→规范→实现） | AI 长期记忆系统 |
| **Template Engine** | 工业模板生成（高稳定、低成本） | 确定性部分自动化 |
| **Skill System** | AI 技能扩展（专业化能力） | 能力模块化复用 |
| **Repair Engine** | 问题诊断与修复 | AI 时代核心能力 |
| **AI Runtime** | AI 运行协调与上下文管理 | 上下文工程化 |

---

## 三、核心引擎详解

### 3.1 Spec Engine（规范引擎）

#### 3.1.1 设计目标

将需求转化为结构化的工程描述语言（Spec），为 AI 提供长期、规范、可追溯的上下文。

#### 3.1.2 规范层次

```
specs/
├── product.md           # 产品级规范
│   ├── 业务背景
│   ├── 核心价值
│   └── 成功标准
│
├── entities.md          # 实体规范
│   ├── 领域模型
│   ├── 关系定义
│   └── 约束规则
│
├── api.md               # API 规范
│   ├── 接口设计
│   ├── 请求/响应
│   └── 错误处理
│
├── ui.md                # 界面规范
│   ├── 页面结构
│   ├── 交互流程
│   └── 状态管理
│
└── flows.md             # 流程规范
    ├── 业务流程
    ├── 决策节点
    └── 异常处理
```

#### 3.1.3 Spec First 流程

```
需求输入
    │
    ▼
┌─────────────┐
│  Product    │  ← 业务人员/产品经理
│  Spec       │
└──────┬──────┘
       │ 结构化描述
       ▼
┌─────────────┐
│  Entities   │  ← 实体建模
│  Spec       │
└──────┬──────┘
       │ 模型推导
       ▼
┌─────────────┐
│  API        │  ← 接口设计
│  Spec       │
└──────┬──────┘
       │ 接口驱动
       ▼
┌─────────────┐
│  UI         │  ← 界面设计
│  Spec       │
└──────┬──────┘
       │ 界面驱动
       ▼
┌─────────────┐
│  Code       │  ← 代码生成
│  Generation │
└─────────────┘
```

### 3.2 Template Engine（模板引擎）

#### 3.2.1 设计目标

提供高稳定、低成本的工业级模板，解决项目中的确定性部分。

#### 3.2.2 模板分类

| 模板类别 | 用途 | 稳定性 |
|----------|------|--------|
| **架构模板** | 项目基础结构、分层架构 | 极高 |
| **认证模板** | 登录、注册、权限、OAuth2 | 极高 |
| **CRUD 模板** | 增删改查、列表、详情 | 高 |
| **API 模板** | 请求封装、响应处理、错误码 | 高 |
| **组件模板** | 通用 UI 组件、表单、表格 | 高 |
| **DevOps 模板** | Docker、K8s、CI/CD | 高 |

#### 3.2.3 模板生成原则

```
✓ 确定性 → 模板生成
✗ 创造性 → AI 增量开发

模板职责：
├── 项目脚手架搭建
├── 基础架构配置
├── 通用功能实现
└── DevOps 集成

AI 职责：
├── 业务逻辑编写
├── 复杂规则实现
├── 工作流设计
└── 智能能力集成
```

### 3.3 Skill System（技能系统）

#### 3.3.1 设计目标

模块化封装 AI 能力，支持灵活组合与复用。

#### 3.3.2 Skill 结构

```
skills/
├── crud.skill/
│   ├── skill.yaml          # 技能定义
│   ├── prompt.md           # 技能提示词
│   ├── template/           # 关联模板
│   ├── tests/              # 测试用例
│   └── repair/            # 修复策略
│
├── auth.skill/
│   ├── skill.yaml
│   ├── prompt.md
│   ├── template/
│   ├── tests/
│   └── repair/
│
└── upload.skill/
    ├── skill.yaml
    ├── prompt.md
    ├── template/
    ├── tests/
    └── repair/
```

#### 3.3.3 Skill YAML 定义

```yaml
name: crud
version: 1.0.0
description: 通用 CRUD 技能
tags: [backend, database, api]

capabilities:
  - create: 标准创建操作
  - read: 查询与列表
  - update: 更新操作
  - delete: 软删除/硬删除

templates:
  - backend/crud.java
  - frontend/api.ts
  - frontend/hooks.ts

prompt_template: |
  请基于以下实体定义生成 CRUD 代码：
  {{entity}}

tests:
  - unit: tests/crud.test.ts
  - integration: tests/crud.integration.test.ts

repair_strategies:
  - pattern: "NullPointerException"
    solution: "检查空值处理"
```

### 3.4 Repair Engine（修复引擎）

#### 3.4.1 设计目标

构建 AI 时代的自动修复能力，实现 build → error → repair → retest 闭环。

#### 3.4.2 修复流程

```
代码变更
    │
    ▼
┌─────────────┐
│   Build     │ ──→ 成功 ──→ 结束
└──────┬──────┘
       │ 失败
       ▼
┌─────────────┐
│   Error     │ ──→ 错误分类
│  Analysis   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Repair     │ ──→ 选择修复策略
│  Strategy   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Apply     │ ──→ 自动修复
│   Fix       │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   ReTest    │ ──→ 通过 ──→ 结束
└─────────────┘
       │ 失败
       ▼
    循环修复
```

#### 3.4.3 修复策略库

```yaml
repair_strategies:
  compile_error:
    - 导入缺失 → 自动添加 import
    - 类型错误 → 类型推断修复
    - 语法错误 → 语法修正
  
  test_error:
    - 断言失败 → 分析预期 vs 实际
    - 依赖缺失 → Mock 注入
    - 超时 → 增加超时配置
  
  runtime_error:
    - 空指针 → Null 检查注入
    - 权限不足 → 权限配置
    - 连接失败 → 重试/降级
```

### 3.5 AI Runtime（AI 运行时）

#### 3.5.1 设计目标

为 AI 提供结构化的上下文管理、Prompt 优化和工具调用能力。

#### 3.5.2 组件设计

```
AI Runtime
├── Context Manager        # 上下文管理
│   ├── Project Context    # 项目上下文
│   ├── Module Context     # 模块上下文
│   └── Task Context       # 任务上下文
│
├── Prompt Runtime        # Prompt 运行时
│   ├── prompts/
│   │   ├── architect/     # 架构设计提示词
│   │   ├── backend/       # 后端开发提示词
│   │   ├── frontend/      # 前端开发提示词
│   │   └── repair/        # 修复提示词
│   │
│   └── template_engine    # Prompt 模板引擎
│
├── Memory System         # 记忆系统
│   ├── .ai/
│   │   ├── architecture.md   # 架构记忆
│   │   ├── module-map.md     # 模块地图
│   │   ├── decisions.md      # 决策记录
│   │   └── context.md        # 当前上下文
│   │
│   └── history/              # 历史记录
│
└── Tool Registry         # 工具注册
    ├── build_tools        # 构建工具
    ├── test_tools         # 测试工具
    ├── deploy_tools       # 部署工具
    └── custom_tools       # 自定义工具
```

---

## 四、技术栈支持

### 4.1 当前支持的技术栈

| 领域 | 技术栈 | 说明 |
|------|--------|------|
| **Web 前端** | Vue3 + TypeScript | 企业级 Web 应用 |
| **Web 后端** | Spring Boot + MyBatis Plus | Java 企业后端 |
| **小程序** | uni-app + TypeScript + uni-ui | 跨端小程序 |
| **CLI** | Node.js / Python | 跨平台命令行工具 |

### 4.2 未来扩展计划

| 类型 | 技术栈 | 状态 |
|------|--------|------|
| **后端框架** | NestJS | 规划中 |
| **后端框架** | FastAPI | 规划中 |
| **前端框架** | React | 规划中 |
| **数据库** | PostgreSQL/MySQL | 规划中 |
| **移动端** | React Native | 规划中 |

---

## 五、目录结构规范

### 5.1 统一目录结构

**核心原则**：所有技术栈必须遵循统一的目录结构，确保 AI 理解和团队协作一致性。

```
project/
├── src/                        # 源代码
│   ├── modules/               # 【核心】业务模块
│   │   ├── user/              # 示例：用户模块
│   │   │   ├── README.md      # 模块说明
│   │   │   ├── types/         # 类型定义
│   │   │   │   ├── user.types.ts
│   │   │   │   └── user.api.ts
│   │   │   ├── api/           # 接口层
│   │   │   │   ├── user.controller.ts
│   │   │   │   └── user.service.ts
│   │   │   ├── store/         # 状态管理
│   │   │   │   └── user.store.ts
│   │   │   ├── components/    # UI 组件
│   │   │   │   ├── UserList.vue
│   │   │   │   └── UserForm.vue
│   │   │   └── tests/         # 测试
│   │   │       ├── user.test.ts
│   │   │       └── user.e2e.ts
│   │   │
│   │   ├── order/             # 示例：订单模块
│   │   └── inventory/         # 示例：库存模块
│   │
│   ├── shared/                # 共享模块
│   │   ├── components/        # 通用组件
│   │   ├── hooks/            # 通用 Hooks
│   │   ├── utils/            # 工具函数
│   │   └── constants/        # 常量定义
│   │
│   └── config/               # 配置文件
│
├── .ai/                       # 【核心】AI 上下文
│   ├── architecture.md       # 项目架构说明
│   ├── module-map.md         # 模块依赖图
│   ├── decisions.md          # 技术决策记录
│   ├── context.md            # 当前任务上下文
│   └── memory/               # AI 记忆
│
├── specs/                     # 【核心】规范文档
│   ├── product.md            # 产品规范
│   ├── entities.md           # 实体规范
│   ├── api.md                # API 规范
│   ├── ui.md                 # UI 规范
│   └── flows.md              # 流程规范
│
├── skills/                    # 【核心】技能配置
│   ├── crud.yaml
│   ├── auth.yaml
│   └── custom/
│
├── prompts/                   # 【核心】Prompt 库
│   ├── architect/
│   ├── backend/
│   ├── frontend/
│   └── repair/
│
├── tests/                     # E2E 测试
│
├── scripts/                   # 脚本
│
├── docs/                      # 文档
│
└── README.md                   # 项目说明
```

### 5.2 模块设计原则

```
AI-Friendly 模块规范：

✓ 小而独立
  ├── 每个模块独立完整
  ├── 模块内自包含 types/api/store/components/tests
  └── 避免跨模块直接依赖

✓ 有文档
  ├── 每个模块必须有 README.md
  └── 说明模块职责和用法

✓ 单一职责
  ├── 一个模块做一件事
  └── 避免"万能模块"

✗ 避免
  ├── 3000 行 Service
  ├── 独立大文件
  └── 模块间循环依赖
```

---

## 六、CLI 命令设计

### 6.1 命令列表

```bash
# 项目管理
lnngfar create <project-name>    # 创建新项目
lnngfar init                     # 初始化现有项目
lnngfar list                     # 列出可用模板和技能

# 模块管理
lnngfar add <module-name>        # 添加新模块
lnngfar remove <module-name>     # 删除模块
lnngfar update <module-name>     # 更新模块

# 规范管理
lnngfar spec init                # 初始化规范
lnngfar spec add <spec-name>     # 添加规范
lnngfar spec sync                # 同步规范到代码

# 技能管理
lnngfar skill install <skill>    # 安装技能
lnngfar skill list               # 列出技能
lnngfar skill update <skill>    # 更新技能

# AI 开发
lnngfar ai <task>                # AI 执行任务
lnngfar ai context               # 查看当前上下文
lnngfar ai explain               # 解释代码

# 修复能力
lnngfar repair                   # 修复当前问题
lnngfar repair analyze           # 分析问题
lnngfar repair fix               # 执行修复

# 开发辅助
lnngfar build                    # 构建项目
lnngfar test                     # 运行测试
lnngfar dev                      # 开发模式
lnngfar deploy                   # 部署

# 导出导入
lnngfar export                   # 导出项目配置
lnngfar import <file>           # 导入项目配置
```

### 6.2 命令设计原则

```
CLI 设计原则：

1. 原子化
   每个命令只做一件事

2. 可组合
   命令可以组合使用
   lnngfar build && lnngfar test

3. AI 友好
   输出结构化，便于 AI 解析
   支持 --json 输出

4. 交互优先
   无参数时进入交互模式
   支持 --yes 自动确认

5. 回滚支持
   危险操作支持 --dry-run
   支持撤销操作
```

---

## 七、与 JHipster 的关系

### 7.1 应该借鉴的部分

| JHipster 特性 | lnngfar 借鉴方式 |
|---------------|------------------|
| **架构统一** | 所有技术栈统一目录结构 |
| **JDL/JDL Studio** | Spec Engine 结构化规范 |
| **Blueprint/Plugin** | Stack Runtime + Skill System |
| **模块化 Generator** | 能力拆分，Skill 封装 |
| **工程最佳实践** | 模板沉淀企业经验 |
| **CLI Runtime** | lnngfar CLI 命令体系 |
| **DevOps 自动化** | CI/CD 模板集成 |

### 7.2 必须避免的缺陷

| JHipster 问题 | lnngfar 解决方案 |
|---------------|------------------|
| 全部模板生成 | 模板 + AI 增量开发 |
| 生成后不可维护 | Runtime 化持续演化 |
| 巨型工程 | AI-Friendly 小模块 |
| 代码生成器中心 | Runtime 中心 |
| 升级困难 | 基于 Spec 自动演化 |
| AI 无上下文 | .ai/ 上下文系统 |
| Prompt 混乱 | Prompt Runtime 化 |
| AI 全量生成 | 工业模板优先 |

### 7.3 核心差异对比

```
┌─────────────────────────────────────────────────────────────────┐
│                    JHipster vs lnngfar 对比                      │
├─────────────────────┬─────────────────────────────────────────┤
│        JHipster      │               lnngfar                   │
├─────────────────────┼─────────────────────────────────────────┤
│ 代码生成器中心        │ Runtime 运行时中心                        │
│ 一次性全量生成        │ Spec + Template + AI 渐进演化             │
│ AI 无感知           │ AI Native 原生支持                         │
│ 模板解决一切         │ 模板解决确定性，AI 解决创造性               │
│ Prompt 分散         │ Prompt Runtime 结构化管理                  │
│ 升级困难             │ 基于 Spec 自动升级                         │
│ 上下文丢失           │ .ai/ 长期上下文记忆                        │
│ 大型单体生成物       │ AI-Friendly 小模块                        │
└─────────────────────┴─────────────────────────────────────────┘
```

---

## 八、演进路线

### 8.1 短期目标 (v0.1 - v0.5)

```
阶段一：基础能力建设
├── CLI 核心命令
│   ├── lnngfar create
│   ├── lnngfar add
│   └── lnngfar build
│
├── Template Engine
│   ├── 基础项目模板
│   ├── 认证模板
│   └── CRUD 模板
│
├── Web 技术栈支持
│   ├── Vue3 + TypeScript
│   └── Spring Boot + MyBatis Plus
│
└── 基础文档
    └── 产品设计文档
    └── 使用文档
```

### 8.2 中期目标 (v1.0 - v1.5)

```
阶段二：AI 能力增强
├── Spec Engine
│   ├── 结构化规范解析
│   ├── 规范到代码生成
│   └── 规范版本管理
│
├── AI Runtime
│   ├── 上下文管理器
│   ├── Prompt 模板库
│   └── 工具注册中心
│
├── Skill System
│   ├── CRUD 技能
│   ├── 认证技能
│   └── 扩展技能机制
│
└── uni-app 技术栈
    ├── uni-app + TypeScript
    └── uni-ui 组件集成
```

### 8.3 长期目标 (v2.0+)

```
阶段三：平台化演进
├── Repair Engine
│   ├── 错误自动诊断
│   ├── 修复策略库
│   └── 自动修复执行
│
├── 多技术栈扩展
│   ├── NestJS 支持
│   ├── FastAPI 支持
│   └── React 支持
│
├── 协作平台
│   ├── 团队规范共享
│   ├── 模板市场
│   └── 技能市场
│
└── 云服务集成
    ├── 部署自动化
    ├── 监控集成
    └── 持续运维
```

---

## 九、成功标准

### 9.1 产品成功指标

| 指标 | 目标值 | 说明 |
|------|--------|------|
| **项目初始化时间** | < 5 分钟 | 从零到可运行 |
| **CRUD 开发效率** | > 80% | 模板覆盖比例 |
| **Token 成本降低** | > 60% | vs 纯 AI 开发 |
| **代码一致性** | 100% | 规范执行率 |
| **AI 上下文保持** | > 90% | 任务切换上下文完整率 |
| **问题修复效率** | > 70% | 自动修复成功率 |

### 9.2 用户价值

```
lnngfar 为用户带来的价值：

1. 降本
   ├── 降低 AI Token 消耗
   ├── 减少重复代码开发
   └── 降低维护成本

2. 增效
   ├── 快速项目初始化
   ├── 标准化开发流程
   └── AI 持续稳定开发

3. 提质
   ├── 代码质量一致性
   ├── 架构合理性保证
   └── 可持续演化能力
```

---

## 十、附录

### 10.1 术语表

| 术语 | 定义 |
|------|------|
| **Spec** | 结构化的工程描述文档 |
| **Template** | 工业级代码模板 |
| **Skill** | 模块化封装的 AI 能力 |
| **Runtime** | 运行时环境/引擎 |
| **Repair** | 问题诊断与自动修复 |

### 10.2 参考资料

- JHipster 官方网站：https://www.jhipster.tech/
- JHipster Lite：https://github.com/jhipster/jhipster-lite
- Spec First 方法论

---

## 十一、变更记录

| 版本 | 日期 | 变更内容 |
|------|------|----------|
| v0.1.0 | 2026-05-10 | 初稿完成 |
