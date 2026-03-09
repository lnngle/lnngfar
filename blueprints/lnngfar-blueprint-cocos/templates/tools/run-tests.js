const { spawnSync } = require("child_process");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

const STEPS = [
    { name: "配置校验", script: "tools/check-config.js" },
    { name: "配置门禁样例校验", script: "tools/check-config-fixtures.js" },
    { name: "配置分层校验", script: "tools/check-runtime-config-structure.js" },
    { name: "资源校验", script: "tools/check-assets.js" },
    { name: "资源门禁样例校验", script: "tools/check-assets-fixtures.js" },
    { name: "架构边界校验", script: "tools/check-architecture.js" },
    { name: "架构门禁样例校验", script: "tools/check-architecture-fixtures.js" },
    { name: "构建变体校验", script: "tools/check-builder-variants.js" },
    { name: "构建门禁样例校验", script: "tools/check-builder-fixtures.js" },
    { name: "热更新清单校验", script: "tools/check-hot-update-manifest.js" },
    { name: "热更新门禁样例校验", script: "tools/check-hot-update-fixtures.js" },
    { name: "启动链路校验", script: "tools/check-main-bootstrap.js" },
    { name: "风格校验", script: "tools/check-style.js" },
];

for (const step of STEPS) {
    console.log(`[run-tests] 开始: ${step.name}`);
    const result = spawnSync(process.execPath, [step.script], {
        cwd: ROOT,
        stdio: "inherit",
    });

    if (result.status !== 0) {
        console.error(`[run-tests] 失败: ${step.name}`);
        process.exit(result.status || 1);
    }
}

console.log("[run-tests] 全部通过");
