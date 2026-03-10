# Skill: 热更新与发布

## 适用场景

- 热更新清单调整
- 版本发布流程梳理
- 回滚方案设计

## 输出要求

1. 版本号策略
2. 清单字段校验点
3. 失败回滚流程

## 约束

- 不跳过热更新相关门禁。
- 变更需说明线上兼容影响。

## 验收

- `npm run check:hot-update`
- `npm run check:hot-update-fixtures`
