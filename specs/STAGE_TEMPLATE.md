# P{N} 阶段开发规范模板

> 每个新阶段使用本模板，确保与 P0/P1 完全一致。

---

## 一、目录命名

```
specs/p{N}-{name}/           # N 与 lnngfar-speckit.md 保持一致
示例: p2-runtime-core, p3-cli-system
```

## 二、必创文档清单（按创建顺序）

| # | 文件 | 创建阶段 | 内容要求 |
|---|------|----------|----------|
| 1 | `spec.md` | specify | 用户故事 + Given/When/Then + FR-xxx + SC-xxx + Edge Cases + Assumptions |
| 2 | `research.md` | plan Phase 0 | 技术选型决策 + 理由 + 替代方案 |
| 3 | `data-model.md` | plan Phase 1 | 实体定义 + 字段表 + 校验规则 + 状态迁移 |
| 4 | `quickstart.md` | plan Phase 1 | 安装命令 + 测试命令 + 预期输出 |
| 5 | `contracts/*.md` | plan Phase 1 | API 前置/后置条件 + 错误类型 + 依赖图 |
| 6 | `plan.md` | plan | Technical Context + Constitution Check + Project Structure |
| 7 | `tasks.md` | tasks | Phase 分组 + [P] 并行标记 + 任务依赖图 |
| 8 | `checklist.md` | checklist | FR 覆盖对照表 + 测试覆盖表 + Gate Decision |

## 三、spec.md 质量要求

```markdown
✅ 必须有 section:
  - User Scenarios & Testing (含 ≥1 个 User Story)
  - Edge Cases (≥3 个边界场景)
  - Functional Requirements (FR-xxx ≥ 3 个)
  - Success Criteria (SC-xxx ≥ 2 个，可量化)
  - Assumptions

✅ User Story 格式:
  - Priority (P1/P2/P3) + Priority Rationale + Independent Test
  - Acceptance Scenarios: Given/When/Then 格式

✅ FR 格式: FR-{数字} 系统必须{描述}
✅ SC 格式: SC-{数字} {可量化指标}
```

## 四、tasks.md 相位结构

```markdown
## Phase 1: Setup (Project Scaffold)

## Phase 2: Foundational (阻塞所有 User Story)

## Phase 3: User Story N — {标题} (Priority: P{N})
  每个 task 标记 [US{N}]，含文件路径

## Phase N: Polish & Cross-Cutting
  文档创建 + 回归验证
```

## 五、checklist.md 必须包含

```markdown
## Content Quality              ← spec 质量
## Requirement Completeness     ← FR/SC 完整性
## Implementation Coverage      ← 每个 FR 对应实现文件
## Test Coverage                ← 测试与 spec 对照表
## Regression                   ← 回归 P0-P(N-1) 验证
## Gate Decision                ← PASS / FAIL + 理由
```

## 六、阶段间一致性验证

每个阶段完成后执行：

```bash
# 1. FR 覆盖验证: 每个 FR-xxx 有对应实现文件

# 2. 回归验证: 全部已有测试通过
pnpm test

# 3. 文档完整性: p{N}-{name}/ 下 8 类文档齐全
#    spec.md / plan.md / tasks.md / data-model.md /
#    research.md / quickstart.md / contracts/*.md / checklist.md
```

## 七、禁止事项

| ❌ 禁止 | ✅ 应该 |
|---------|--------|
| spec 中写实现细节（技术栈、框架） | spec 只写用户故事和需求 |
| FR 无编号 | 使用 FR-xxx 编号 |
| tasks 无 Phase 分组 | 按 Setup→Foundational→US→Polish 分组 |
| checklist 无 FR 对照表 | 每个 FR 列出对应实现文件 |
| 目录名与 speckit 不一致 | 严格使用 `p{N}-{name}` |
| 跳过回归验证 | 每阶段结束验证 P0-P(N-1) 全部测试 |
