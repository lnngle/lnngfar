# Skill: 数据与配置流水线

## 适用场景

- 新增配置项
- 表数据结构调整
- 运行时配置分层治理

## 流程

1. 调整配置源（json/excel）
2. 执行类型生成（如需要）
3. 校验结构与默认值

## 约束

- 配置改动必须解释兼容策略。
- 避免在业务代码中硬编码环境值。

## 验收

- `npm run check:config`
- `npm run check:config-structure`
- `npm run test`
