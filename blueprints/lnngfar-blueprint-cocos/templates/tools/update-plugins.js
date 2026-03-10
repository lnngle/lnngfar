const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const EXTENSIONS_DIR = path.join(ROOT, "extensions");
const LOCK_FILE = path.join(ROOT, "extensions.lock.json");

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
    const lockFile = path.join(cwd, "package-lock.json");
    const npmArgs = fs.existsSync(lockFile) ? ["ci"] : ["install"];

    if (process.platform === "win32") {
        run("npm", npmArgs, cwd, true);
        return;
    }

    run("npm", npmArgs, cwd);
}

function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function readLock() {
    if (!fs.existsSync(LOCK_FILE)) {
        const seed = {};
        for (const key of Object.keys(PLUGINS)) {
            seed[key] = {
                repo: PLUGINS[key].repo,
                url: PLUGINS[key].url,
                branch: PLUGINS[key].branch,
                commit: "",
            };
        }

        return seed;
    }

    return JSON.parse(fs.readFileSync(LOCK_FILE, "utf8"));
}

function writeLock(lock) {
    const serialized = `${JSON.stringify(lock, null, 2)}\n`;
    fs.writeFileSync(LOCK_FILE, serialized, "utf8");
}

function getPluginConfig(lock, key) {
    const lockPlugin = lock[key];
    const basePlugin = PLUGINS[key];

    if (!basePlugin && !lockPlugin) {
        throw new Error(`未知插件: ${key}`);
    }

    return {
        repo: (lockPlugin && lockPlugin.repo) || (basePlugin && basePlugin.repo),
        url: (lockPlugin && lockPlugin.url) || (basePlugin && basePlugin.url),
        branch: (lockPlugin && lockPlugin.branch) || (basePlugin && basePlugin.branch) || "master",
        commit: (lockPlugin && lockPlugin.commit) || "",
    };
}

function ensureRepo(plugin) {
    ensureDir(EXTENSIONS_DIR);
    const repoDir = path.join(EXTENSIONS_DIR, plugin.repo);
    const gitDir = path.join(repoDir, ".git");

    if (!fs.existsSync(repoDir)) {
        console.log(`[sync] cloning ${plugin.repo}`);
        runGit(["clone", "-b", plugin.branch, plugin.url, plugin.repo], EXTENSIONS_DIR);
    }

    if (!fs.existsSync(gitDir)) {
        console.log(`[sync] skip git actions for ${plugin.repo}: 目录已存在但无 .git，保留模板内置快照`);
        return { repoDir, hasGit: false };
    }

    return { repoDir, hasGit: true };
}

function syncPlugin(lock, key) {
    const plugin = getPluginConfig(lock, key);
    const { repoDir, hasGit } = ensureRepo(plugin);

    if (hasGit) {
        console.log(`[sync] fetching ${plugin.repo}`);
        runGit(["fetch", "origin", plugin.branch, "--tags"], repoDir);

        if (plugin.commit) {
            console.log(`[sync] checkout ${plugin.repo} -> ${plugin.commit}`);
            runGit(["checkout", plugin.commit], repoDir);
        } else {
            console.log(`[sync] no commit in lock, fallback to origin/${plugin.branch}`);
            runGit(["checkout", plugin.branch], repoDir);
            runGit(["pull", "--ff-only", "origin", plugin.branch], repoDir);
        }
    }

    const packageJson = path.join(repoDir, "package.json");
    if (fs.existsSync(packageJson)) {
        console.log(`[sync] npm install ${plugin.repo}`);
        runNpmInstall(repoDir);
    }

    console.log(`[sync] done ${plugin.repo}`);
}

function bumpPlugin(lock, key) {
    const plugin = getPluginConfig(lock, key);
    const { repoDir, hasGit } = ensureRepo(plugin);

    if (!hasGit) {
        throw new Error(`无法 bump ${plugin.repo}: 目录存在但无 .git，请先重建为 git 仓库`);
    }

    console.log(`[bump] updating ${plugin.repo} from origin/${plugin.branch}`);
    runGit(["fetch", "origin", plugin.branch, "--tags"], repoDir);
    runGit(["checkout", plugin.branch], repoDir);
    runGit(["pull", "--ff-only", "origin", plugin.branch], repoDir);

    const commit = spawnSync("git", ["-c", "http.proxy=", "-c", "https.proxy=", "rev-parse", "HEAD"], {
        cwd: repoDir,
        encoding: "utf8",
    });

    if (commit.status !== 0 || !commit.stdout) {
        throw new Error(`读取提交失败: ${plugin.repo}`);
    }

    lock[key] = {
        repo: plugin.repo,
        url: plugin.url,
        branch: plugin.branch,
        commit: commit.stdout.trim(),
    };

    const packageJson = path.join(repoDir, "package.json");
    if (fs.existsSync(packageJson)) {
        console.log(`[bump] npm install ${plugin.repo}`);
        runNpmInstall(repoDir);
    }

    console.log(`[bump] done ${plugin.repo} -> ${lock[key].commit}`);
}

function parseCli(argv) {
    const arg1 = argv[2] || "sync";
    const arg2 = argv[3];

    if (arg1 === "sync" || arg1 === "bump") {
        return {
            action: arg1,
            target: arg2 || "all",
        };
    }

    return {
        action: "sync",
        target: arg1 || "all",
    };
}

function parseTargets(target, lock) {
    if (target === "all") {
        return Object.keys(PLUGINS);
    }

    const hasBase = Boolean(PLUGINS[target]);
    const hasLock = Boolean(lock[target]);
    if (!hasBase && !hasLock) {
        throw new Error(`不支持的目标: ${target}`);
    }

    return [target];
}

function main() {
    try {
        const lock = readLock();
        const { action, target } = parseCli(process.argv);
        const targets = parseTargets(target, lock);

        for (const target of targets) {
            if (action === "bump") {
                bumpPlugin(lock, target);
            } else {
                syncPlugin(lock, target);
            }
        }

        if (action === "bump") {
            writeLock(lock);
            console.log("[bump] extensions.lock.json 已更新");
        }
    } catch (error) {
        console.error(`[update] failed: ${error.message}`);
        process.exit(1);
    }
}

main();
