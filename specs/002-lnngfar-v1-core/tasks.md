---
description: "lnngfar v1 实现任务清单"
---

# 任务清单：lnngfar v1 Blueprint 驱动内核与 cocos Blueprint 交付

**输入**: `specs/002-lnngfar-v1-core/` 下的 `plan.md`、`spec.md`、`research.md`、`data-model.md`、`contracts/`、`quickstart.md`  
**前置条件**: `/speckit.plan` 已完成且宪章门禁为 PASS

**测试说明**: 本功能规格明确要求测试优先与测试门禁，因此包含测试任务。  
**组织方式**: 任务按用户故事分组，确保每个故事可独立实现、独立测试、独立演示。

## 格式：`[ID] [P?] [Story?] Description with file path`

---

## Phase 1：初始化（共享基础设施）

**目的**: 建立 TypeScript CLI 项目与统一开发工具链

- [X] T001 创建项目基础目录结构于 `src/`、`tests/`、`blueprints/lnngfar-blueprint-cocos/`
- [X] T002 初始化 npm 项目并写入基础脚本到 `./package.json`
- [X] T003 [P] 配置 TypeScript 编译选项到 `./tsconfig.json`
- [X] T004 [P] 配置 Jest 测试框架到 `./jest.config.ts`
- [X] T005 [P] 配置 ESLint/Prettier 到 `eslint.config.js` 与 `.prettierrc`
- [X] T006 配置 CLI 入口映射到 `./package.json` 的 `bin.lnngfar`

---

## Phase 2：基础阻塞能力（完成前不得进入故事阶段）

**目的**: 实现所有用户故事共享的核心执行骨架与契约门禁

- [X] T007 定义阶段与错误模型到 `src/errors/stage-error.ts`
- [X] T008 [P] 实现 Node.js 版本校验器到 `src/core/env-check.ts`
- [X] T009 [P] 实现本地依赖 Blueprint 发现器到 `src/discovery/local-blueprint-resolver.ts`
- [X] T010 [P] 实现 Blueprint 名称映射器到 `src/discovery/blueprint-name-mapper.ts`
- [X] T011 [P] 集成 JSON Schema 校验器到 `src/validation/manifest-validator.ts`
- [X] T012 实现 Blueprint 结构校验器到 `src/validation/structure-validator.ts`
- [X] T013 [P] 实现目录冲突检测器到 `src/execution/conflict-detector.ts`
- [X] T014 [P] 实现确定性写入器到 `src/execution/deterministic-writer.ts`
- [X] T015 实现 Blueprint 测试执行器到 `src/execution/blueprint-test-runner.ts`
- [X] T016 实现固定阶段流水线到 `src/core/pipeline.ts`
- [X] T017 集成 CLI 调度入口到 `src/cli/index.ts`
- [X] T018 建立内置 Blueprint 基础清单到 `blueprints/lnngfar-blueprint-cocos/blueprint.json`

**检查点**: 核心阶段流水线可运行，且所有用户故事可在其上展开

---

## Phase 3：用户故事 1 - 一键生成 cocos 工程（P1）🎯 MVP

**目标**: 执行 `lnngfar cocos` 生成完整可用脚手架，并满足确定性与冲突失败策略  
**独立测试标准**: 在全新空目录执行命令后，产物结构完整；重复执行输出一致；冲突目录执行时失败且提示修复建议

### 测试任务（先写并先失败）

- [X] T019 [P] [US1] 编写 CLI 成功路径契约测试到 `tests/contract/cli-cocos-success.contract.test.ts`
- [X] T020 [P] [US1] 编写确定性生成集成测试到 `tests/integration/deterministic-generation.int.test.ts`
- [X] T021 [P] [US1] 编写目录冲突失败集成测试到 `tests/integration/generation-conflict.int.test.ts`

### 实现任务

- [X] T022 [US1] 实现 cocos Blueprint 生成入口到 `blueprints/lnngfar-blueprint-cocos/generators/index.ts`
- [X] T023 [P] [US1] 添加工程基础模板到 `blueprints/lnngfar-blueprint-cocos/templates/`
- [X] T024 [P] [US1] 添加 oops-framework 初始化模板到 `blueprints/lnngfar-blueprint-cocos/templates/assets/script/`
- [X] T025 [P] [US1] 添加模板初始模块骨架到 `blueprints/lnngfar-blueprint-cocos/templates/assets/script/game/`
- [X] T026 [US1] 接入生成阶段执行逻辑到 `src/execution/generate-from-blueprint.ts`
- [X] T027 [US1] 在流水线中接入冲突检测与确定性写入到 `src/core/pipeline.ts`
- [X] T028 [US1] 更新生成成功输出信息到 `src/cli/output.ts`
- [X] T053 [P] [US1] 编写默认输出到当前工作目录的集成测试到 `tests/integration/default-output-cwd.int.test.ts`
- [X] T054 [US1] 在生成入口中固化默认输出目录为当前工作目录到 `src/execution/generate-from-blueprint.ts`
- [X] T055 [US1] 增加内置 Blueprint 自身测试用例到 `blueprints/lnngfar-blueprint-cocos/tests/generator.spec.ts`

**检查点**: US1 可单独交付并通过独立验证（MVP）

---

## Phase 4：用户故事 2 - 第三方 Blueprint 规范接入（P1）

**目标**: 支持第三方 Blueprint 在不改核心代码前提下被发现、校验与执行  
**独立测试标准**: 合法包可执行，非法命名/缺字段/缺目录包在 Blueprint 阶段明确失败

### 测试任务（先写并先失败）

- [X] T029 [P] [US2] 编写本地依赖发现契约测试到 `tests/contract/local-discovery.contract.test.ts`
- [X] T030 [P] [US2] 编写包名前缀拒绝契约测试到 `tests/contract/prefix-validation.contract.test.ts`
- [X] T031 [P] [US2] 编写 manifest 缺字段集成测试到 `tests/integration/manifest-validation.int.test.ts`

### 实现任务

- [X] T032 [US2] 在发现器中强制本地依赖扫描到 `src/discovery/local-blueprint-resolver.ts`
- [X] T033 [US2] 在校验阶段串联 schema 与结构校验到 `src/validation/index.ts`
- [X] T034 [US2] 在流水线中实现非法 Blueprint 快速失败到 `src/core/pipeline.ts`
- [X] T035 [US2] 提供第三方 Blueprint 接入示例到 `blueprints/examples/lnngfar-blueprint-example/blueprint.json`
- [X] T036 [US2] 编写接入说明文档到 `docs/blueprint-authoring.md`

**检查点**: US2 可单独验证第三方接入能力，不依赖 US3/US4

---

## Phase 5：用户故事 3 - 失败可定位且可恢复（P2）

**目标**: 任意失败场景均提供明确阶段、错误信息与修复建议  
**独立测试标准**: 环境/Blueprint/生成/测试四类失败均可准确标注阶段并返回非 0

### 测试任务（先写并先失败）

- [X] T037 [P] [US3] 编写环境失败阶段测试到 `tests/integration/error-stage-environment.int.test.ts`
- [X] T038 [P] [US3] 编写 Blueprint 失败阶段测试到 `tests/integration/error-stage-blueprint.int.test.ts`
- [X] T039 [P] [US3] 编写测试失败阶段测试到 `tests/integration/error-stage-testing.int.test.ts`

### 实现任务

- [X] T040 [US3] 定义统一错误码与建议文案到 `src/errors/error-codes.ts`
- [X] T041 [US3] 实现阶段化错误格式化输出到 `src/errors/error-presenter.ts`
- [X] T042 [US3] 在 CLI 中落实非零退出码策略到 `src/cli/index.ts`
- [X] T043 [US3] 在生成冲突场景补充修复建议输出到 `src/execution/conflict-detector.ts`

**检查点**: US3 独立运行时可完整验证失败可观测性

---

## Phase 6：用户故事 4 - AI 可持续演进（P3）

**目标**: 明确核心与 Blueprint 边界，支持增量扩展不破坏稳定性  
**独立测试标准**: 新增最小 Blueprint 可接入执行且无需改动核心代码

### 测试任务（先写并先失败）

- [X] T044 [P] [US4] 编写第三方扩展集成测试到 `tests/integration/third-party-extension.int.test.ts`

### 实现任务

- [X] T045 [US4] 提炼 Blueprint 加载契约类型到 `src/core/contracts/blueprint-contract.ts`
- [X] T046 [US4] 实现可扩展阶段运行器到 `src/core/stage-runner.ts`
- [X] T047 [US4] 补充架构边界说明到 `./README.md`
- [X] T056 [P] [US4] 编写 Blueprint 升级兼容回归测试到 `tests/integration/blueprint-upgrade-compat.int.test.ts`

**检查点**: US4 独立验证通过后，扩展路径闭环

---

## Final Phase：完善与横切关注点

**目的**: 收敛跨故事质量项，完成交付基线

- [X] T048 [P] 补充核心单元测试覆盖到 `tests/unit/`
- [X] T049 [P] 补充契约测试矩阵到 `tests/contract/`
- [X] T050 更新快速验证步骤与命令到 `specs/002-lnngfar-v1-core/quickstart.md`
- [X] T051 配置 CI 执行测试门禁到 `.github/workflows/ci.yml`
- [X] T052 更新交付说明与版本记录到 `./README.md`
- [X] T057 [P] 补充 CLI 生成性能基准测试到 `tests/performance/cli-cocos-benchmark.perf.test.ts`
- [X] T058 设计新手首跑成功率验证脚本到 `tests/e2e/first-run-success.e2e.test.ts`
- [X] T059 [US1] 将 cocos Blueprint 升级为完整小游戏项目模板并补齐关键集成校验
- [X] T060 [US1] 增强 CLI 安装可用性并补齐 README 使用与排错文档
- [X] T061 [US1] 增加模板行为测试并在 lnngfar 集成测试中执行生成项目测试
- [X] T062 [US1] 迁移模板为 Creator 可导入骨架并移除遗留 `assets/scripts` 与模板内示例测试目录
- [X] T063 [US1] 为生成内核增加二进制产物写入能力并支持 blueprint 生成器输出 base64 内容
- [X] T064 [US1] 补齐 oops 资源目录 `assets/bundle`、`assets/libs`、`assets/resources` 及对应集成校验
- [X] T065 [US1] 增加 Creator 版本探测与 `LNNGFAR_COCOS_CREATOR_VERSION` 覆盖能力
- [X] T066 [US1] 为生成工程补齐单元测试与集成测试模板并接入仓库级回归校验

---

## 依赖与执行顺序

### 阶段依赖

- Phase 1 → Phase 2 → Phase 3/4/5/6 → Final Phase
- 用户故事阶段全部依赖 Phase 2 完成。
- US1（MVP）完成后即可先行演示；US2/US3/US4 可并行增量推进。

### 用户故事依赖

- **US1**: 仅依赖 Phase 2，完成后即可独立交付。
- **US2**: 依赖 Phase 2，可与 US1 并行，但不依赖 US1 代码完成。
- **US3**: 依赖 Phase 2，可并行于 US1/US2，关注错误链路。
- **US4**: 依赖 Phase 2，可并行推进，关注扩展边界。

### 每个故事内部顺序

- 先测试任务（契约/集成）再实现任务。
- 模型/契约相关改动优先于服务与流水线接入。
- 同一文件上的任务按编号顺序执行。

### 并行机会

- Phase 1：T003/T004/T005 可并行。
- Phase 2：T008/T009/T010/T011/T013/T014 可并行。
- US1：T019/T020/T021 可并行，T023/T024/T025 可并行。
- US1：T053 可与 US1 其余测试任务并行。
- US2：T029/T030/T031 可并行。
- US3：T037/T038/T039 可并行。
- US4：T056 可与 T045/T046 并行。
- Final：T048/T049 可并行。
- Final：T057 可与 T048/T049 并行。

---

## 并行示例

### 并行示例 A：US1 测试先行

- `T019 tests/contract/cli-cocos-success.contract.test.ts`
- `T020 tests/integration/deterministic-generation.int.test.ts`
- `T021 tests/integration/generation-conflict.int.test.ts`

### 并行示例 B：US2 校验能力

- `T029 tests/contract/local-discovery.contract.test.ts`
- `T030 tests/contract/prefix-validation.contract.test.ts`
- `T031 tests/integration/manifest-validation.int.test.ts`

---

## 实施策略

### MVP 优先范围

- 推荐 MVP：**仅交付 US1（Phase 3）**。
- 执行顺序：Phase 1 → Phase 2 → Phase 3 → 验证后演示。

### 增量交付路径

1. 完成 US1，先保证生成能力可用。
2. 完成 US2，补齐第三方接入能力。
3. 完成 US3，补齐失败可观测性。
4. 完成 US4，固化可扩展边界与文档。
5. Final Phase 统一收口质量与 CI。
