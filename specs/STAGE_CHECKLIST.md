# P{N} 阶段一致性检查清单

每个阶段开发完成后，逐项勾选本清单。

## 1. 文档完整性

- [ ] specs/p{N}-{name}/spec.md
- [ ] specs/p{N}-{name}/plan.md
- [ ] specs/p{N}-{name}/tasks.md
- [ ] specs/p{N}-{name}/data-model.md
- [ ] specs/p{N}-{name}/research.md
- [ ] specs/p{N}-{name}/quickstart.md
- [ ] specs/p{N}-{name}/contracts/*.md
- [ ] specs/p{N}-{name}/checklist.md

## 2. spec.md 质量

- [ ] ≥1 User Story (Priority + Rationale + Independent Test)
- [ ] Given/When/Then acceptance scenarios
- [ ] ≥3 Edge Cases
- [ ] FR-xxx numbered + SC-xxx quantifiable
- [ ] Assumptions filled

## 3. FR 覆盖验证

- [ ] FR-001 → ________
- [ ] FR-002 → ________
- [ ] FR-0xx → ________
(每个 FR 有明确实现文件)

## 4. 测试验证

- [ ] pnpm test → all pass
- [ ] pnpm lint → 0 errors
- [ ] 每个公开 API 有对应测试

## 5. 回归验证

- [ ] P0: .lnngfar/ + .codebuddy/commands/ 完整
- [ ] P1: 4 packages 依赖方向正确
- [ ] P2-P(N-1): 全部已有测试通过

## 6. Gate Decision

- [ ] PASS / FAIL → ________
