const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const EXTENSIONS_DIR = path.join(ROOT, "extensions");

const PLUGINS = {
    framework: {
        repo: "oops-plugin-framework",
        url: "https://gitee.com/dgflash/oops-plugin-framework.git",
        branch: "master",
    },
    "hot-update": {
        repo: "oops-plugin-hot-update",
        url: "https://gitee.com/dgflash/oops-plugin-hot-update.git",
        branch: "master",
    },
    "excel-to-json": {
        repo: "oops-plugin-excel-to-json",
        url: "https://gitee.com/dgflash/oops-plugin-excel-to-json.git",
        branch: "master",
    },
};

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

function runGit(args, cwd) {
    run("git", ["-c", "http.proxy=", "-c", "https.proxy=", ...args], cwd);
}

function runNpmInstall(cwd) {
    if (process.platform === "win32") {
        run("npm", ["install"], cwd, true);
        return;
    }

    run("npm", ["install"], cwd);
}

function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function updatePlugin(key) {
    const plugin = PLUGINS[key];
    if (!plugin) {
        throw new Error(`未知插件: ${key}`);
    }

    ensureDir(EXTENSIONS_DIR);

    const repoDir = path.join(EXTENSIONS_DIR, plugin.repo);
    const gitDir = path.join(repoDir, ".git");

    if (!fs.existsSync(gitDir)) {
        console.log(`[update] cloning ${plugin.repo}`);
        runGit(["clone", "-b", plugin.branch, plugin.url, plugin.repo], EXTENSIONS_DIR);
    }

    console.log(`[update] pulling ${plugin.repo}`);
    runGit(["pull"], repoDir);

    const packageJson = path.join(repoDir, "package.json");
    if (fs.existsSync(packageJson)) {
        console.log(`[update] npm install ${plugin.repo}`);
        runNpmInstall(repoDir);
    }

    console.log(`[update] done ${plugin.repo}`);
}

function parseTargets(argv) {
    const target = argv[2] || "all";
    if (target === "all") {
        return Object.keys(PLUGINS);
    }

    if (!PLUGINS[target]) {
        throw new Error(`不支持的目标: ${target}`);
    }

    return [target];
}

function main() {
    try {
        const targets = parseTargets(process.argv);
        for (const target of targets) {
            updatePlugin(target);
        }
    } catch (error) {
        console.error(`[update] failed: ${error.message}`);
        process.exit(1);
    }
}

main();
