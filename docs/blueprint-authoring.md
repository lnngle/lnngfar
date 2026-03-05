# Blueprint 开发说明

## 命名规则

- npm 包名必须以 `lnngfar-blueprint-` 开头。
- 逻辑名称为前缀后缀部分，例如 `lnngfar-blueprint-cocos` 的逻辑名称是 `cocos`。

## 最小结构

每个 Blueprint 必须包含：

- `blueprint.json`
- `templates/`
- `generators/`
- `tests/`
- `README.md`

## blueprint.json 必需字段

- `name`
- `packageName`
- `version`
- `description`
- `target`
- `language`
- `engine`
- `testFramework`

## 生成器约定

- 生成器返回 `{ path, content }` 列表。
- 路径应为相对路径，内容应为确定性文本。
- 不得在生成器中引入随机值。
