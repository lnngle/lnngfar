const test = require("node:test");
const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..", "..");

function runNode(script, args = []) {
    const result = spawnSync(process.execPath, [script, ...args], {
        cwd: ROOT,
        encoding: "utf-8",
    });

    return {
        code: result.status,
        output: `${result.stdout || ""}${result.stderr || ""}`,
    };
}

test("关键检查脚本应通过", () => {
    const scripts = [
        "tools/check-config.js",
        "tools/check-assets.js",
        "tools/check-architecture.js",
        "tools/check-builder-variants.js",
        "tools/check-hot-update-manifest.js",
    ];

    for (const script of scripts) {
        const { code, output } = runNode(script);
        assert.equal(code, 0, `${script} 执行失败\n${output}`);
    }
});

test("fixtures自测脚本应通过", () => {
    const scripts = [
        "tools/check-config-fixtures.js",
        "tools/check-assets-fixtures.js",
        "tools/check-architecture-fixtures.js",
        "tools/check-builder-fixtures.js",
        "tools/check-hot-update-fixtures.js",
    ];

    for (const script of scripts) {
        const { code, output } = runNode(script);
        assert.equal(code, 0, `${script} 执行失败\n${output}`);
    }
});

test("全链路门禁脚本应通过", () => {
    const { code, output } = runNode("tools/run-tests.js");
    assert.equal(code, 0, `run-tests 执行失败\n${output}`);
    assert.match(output, /全部通过/);
});
