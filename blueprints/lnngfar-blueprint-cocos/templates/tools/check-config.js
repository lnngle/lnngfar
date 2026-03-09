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

function fail(message) {
    console.error(`[check-config] ${message}`);
}

function ok(message) {
    console.log(`[check-config] ${message}`);
}

function readJson(filePath) {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
}

function ensure(condition, message, errors) {
    if (!condition) {
        errors.push(message);
    }
}

function run() {
    const baseRoot = parseArgs();
    const configFile = path.join(baseRoot, "assets", "resources", "config.json");

    const errors = [];

    ensure(fs.existsSync(configFile), "缺少 assets/resources/config.json", errors);
    if (errors.length > 0) {
        errors.forEach(fail);
        process.exit(1);
    }

    const data = readJson(configFile);
    const envs = ["dev", "test", "prod"];

    ensure(typeof data.type === "string", "config.type 必须是字符串", errors);
    ensure(data.config && typeof data.config === "object", "config 节点缺失", errors);

    envs.forEach((env) => {
        ensure(data.config && data.config[env], `config.${env} 缺失`, errors);
    });

    const activeEnv = process.env.ENV || data.type;
    ensure(envs.includes(activeEnv), `当前环境无效: ${activeEnv}`, errors);

    ensure(Array.isArray(data.language?.type), "language.type 必须是数组", errors);
    ensure(typeof data.language?.default === "string", "language.default 必须是字符串", errors);
    if (Array.isArray(data.language?.type) && typeof data.language?.default === "string") {
        ensure(data.language.type.includes(data.language.default), "language.default 不在 language.type 中", errors);
    }

    const bundleName = data.bundle?.default;
    ensure(typeof bundleName === "string" && bundleName.length > 0, "bundle.default 缺失", errors);

    if (typeof bundleName === "string" && data.language?.path?.json) {
        const languagePath = path.join(
            baseRoot,
            "assets",
            bundleName,
            data.language.path.json,
            `${data.language.default}.json`,
        );
        ensure(fs.existsSync(languagePath), `默认语言资源不存在: ${path.relative(baseRoot, languagePath)}`, errors);
    }

    if (errors.length > 0) {
        errors.forEach(fail);
        process.exit(1);
    }

    ok(`通过，当前环境=${activeEnv}`);
}

run();
