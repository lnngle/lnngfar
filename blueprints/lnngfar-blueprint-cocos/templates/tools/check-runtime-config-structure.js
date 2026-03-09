const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const BASE = path.join(ROOT, "assets", "script", "game", "common", "config");

const REQUIRED_FILES = [
    "RuntimeConfigService.ts",
    "RuntimeConfigGuards.ts",
    "RuntimeEnvResolver.ts",
    "runtime-config-schema.ts",
];

function run() {
    const missing = REQUIRED_FILES.filter((name) => !fs.existsSync(path.join(BASE, name)));
    if (missing.length > 0) {
        console.error(`[check-runtime-config-structure] 缺少文件: ${missing.join(", ")}`);
        process.exit(1);
    }

    const service = fs.readFileSync(path.join(BASE, "RuntimeConfigService.ts"), "utf-8");
    const facade = fs.readFileSync(path.join(BASE, "runtime-config-schema.ts"), "utf-8");

    if (!service.includes("RuntimeConfigGuards") || !service.includes("RuntimeEnvResolver")) {
        console.error("[check-runtime-config-structure] RuntimeConfigService 未依赖 guards/resolver 分层");
        process.exit(1);
    }

    if (!facade.includes("validateRuntimeConfigAsset") || !facade.includes("normalizeEnv")) {
        console.error("[check-runtime-config-structure] runtime-config-schema 未作为兼容门面导出");
        process.exit(1);
    }

    console.log("[check-runtime-config-structure] 通过");
}

run();
