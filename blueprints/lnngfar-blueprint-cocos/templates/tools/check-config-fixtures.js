const { spawnSync } = require("child_process");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

const cases = [
    {
        name: "合法配置用例",
        root: "tools/fixtures/config/case-valid",
        expectPass: true,
    },
    {
        name: "环境值非法用例",
        root: "tools/fixtures/config/case-invalid-env",
        expectPass: false,
        expectedText: "当前环境无效",
    },
    {
        name: "默认语言不在集合用例",
        root: "tools/fixtures/config/case-invalid-language-default",
        expectPass: false,
        expectedText: "language.default 不在 language.type 中",
    },
    {
        name: "缺失bundle.default用例",
        root: "tools/fixtures/config/case-invalid-missing-bundle",
        expectPass: false,
        expectedText: "bundle.default 缺失",
    },
];

function runCase(testCase) {
    const result = spawnSync(
        process.execPath,
        ["tools/check-config.js", "--root", testCase.root],
        {
            cwd: ROOT,
            encoding: "utf-8",
            env: { ...process.env, ENV: "" },
        },
    );

    const output = `${result.stdout || ""}${result.stderr || ""}`;
    const passed = result.status === 0;

    if (testCase.expectPass && !passed) {
        console.error(`[check-config-fixtures] ${testCase.name} 期望通过但失败`);
        console.error(output);
        return false;
    }

    if (!testCase.expectPass && passed) {
        console.error(`[check-config-fixtures] ${testCase.name} 期望失败但通过`);
        console.error(output);
        return false;
    }

    if (!testCase.expectPass && testCase.expectedText && !output.includes(testCase.expectedText)) {
        console.error(`[check-config-fixtures] ${testCase.name} 未命中预期错误文本`);
        console.error(output);
        return false;
    }

    console.log(`[check-config-fixtures] 通过: ${testCase.name}`);
    return true;
}

function run() {
    for (const testCase of cases) {
        if (!runCase(testCase)) {
            process.exit(1);
        }
    }

    console.log("[check-config-fixtures] 全部通过");
}

run();
