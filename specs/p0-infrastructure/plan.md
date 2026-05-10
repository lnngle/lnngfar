# P0 - Infrastructure Plan

## Architecture

```
 lnngfar/
 ├── .specify/extensions.yml   ← hook 优化
 ├── .codebuddy/commands/      ← 验证 speckit 命令
 ├── .lnngfar/                 ← 创建 ai/ runtime/ 子目录
 ├── specs/                    ← 创建规划目录
 └── docs/                     ← 设计文档已存在
```

## Data Flow

```
 检查 Node.js ≥ 20
 → 安装 pnpm ≥ 8
 → 验证 .codebuddy/commands/speckit.*.md (14 files)
 → 创建目录: specs/ .lnngfar/ai/ .lnngfar/runtime/
 → 禁用 14 个 auto-commit hook (保留 initialize + feature)
 → commit + push
```

## Dependencies
无前置阶段依赖。
