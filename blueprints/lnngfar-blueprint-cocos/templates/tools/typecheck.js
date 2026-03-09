const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const COCOS_TSCONFIG = path.join(ROOT, "temp", "tsconfig.cocos.json");

if (!fs.existsSync(COCOS_TSCONFIG)) {
    console.warn("[typecheck] 未找到 temp/tsconfig.cocos.json，跳过类型检查（请先在 Cocos Creator 打开项目后再执行）");
    process.exit(0);
}

const result = spawnSync(process.platform === "win32" ? "npx.cmd" : "npx", ["tsc", "-p", "tsconfig.json", "--noEmit"], {
    cwd: ROOT,
    stdio: "inherit",
});

if (result.status !== 0) {
    process.exit(result.status || 1);
}

console.log("[typecheck] 通过");
