const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
function parseArgs() {
    const args = process.argv.slice(2);
    const rootFlagIndex = args.indexOf("--root");
    if (rootFlagIndex >= 0 && args[rootFlagIndex + 1]) {
        return path.resolve(ROOT, args[rootFlagIndex + 1]);
    }

    return ROOT;
}

const baseRoot = parseArgs();
const BUILDER_FILE = path.join(baseRoot, "settings", "v2", "packages", "builder.json");

if (!fs.existsSync(BUILDER_FILE)) {
    console.error("[check-builder-variants] 缺少 settings/v2/packages/builder.json");
    process.exit(1);
}

const data = JSON.parse(fs.readFileSync(BUILDER_FILE, "utf-8"));
const custom = data?.bundleConfig?.custom;

if (!custom || typeof custom !== "object") {
    console.error("[check-builder-variants] bundleConfig.custom 缺失");
    process.exit(1);
}

const requiredVariants = ["native", "miniGame", "web"];
for (const [key, item] of Object.entries(custom)) {
    const configs = item?.configs || {};
    for (const variant of requiredVariants) {
        if (configs[variant] == null) {
            console.error(`[check-builder-variants] ${key} 缺少构建变体: ${variant}`);
            process.exit(1);
        }
    }
}

console.log("[check-builder-variants] 通过");
