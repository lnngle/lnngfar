# lnngfar 详细产品设计

# 一、产品概述

## 1.1 产品名称

lnngfar

## 1.2 产品定位

lnngfar = 基于 spec-kit 的 AI 软件工程运行时与工业化平台。
spec-kit：https://github.com/github/spec-kit

lnngfar 的核心目标：

* 通过「工业模板 + AI 智能」实现真实项目开发
* 通过 spec-kit 实现 AI 可持续演化的软件工程体系
* 通过 Stack 插件化形成长期生态能力
* 通过测试优先保障 AI 生成代码质量
* 通过生命周期管理实现真实项目长期维护

lnngfar 不是简单代码生成器。

lnngfar 是：

* AI 工程系统
* AI 软件工厂基础设施
* AI 软件工业化平台
* spec-kit runtime

---

# 二、产品核心理念

## 2.1 Spec First

所有项目：

```text
需求
→ specs
→ tests
→ implementation
→ deploy
```

不是：

```text
prompt → code
```

spec 是整个 AI 工程系统的核心。

spec 不只是文档。

spec 是：

* AI 长期记忆
* 工程上下文
* 架构约束
* 测试依据
* 生命周期基础

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

* 稳定架构
* 固定最佳实践
* 固定测试结构
* 固定部署结构
* 固定目录结构

AI 负责：

* 业务逻辑
* 增量演化
* 复杂业务生成
* 代码优化
* 测试补全

目标：

* 降低 Token 成本
* 降低 AI 漂移
* 提高稳定性
* 提高长期维护能力

---

## 2.3 Test First

lnngfar 所有项目必须：

```text
spec → tests → implementation
```

AI 必须先生成：

* 单元测试
* API 测试
* E2E 测试

测试通过后才允许生成完整实现。

---

## 2.4 Stack 插件化

stack = 基于 spec-kit 的工程能力插件。

stack 不只是技术栈。

stack 是：

* specs
* templates
* skills
* tests
* deploy
* runtime
* workflows
* agents

的组合。

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
│ far-game-cocos                       │
│ far-ai-agent                         │
└──────────────────────────────────────┘
```

---

# 四、核心模块设计

# 4.1 CLI 模块

## 目标

提供统一工程入口。

CLI 是：

* 项目初始化器
* Stack 管理器
* 生命周期入口
* AI 协作入口

---

## CLI 命令设计

# 初始化项目

```bash
lnngfar init
```

功能：

* 创建项目
* 选择 stack
* 初始化 specs
* 初始化 runtime
* 初始化 tests

---

# 安装 Stack

```bash
lnngfar stack add far-web-java
```

支持：

* 官方 stack
* GitHub stack
* 私有 stack
* 企业 stack

---

# 生成规格

```bash
lnngfar spec
```

功能：

* 基于 spec-kit 生成 specs
* 初始化工程规格
* 初始化模块规格

---

# AI 增量开发

```bash
lnngfar ai "生成订单模块"
```

功能：

* 读取 specs
* 读取 stack
* 读取 templates
* 读取 tests
* AI 增量生成
* 自动测试
* 自动更新 specs

---

# 测试

```bash
lnngfar test
```

功能：

* 单元测试
* API 测试
* E2E 测试
* AI 回归测试

---

# 部署

```bash
lnngfar deploy
```

功能：

* Docker
* Kubernetes
* CI/CD
* 云部署

---

# 运维

```bash
lnngfar ops
```

功能：

* 日志
* 监控
* AI 运维分析
* 告警

---

# 4.2 Spec Engine

## 核心定位

Spec Engine = spec-kit runtime。

负责：

* spec 管理
* spec 校验
* spec 解析
* spec 演化
* spec 索引
* spec 增量同步

---

## Spec 目录结构

```text
specs/
├── product/
├── domain/
├── api/
├── ui/
├── test/
├── deploy/
├── runtime/
└── workflows/
```

---

## Spec 核心能力

### 1. AI 长期记忆

specs 是 AI 的长期工程上下文。

---

### 2. 增量演化

AI 不重新生成项目。

只修改：

```text
changed specs
```

---

### 3. Token 降低

通过 spec 索引：

* 按模块读取
* 按领域读取
* 按上下文读取

减少 Token 消耗。

---

# 4.3 Template Engine

## 核心定位

Template Engine = 工业模板系统。

不是简单代码模板。

而是：

* 工程模板
* 架构模板
* 测试模板
* 部署模板
* AI 工作流模板

---

## 模板层级

# 基础模板

例如：

* crud
* login
* rbac
* upload
* payment

---

# Stack 模板

例如：

## far-web-java

包含：

* vue-admin
* spring-rest
* mybatis-crud
* jwt-auth
* docker-deploy

---

## far-mini-uni

包含：

* uni-page
* uni-request
* uni-store
* mobile-layout

---

# 行业模板

例如：

* erp
* ecommerce
* cms
* game
* iot

---

# 企业模板

企业私有模板：

* 安全规范
* 编码规范
* 部署规范
* 企业组件库

---

# 4.4 Skill Engine

## 核心定位

Skill = AI 工程能力。

不是普通 prompt。

Skill 包含：

* 工程规则
* 编码规则
* 测试规则
* 部署规则
* review 规则

---

## Skill 目录

```text
skills/
├── coding/
├── testing/
├── deploy/
├── security/
├── review/
└── performance/
```

---

## Skill 能力

### coding skill

负责：

* 编码规范
* 架构规范
* 模块生成

---

### testing skill

负责：

* 测试优先
* 单元测试生成
* E2E 测试生成

---

### review skill

负责：

* AI Code Review
* 架构分析
* 性能分析

---

# 4.5 AI Runtime

## 核心定位

AI Runtime = AI 工程运行时。

不是聊天系统。

是：

* 工程上下文系统
* AI 协作系统
* AI 增量演化系统

---

## AI 工作流程

```text
读取 specs
→ 读取 stack
→ 读取 templates
→ 读取 skills
→ 选择模板
→ 生成测试
→ 生成代码
→ 验证
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

---

### 2. Context 裁剪

只读取：

* 当前模块
* 当前 spec
* 当前测试
* 当前上下文

降低 Token。

---

### 3. 增量生成

AI 只修改变化部分。

不是全量重生成。

---

### 4. AI 可持续演化

项目长期维护时：

AI 仍然能理解项目。

---

# 4.6 Lifecycle Engine

## 核心定位

统一项目生命周期管理。

覆盖：

* 初始化
* 开发
* 测试
* 部署
* 运维
* 演化

---

## 生命周期阶段

### init

项目初始化。

---

### develop

AI 增量开发。

---

### verify

自动验证：

* lint
* unit test
* api test
* e2e test

---

### deploy

自动部署。

---

### ops

运行监控。

---

### evolve

AI 持续演化。

---

# 五、Stack 系统设计

# 5.1 Stack 定义

stack = 基于 spec-kit 的工业化工程能力包。

---

# 5.2 Stack 目录结构

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
├── runtime/
└── agents/
```

---

# 5.3 Stack 配置示例

```yaml
name: far-web-java

type: fullstack

frontend:
  framework: vue3

backend:
  framework: springboot

database:
  orm: mybatis

test:
  frontend: vitest
  backend: junit5

deploy:
  docker: true
```

---

# 5.4 官方 Stack

## far-web-java

定位：

企业级 Web 全栈。

技术：

* Vue3
* TypeScript
* Spring Boot
* MyBatis
* MySQL
* JWT
* Docker

适用：

* ERP
* SaaS
* CMS
* 管理系统

---

## far-mini-uni

定位：

跨端小程序全栈。

技术：

* uni-app
* TypeScript
* uni-ui
* Pinia
* uview-plus

适用：

* 微信小程序
* 抖音小程序
* App

---

# 六、测试优先体系

# 6.1 测试流程

```text
spec
→ test
→ implementation
→ verify
```

---

# 6.2 测试类型

## 单元测试

覆盖：

* services
* utils
* domain logic

---

## API 测试

覆盖：

* REST API
* authentication
* authorization

---

## E2E 测试

覆盖：

* 用户流程
* 页面流程
* 核心业务流程

---

## AI 回归测试

覆盖：

* AI 修改稳定性
* AI 演化验证

---

# 七、项目目录结构

```text
my-project/
├── .lnngfar/
│   ├── project.yml
│   ├── stack.lock
│   ├── ai/
│   ├── runtime/
│   └── cache/
│
├── specs/
│   ├── product/
│   ├── domain/
│   ├── api/
│   ├── ui/
│   ├── test/
│   └── deploy/
│
├── skills/
│
├── templates/
│
├── apps/
│
├── services/
│
├── tests/
│
├── deploy/
│
└── docs/
```

---

# 八、安全设计

# 8.1 AI Key 管理

用户配置：

```text
OPENAI_API_KEY
DEEPSEEK_API_KEY
GLM_API_KEY
```

---

# 8.2 安全机制

## 本地加密存储

优先本地。

---

## 系统密钥链

使用系统 Keychain。

---

## 权限隔离

不同项目独立。

---

## 企业模式

支持私有 AI Gateway。

---

# 九、开发模式

# 9.1 CLI 模式

用户本地开发。

---

# 9.2 IDE 模式

支持：

* VSCode
* Cursor
* Windsurf
* JetBrains

---

# 9.3 Cloud 模式

未来支持：

* 云端 AI 工厂
* 多 Agent
* 团队协作

---

# 十、lnngfar 自举体系

# 10.1 lnngfar 本身基于 spec-kit 开发

lnngfar 自身必须：

```text
spec-kit
→ specs
→ AI generate
→ tests
→ evolve
```

---

# 10.2 Stack 生成项目也基于 spec-kit

所有生成项目：

必须存在：

```text
specs/
```

AI 后续持续演化项目。

---

# 十一、MVP 设计

# 第一阶段目标

只做：

* spec-kit 集成
* stack 系统
* industrial templates
* AI incremental generation
* test-first workflow

---

# 第一阶段 Stack

## far-web-java

## far-mini-uni

---

# 第一阶段 AI 能力

只支持：

* CRUD
* login
* RBAC
* simple business flow

---

# 第一阶段不做

* 多 Agent
* 云平台
* Stack Marketplace
* AI 自动运维
* AI 自动架构优化

---

# 十二、未来演进路线

# 第一阶段

AI 全栈生成器。

---

# 第二阶段

AI 软件工程平台。

---

# 第三阶段

AI 软件工厂。

---

# 第四阶段

Stack Marketplace。

形成：

* stack 生态
* template 生态
* skill 生态
* agent 生态

---

# 十三、竞争优势

| 能力        | lnngfar | 普通AI代码工具 |
| --------- | ------- | -------- |
| spec-kit  | ✓       | ×        |
| 工业模板      | ✓       | ×        |
| 测试优先      | ✓       | ×        |
| Stack 插件化 | ✓       | ×        |
| 生命周期管理    | ✓       | ×        |
| AI 持续演化   | ✓       | ×        |
| Token 优化  | ✓       | ×        |

---

# 十四、最终产品定义

## 技术定义

lnngfar = 基于 spec-kit 的 AI 软件工程运行时与工业化平台。

---

## 产品定义

lnngfar = 一个通过“工业模板 + AI 智能”实现真实项目持续开发、维护与演化的 AI 全栈工程系统。

---

## 官网一句话

lnngfar = AI-native industrial software engineering platform.
