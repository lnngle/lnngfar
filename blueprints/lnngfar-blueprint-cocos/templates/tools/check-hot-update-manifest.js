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
const MANIFEST_FILE = path.join(baseRoot, "assets", "resources", "hot-update-manifest.json");

if (!fs.existsSync(MANIFEST_FILE)) {
    console.warn("[check-hot-update-manifest] 未找到 hot-update-manifest.json，当前仅为预留接入点");
    process.exit(0);
}

const data = JSON.parse(fs.readFileSync(MANIFEST_FILE, "utf-8"));
const required = ["version", "remoteManifestUrl", "remoteVersionUrl", "assets"];

const missing = required.filter((key) => data[key] == null);
if (missing.length > 0) {
    console.error(`[check-hot-update-manifest] 缺少字段: ${missing.join(", ")}`);
    process.exit(1);
}

console.log("[check-hot-update-manifest] 通过");
