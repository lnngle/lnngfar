const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DEFAULT_ASSETS_ROOT = path.join(ROOT, "assets");

const REQUIRED_FILES = [
    "assets/script/Main.ts",
    "assets/resources/config.json",
    "assets/bundle/gui/layouts/loading/loading.prefab",
    "assets/bundle/gui/screens/demo/demo.prefab",
    "assets/bundle/gui/components/loading/texture/icon_loading_bar.png",
    "assets/bundle/common/prefab/alert.prefab",
    "assets/bundle/common/prefab/confirm.prefab",
];

function parseArgs() {
    const args = process.argv.slice(2);
    const rootFlagIndex = args.indexOf("--root");
    if (rootFlagIndex >= 0 && args[rootFlagIndex + 1]) {
        return path.resolve(ROOT, args[rootFlagIndex + 1]);
    }

    return ROOT;
}

function walkFiles(dir, output) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            walkFiles(fullPath, output);
        } else {
            output.push(fullPath);
        }
    }
}

function toRel(filePath) {
    return path.relative(ROOT, filePath).replace(/\\/g, "/");
}

function run() {
    const baseRoot = parseArgs();
    const assetsRoot = path.join(baseRoot, "assets");

    const errors = [];
    const warnings = [];

    const files = [];
    if (!fs.existsSync(assetsRoot)) {
        errors.push(`缺少 assets 目录: ${path.relative(ROOT, assetsRoot).replace(/\\/g, "/")}`);
    } else {
        walkFiles(assetsRoot, files);
    }

    for (const meta of files.filter((file) => file.endsWith(".meta"))) {
        const raw = meta.slice(0, -5);
        if (!fs.existsSync(raw)) {
            errors.push(`发现孤立 meta: ${toRel(meta)}`);
        }
    }

    for (const required of REQUIRED_FILES) {
        if (!fs.existsSync(path.join(baseRoot, required))) {
            errors.push(`缺少关键资源: ${required}`);
        }
    }

    for (const prefab of files.filter((file) => file.endsWith(".prefab"))) {
        const name = path.basename(prefab);
        if (/[A-Z]/.test(name)) {
            warnings.push(`建议使用小写命名: ${toRel(prefab)}`);
        }
    }

    warnings.forEach((message) => console.warn(`[check-assets] ${message}`));

    if (errors.length > 0) {
        errors.forEach((message) => console.error(`[check-assets] ${message}`));
        process.exit(1);
    }

    console.log("[check-assets] 通过");
}

run();
