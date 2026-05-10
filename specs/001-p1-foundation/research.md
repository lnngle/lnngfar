# Research: lnngfar Foundation

## 1. Monorepo 工具选择

**决策**: pnpm workspace  
**理由**:

- 原生 workspace 协议（`workspace:*`），无需额外工具
- 比 npm/yarn 更快，硬链接节省磁盘
- 与 lnngfar Constitution 中 "每个 package 独立 build" 一致

**替代方案**: npm workspaces（速度慢）, yarn workspaces（额外依赖）, turborepo（过度设计，P1 不需要）

---

## 2. 构建策略

**决策**: 不引入构建工具（Webpack/Rollup/esbuild）  
**理由**:

- P1 所有 package 是纯 TypeScript 类型 + 简单函数，无浏览器目标
- Node.js 22+ 原生支持 TypeScript（--experimental-strip-types）及 tsx
- Vitest 可直接运行源码，无需预构建
- 后续 P3 CLI 阶段再引入 esbuild 打包最终可执行文件

---

## 3. 测试框架

**决策**: Vitest  
**理由**:

- 与 Vite 生态一致，零配置兼容 TypeScript
- 比 Jest 更快，原生 ESM 支持
- workspace 模式支持 Monorepo 多包测试

---

## 4. 配置格式

**决策**: 同时支持 JSON 和简易 YAML  
**理由**:

- JSON 作为机器生成格式（`lnngfar.config.json`）
- YAML 作为人类编辑格式（`project.yml`）
- P1 使用手写简易 YAML parser，避免引入 `js-yaml` 依赖
- P6 Spec Engine 阶段再引入完整 YAML 解析

---

## 5. 日志设计

**决策**: 自建 `createLogger`，不使用 winston/pino  
**理由**:

- P1 只需基础日志功能（级别 + 格式化）
- 避免过度依赖重量级日志库
- 后续可替换为结构化日志（P8 AI Runtime 阶段）
