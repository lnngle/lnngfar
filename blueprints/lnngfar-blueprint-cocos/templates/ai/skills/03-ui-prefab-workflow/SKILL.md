# Skill: UI 与 Prefab 工作流

## 适用场景

- 新页面接入
- 弹窗与 HUD 改造
- UI 逻辑与数据绑定

## 输出要求

- 视图层文件清单
- 交互流程说明
- 复用组件抽取建议

## 约束

- `components/layouts` 不依赖 `view`。
- 数据访问尽量通过表数据或配置层。

## 验收

- `npm run test`
- `npm run check:architecture`
