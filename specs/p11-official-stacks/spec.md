# Feature Specification: Official Stacks

**Feature Branch**: `p11-official-stacks` | **Status**: Done

## User Scenarios

### US1 - far-web-java 完整版 (P1)
**Given** P4 已有 stack.yml, **When** 添加 module/frontend 模板和 skills, **Then** Stack 可生成完整企业级脚手架。

### US2 - far-mini-uni 完整版 (P1)
**Given** uni-app 技术栈, **When** 安装 far-mini-uni, **Then** 可获得跨端小程序完整模板。

### US3 - Stack 加载验证 (P2)
**Given** 两个 Stack 完整, **When** P4 Stack System 安装后, **Then** loadStack 成功返回。

## Edge Cases
- 模板文件缺失时 validateStack 返回错误
- 空 skills/ 目录时 loadSkillsFromStack 返回空数组

## Requirements
- **FR-001**: far-web-java module 模板: spring-rest, mybatis-crud, jwt-auth (各1 tmpl)
- **FR-002**: far-web-java frontend 模板: vue-admin, element-form, auth-page (各1 tmpl)
- **FR-003**: far-web-java skills: coding.yaml, testing.yaml, security.yaml
- **FR-004**: far-mini-uni 含 stack.yml + project scaffold
- **FR-005**: far-mini-uni page 模板: uni-page, uni-request, uni-store (各1 tmpl)
- **FR-006**: far-mini-uni component 模板: mobile-layout 和 skills

## Success Criteria
- **SC-001**: far-web-java 6 tmpl + 3 skill yaml = 9 files
- **SC-002**: far-mini-uni 5 tmpl + 2 skill yaml + stack.yml = 8 files
- **SC-003**: validateStack(path) 对两个 stack 返回 valid:true
- **SC-004**: 回归 P0-P10 全部测试通过
