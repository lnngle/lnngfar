const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DEFAULT_GAME_ROOT = path.join(ROOT, "assets", "script", "game");
const DOMAIN_SET = new Set(["account", "initialize", "common"]);

function parseArgs() {
    const args = process.argv.slice(2);
    const rootFlagIndex = args.indexOf("--root");
    if (rootFlagIndex >= 0 && args[rootFlagIndex + 1]) {
        return path.resolve(ROOT, args[rootFlagIndex + 1]);
    }

    return DEFAULT_GAME_ROOT;
}

function walkTsFiles(dir, output) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            walkTsFiles(fullPath, output);
        } else if (entry.isFile() && fullPath.endsWith(".ts")) {
            output.push(fullPath);
        }
    }
}

function normalizeSep(value) {
    return value.replace(/\\/g, "/");
}

function isLayerFile(filePath, layer) {
    const marker = `${path.sep}${layer}${path.sep}`;
    return filePath.includes(marker);
}

function getDomainFromFile(filePath) {
    const normalized = normalizeSep(filePath);
    const marker = "/assets/script/game/";
    const index = normalized.indexOf(marker);
    if (index < 0) {
        return null;
    }

    const rest = normalized.slice(index + marker.length);
    const domain = rest.split("/")[0];
    return DOMAIN_SET.has(domain) ? domain : null;
}

function getImportDomain(filePath, importPath) {
    if (importPath.startsWith("@game/")) {
        const domain = importPath.slice("@game/".length).split("/")[0];
        return DOMAIN_SET.has(domain) ? domain : null;
    }

    if (importPath.startsWith(".")) {
        const resolved = path.resolve(path.dirname(filePath), importPath);
        return getDomainFromFile(resolved);
    }

    return null;
}

function checkLayerDependency(filePath, importPath, layerName) {
    if (!isLayerFile(filePath, layerName)) {
        return null;
    }

    if (
        importPath.includes("/view/") ||
        importPath.includes("\\view\\") ||
        importPath.endsWith("/view") ||
        importPath.endsWith("\\view")
    ) {
        return `${path.relative(ROOT, filePath).replace(/\\/g, "/")} 不允许在 ${layerName} 中依赖 view: ${importPath}`;
    }

    return null;
}

function checkDomainDependency(filePath, importPath) {
    const sourceDomain = getDomainFromFile(filePath);
    const targetDomain = getImportDomain(filePath, importPath);

    if (sourceDomain == null || targetDomain == null || sourceDomain === targetDomain) {
        return null;
    }

    // 规则1: account 不允许依赖 initialize
    if (sourceDomain === "account" && targetDomain === "initialize") {
        return `${normalizeSep(path.relative(ROOT, filePath))} 不允许依赖 initialize 域: ${importPath}`;
    }

    // 规则2: initialize 不允许依赖 account 的 components/layouts/model 实现层
    if (sourceDomain === "initialize" && targetDomain === "account") {
        const normalizedImport = normalizeSep(importPath);
        if (
            normalizedImport.includes("/account/components/") ||
            normalizedImport.includes("/account/layouts/") ||
            normalizedImport.includes("/account/model/")
        ) {
            return `${normalizeSep(path.relative(ROOT, filePath))} 不允许依赖 account 实现层: ${importPath}`;
        }
    }

    return null;
}

function run() {
    const gameRoot = parseArgs();
    const files = [];
    walkTsFiles(gameRoot, files);

    const issues = [];
    const importRegex = /from\s+["']([^"']+)["']/g;

    for (const file of files) {
        const content = fs.readFileSync(file, "utf-8");
        let match;
        while ((match = importRegex.exec(content)) !== null) {
            const importPath = match[1];
            const componentIssue = checkLayerDependency(file, importPath, "components");
            if (componentIssue) {
                issues.push(componentIssue);
            }

            const layoutIssue = checkLayerDependency(file, importPath, "layouts");
            if (layoutIssue) {
                issues.push(layoutIssue);
            }

            const domainIssue = checkDomainDependency(file, importPath);
            if (domainIssue) {
                issues.push(domainIssue);
            }
        }
    }

    if (issues.length > 0) {
        issues.forEach((issue) => console.error(`[check-architecture] ${issue}`));
        process.exit(1);
    }

    console.log("[check-architecture] 通过");
}

run();
