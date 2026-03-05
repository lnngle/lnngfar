# 数据模型：lnngfar v1

## 1. BlueprintManifest（Blueprint 元信息）

### 字段
- `name`: string，非空，需与逻辑名称一致
- `packageName`: string，必须匹配 `^lnngfar-blueprint-[a-z0-9-]+$`
- `version`: string，语义化版本
- `description`: string，非空
- `target`: string，目标技术栈说明
- `language`: string，生成代码语言
- `engine`: string，依赖框架/引擎
- `testFramework`: string，测试框架名称

### 校验规则
- 必填字段全部存在且类型正确。
- `packageName` 前缀校验失败即拒绝加载。
- `name` 必须等于 `packageName` 去前缀后的后缀。

## 2. BlueprintPackage（Blueprint 包）

### 字段
- `manifest`: BlueprintManifest
- `rootPath`: string，Blueprint 根目录绝对路径
- `templatesPath`: string
- `generatorsPath`: string
- `testsPath`: string
- `readmePath`: string
- `status`: enum(`discovered`,`validated`,`rejected`)

### 校验规则
- `templates/`、`generators/`、`tests/`、`README.md`、`blueprint.json` 必须存在。
- 任一目录或文件缺失时 `status` 转为 `rejected` 并附错误信息。

## 3. GenerationRequest（生成请求）

### 字段
- `command`: string，格式 `lnngfar <blueprint>`
- `blueprintName`: string（v1 支持 `cocos`）
- `workingDirectory`: string，当前工作目录绝对路径
- `nodeVersion`: string

### 校验规则
- `blueprintName` 不能为空。
- `workingDirectory` 必须可写。
- `nodeVersion` 必须满足 `>=18 LTS`。

## 4. GenerationSession（生成会话）

### 字段
- `sessionId`: string
- `request`: GenerationRequest
- `blueprint`: BlueprintPackage
- `stage`: enum(`env`,`discover`,`validate`,`generate`,`test`,`done`,`failed`)
- `startedAt`: string（ISO 时间）
- `endedAt`: string | null
- `errors`: StageError[]

### 状态迁移
`env` → `discover` → `validate` → `generate` → `test` → `done`

任意阶段失败：`当前阶段` → `failed`

## 5. StageError（阶段错误）

### 字段
- `stage`: enum(`environment`,`blueprint`,`generation`,`testing`)
- `code`: string
- `message`: string
- `suggestion`: string | null

### 校验规则
- `stage` 与失败阶段必须一致。
- `message` 必须可读、不可为空。
- 冲突文件失败必须提供“在空目录执行或清理冲突后重试”建议。

## 6. GenerationArtifact（生成产物）

### 字段
- `path`: string，输出路径
- `type`: enum(`file`,`directory`)
- `checksum`: string | null
- `sourceTemplate`: string | null

### 校验规则
- 同输入生成时产物集合与顺序必须一致。
- 写入前若目标路径冲突，直接失败且不覆盖。

## 实体关系

- `GenerationSession` 1:1 关联 `GenerationRequest`
- `GenerationSession` 1:1 关联 `BlueprintPackage`
- `GenerationSession` 1:N 关联 `StageError`
- `GenerationSession` 1:N 关联 `GenerationArtifact`
- `BlueprintPackage` 1:1 关联 `BlueprintManifest`
