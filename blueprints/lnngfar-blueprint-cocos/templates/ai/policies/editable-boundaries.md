# 可改目录边界

## AI 可改（默认）

- `assets/script/**`
- `assets/resources/config.json`
- `README.md`
- `tests/**`（业务测试）
- `ai/**`

## AI 谨慎改（需说明风险）

- `package.json`
- `tsconfig.json`
- `settings/v2/packages/*.json`

## AI 禁改（默认）

- `.creator/**`
- `node_modules/**`
- `extensions/**`
- `assets/**/*.meta`
- 二进制资源（`.png` `.jpg` `.prefab` `.scene` `.xlsx`）
- `extensions.lock.json`

## 例外规则

用户明确授权时可突破禁改，但必须写明：

- 授权范围
- 影响目录
- 回滚方案
