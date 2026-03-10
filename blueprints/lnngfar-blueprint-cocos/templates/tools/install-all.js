const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const EXTENSIONS_DIR = path.join(ROOT, "extensions");

function run(cmd, args, cwd, useShell = false) {
    const result = spawnSync(cmd, args, {
        cwd,
        stdio: "inherit",
        shell: useShell,
    });

    if (result.error) {
        throw result.error;
    }

    if (result.status !== 0) {
        throw new Error(`命令执行失败: ${cmd} ${args.join(" ")}`);
    }
}

function runNpmInstall(cwd, name) {
    const packageJson = path.join(cwd, "package.json");
    if (!fs.existsSync(packageJson)) {
        console.log(`[install] skip ${name}: 未找到 package.json`);
        return;
    }

    const lockFile = path.join(cwd, "package-lock.json");
    const npmArgs = fs.existsSync(lockFile) ? ["ci"] : ["install"];

    console.log(`[install] ${name}: npm ${npmArgs.join(" ")}`);
    if (process.platform === "win32") {
        run("npm", npmArgs, cwd, true);
        return;
    }

    run("npm", npmArgs, cwd);
}

function installExtensions() {
    if (!fs.existsSync(EXTENSIONS_DIR)) {
        console.log("[install] skip extensions: 目录不存在");
        return;
    }

    const dirs = fs
        .readdirSync(EXTENSIONS_DIR, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
        .sort();

    for (const dirName of dirs) {
        const dirPath = path.join(EXTENSIONS_DIR, dirName);
        runNpmInstall(dirPath, `extensions/${dirName}`);
    }
}

function main() {
    try {
        runNpmInstall(ROOT, "root");
        installExtensions();
        console.log("[install] done");
    } catch (error) {
        console.error(`[install] failed: ${error.message}`);
        process.exit(1);
    }
}

main();
