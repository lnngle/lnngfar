# Feature Specification: Stack System

**Branch**: p4-stack-system | **Status**: Building

## User Scenarios

### US1 - Stack 加载 (P1)
**Given** 已安装 far-web-java, **When** loadStack('far-web-java'), **Then** 返回解析后的 Stack 对象。

### US2 - Stack 安装 (P1)
**Given** local path 有 stack.yml, **When** installStack('far-web-java', './far-web-java'), **Then** Stack 复制到 ~/.lnngfar/stacks/。

### US3 - Stack 校验 (P2)
**Given** stack.yml 缺少 name 字段, **When** validateStack(), **Then** 返回 ValidationResult{ valid: false, errors: [...] }。

### US4 - far-web-java@0.1 最小版 (P2)
**Given** CLI `stack add far-web-java`, **When** 执行, **Then** 加载成功并可供项目使用。

## Requirements
- **FR-001**: loadStack(name) 从 ~/.lnngfar/stacks/ 加载。
- **FR-002**: installStack(name, source) 支持本地路径安装。
- **FR-003**: validateStack(path) 校验 stack.yml 完整性。
- **FR-004**: far-web-java@0.1 含 stack.yml + project scaffold。
- **FR-005**: CLI `lnngfar stack add` 命令实现（替换 P3 stub）。

## Success Criteria
- **SC-001**: loadStack('far-web-java') 成功加载。
- **SC-002**: 非法 stack.yml 校验失败含 error messages。
- **SC-003**: 回归 P0-P3 全部测试。
