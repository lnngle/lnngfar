# 质量门禁

## 最低验收

- `npm run test` 必须通过。

## 场景化补充

- 改 `tools/**`：补跑 `npm run test:unit`。
- 改 `assets/script/**`：补跑 `npm run lint:eslint`。
- 改配置或资源规则：补跑对应 `check:*` 子命令。

## 输出格式要求

提交前请输出：

1. 变更文件列表
2. 执行过的命令
3. 关键日志摘要
4. 风险与回滚点
