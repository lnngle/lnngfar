const { spawnSync } = require("child_process");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

const cases = [
    {
        name: "合法构建变体用例",
        root: "tools/fixtures/builder/case-valid",
        expectPass: true,
    },
    {
        name: "缺失miniGame变体用例",
        root: "tools/fixtures/builder/case-invalid-missing-variant",
        expectPass: false,
        expectedText: "缺少构建变体: miniGame",
    },
    {
        name: "缺失custom配置用例",
        root: "tools/fixtures/builder/case-invalid-missing-custom",
        expectPass: false,
        expectedText: "bundleConfig.custom 缺失",
    },
];

function runCase(testCase) {
    const result = spawnSync(
        process.execPath,
        ["tools/check-builder-variants.js", "--root", testCase.root],
        {
            cwd: ROOT,
            encoding: "utf-8",
        },
    );

    const output = `${result.stdout || ""}${result.stderr || ""}`;
    const passed = result.status === 0;

    if (testCase.expectPass && !passed) {
        console.error(`[check-builder-fixtures] ${testCase.name} 期望通过但失败`);
        console.error(output);
        return false;
    }

    if (!testCase.expectPass && passed) {
        console.error(`[check-builder-fixtures] ${testCase.name} 期望失败但通过`);
        console.error(output);
        return false;
    }

    if (!testCase.expectPass && testCase.expectedText && !output.includes(testCase.expectedText)) {
        console.error(`[check-builder-fixtures] ${testCase.name} 未命中预期错误文本`);
        console.error(output);
        return false;
    }

    console.log(`[check-builder-fixtures] 通过: ${testCase.name}`);
    return true;
}

function run() {
    for (const testCase of cases) {
        if (!runCase(testCase)) {
            process.exit(1);
        }
    }

    console.log("[check-builder-fixtures] 全部通过");
}

run();
