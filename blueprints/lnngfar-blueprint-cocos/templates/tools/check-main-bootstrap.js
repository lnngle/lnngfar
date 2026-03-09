const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const MAIN_FILE = path.join(ROOT, "assets", "script", "Main.ts");

const content = fs.readFileSync(MAIN_FILE, "utf-8");

const requiredTokens = [
    "BootstrapPipeline",
    "配置预热",
    "模块绑定",
    "GUI 初始化",
    "smc.bindModules",
    "guiAdapter.init",
];

const missing = requiredTokens.filter((token) => !content.includes(token));
if (missing.length > 0) {
    console.error(`[check-main-bootstrap] 缺少关键启动逻辑: ${missing.join(", ")}`);
    process.exit(1);
}

console.log("[check-main-bootstrap] 通过");
