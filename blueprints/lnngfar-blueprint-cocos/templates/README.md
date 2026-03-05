# {{PROJECT_NAME}}

基于 `lnngfar-blueprint-cocos` 生成的小游戏项目模板。

## 项目目标

- 提供可直接扩展的小游戏代码骨架
- 按模块分层组织：入口、核心、玩法、平台、UI、资源
- 内置单元测试样例，便于回归验证

## 目录说明

- `assets/scripts/entry/`：项目启动入口
- `assets/scripts/core/`：应用装配与通用类型
- `assets/scripts/gameplay/`：玩法循环、模型与系统
- `assets/scripts/platform/`：平台适配器
- `assets/scripts/ui/`：UI 视图层
- `assets/resources/`：游戏配置与关卡数据
- `tests/`：模板基础测试

## 本地开发

```powershell
npm install
npm test
npm run build
```
