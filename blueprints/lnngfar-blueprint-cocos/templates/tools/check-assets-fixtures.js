const { spawnSync } = require("child_process");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

const cases = [
    {
        name: "合法资源用例",
        root: "tools/fixtures/assets/case-valid",
        expectPass: true,
    },
    {
        name: "孤立meta违规用例",
        root: "tools/fixtures/assets/case-invalid-orphan-meta",
        expectPass: false,
        expectedText: "发现孤立 meta",
    },
    {
        name: "关键资源缺失用例",
        root: "tools/fixtures/assets/case-invalid-missing-required",
        expectPass: false,
        expectedText: "缺少关键资源",
    },
];

function runCase(testCase) {
    const result = spawnSync(
        process.execPath,
        ["tools/check-assets.js", "--root", testCase.root],
        {
            cwd: ROOT,
            encoding: "utf-8",
        },
    );

    const output = `${result.stdout || ""}${result.stderr || ""}`;
    const passed = result.status === 0;

    if (testCase.expectPass && !passed) {
        console.error(`[check-assets-fixtures] ${testCase.name} 期望通过但失败`);
        console.error(output);
        return false;
    }

    if (!testCase.expectPass && passed) {
        console.error(`[check-assets-fixtures] ${testCase.name} 期望失败但通过`);
        console.error(output);
        return false;
    }

    if (!testCase.expectPass && testCase.expectedText && !output.includes(testCase.expectedText)) {
        console.error(`[check-assets-fixtures] ${testCase.name} 未命中预期错误文本`);
        console.error(output);
        return false;
    }

    console.log(`[check-assets-fixtures] 通过: ${testCase.name}`);
    return true;
}

function run() {
    for (const testCase of cases) {
        if (!runCase(testCase)) {
            process.exit(1);
        }
    }

    console.log("[check-assets-fixtures] 全部通过");
}

run();
