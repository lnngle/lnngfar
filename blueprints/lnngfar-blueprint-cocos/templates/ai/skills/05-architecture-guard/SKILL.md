# Skill: 架构边界守卫

## 适用场景

- 跨模块重构
- 依赖方向调整
- 代码评审前风险检查

## 必查项

- 是否违反 account -> initialize 禁止依赖
- 是否违反 initialize -> account 实现层依赖限制
- 是否在 components/layouts 误依赖 view

## 输出要求

- 依赖变化清单
- 潜在违规点
- 修复建议

## 验收

- `npm run check:architecture`
- `npm run test`
