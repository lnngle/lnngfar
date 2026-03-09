# CLI 契约：lnngfar v1

## 命令签名

```text
lnngfar <blueprint>
```

执行命令时，CLI 会以英文交互提示输入项目名：

```text
Enter project name (default: <blueprint>-project):
```

若直接回车，默认项目名为 `<blueprint后缀>-project`。

## v1 支持矩阵

- 支持：`lnngfar cocos`
- 不支持：除 `cocos` 外的其他 blueprint 名称

## 执行阶段（固定顺序）

1. 环境校验（Node.js `>=18 LTS`）
2. Blueprint 发现与加载（仅本地依赖）
3. Blueprint 合法性校验（结构 + manifest）
4. Blueprint 生成执行（默认输出到当前工作目录下的项目名子目录）
5. Blueprint 自身自动化测试
6. 输出成功/失败结果

## 输入约束

- `blueprint` 为必填位置参数。
- 项目名交互仅允许字母、数字、`-`、`_`。
- 非 TTY 环境自动使用默认项目名，不进入交互。
- 当前工作目录下目标项目名子目录若存在冲突文件/目录则立即失败。

## 输出约束

- 成功：返回 0，输出完成提示与关键产物路径。
- 失败：返回非 0，输出失败阶段与错误原因。

## 错误模型

```json
{
  "stage": "environment|blueprint|generation|testing",
  "code": "STRING_CODE",
  "message": "可读错误信息",
  "suggestion": "可选修复建议"
}
```

## 典型失败契约

### 环境失败
- 条件：Node.js 版本低于 18 LTS
- 结果：`stage=environment`，返回非 0

### Blueprint 失败
- 条件：包名不符合 `lnngfar-blueprint-` 前缀或缺少必需目录/字段
- 结果：`stage=blueprint`，返回非 0

### 生成失败
- 条件：目标目录冲突
- 结果：`stage=generation`，返回非 0，`suggestion` 必须提示在空目录执行或清理冲突

### 测试失败
- 条件：Blueprint 自身测试失败
- 结果：`stage=testing`，返回非 0
