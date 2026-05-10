# P1 - Foundation Plan

## Architecture

```
 lnngfar/
 ├── package.json              ← pnpm workspace root
 ├── pnpm-workspace.yaml       ← Monorepo 定义
 ├── tsconfig.base.json        ← 共享 TS 配置
 ├── vitest.workspace.ts       ← 共享测试配置
 ├── .eslintrc.json            ← lint 规则
 ├── .prettierrc               ← format 规则
 ├── .gitignore                ← ignore node_modules/dist/.lnngfar
 ├── .github/workflows/ci.yml  ← lint + test + build
 │
 └── packages/
     ├── types/                ← @lnngfar/types        (共享类型)
     ├── logger/               ← @lnngfar/logger       (createLogger)
     ├── config-loader/        ← @lnngfar/config-loader(loadConfig)
     └── workspace-manager/    ← @lnngfar/workspace-mgr(loadWorkspace)
```

## Data Model

```
LnngfarConfig {
  project: ProjectInfo { name, description, version, created }
  stack: StackRef { name, version, source }
  ai?: AiConfig, skills?: string[], templates?: TemplateConfig
  test?: TestConfig, deploy?: DeployConfig
}

Workspace { root: string, packages: PackageInfo[], config: LnngfarConfig | null }
Project { name: string, path: string, config: LnngfarConfig }
Logger { debug, info, warn, error }
```

## API Design

| Module | API | Signature |
|--------|-----|-----------|
| logger | `createLogger` | `(name, level?) → Logger` |
| config-loader | `loadConfig` | `(path) → LnngfarConfig` |
| config-loader | `validateConfig` | `(config) → boolean` |
| workspace-manager | `loadWorkspace` | `(rootPath) → Workspace` |
| workspace-manager | `createProject` | `(name, opts?) → Project` |

## Dependencies

```
@lnngfar/types        ← 无依赖
@lnngfar/logger       ← @lnngfar/types
@lnngfar/config-loader ← @lnngfar/types
@lnngfar/workspace-mgr ← @lnngfar/types + @lnngfar/logger + @lnngfar/config-loader
```
