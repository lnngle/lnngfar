# lnngfar Constitution

## 项目宪法

### 代码规范
- 语言：TypeScript strict mode
- 格式：Prettier (2 spaces, single quote, trailing commas)
- Lint：ESLint (recommended + @typescript-eslint)
- 命名：camelCase 函数/变量，PascalCase 类/接口，kebab-case 文件名

### 架构约束
- Monorepo：pnpm workspace
- 包命名：`@lnngfar/<package-name>`
- 模块通信：接口契约，避免循环依赖

### 质量标准
- 每个 package 必须有 Vitest 单元测试
- PR 必须通过 lint + test + build
- 公开 API 必须有 JSDoc

### Speckit 规范
- 每个 P 阶段：specify → plan → tasks → implement → checklist → analyze
- Spec 存放：`specs/p{N}-{name}/`
