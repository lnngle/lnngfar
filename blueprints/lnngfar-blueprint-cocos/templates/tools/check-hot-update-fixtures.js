const { spawnSync } = require("child_process");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

const cases = [
    {
        name: "合法热更新清单用例",
        root: "tools/fixtures/hot-update/case-valid",
        expectPass: true,
    },
    {
        name: "缺失字段用例",
        root: "tools/fixtures/hot-update/case-invalid-missing-field",
        expectPass: false,
        expectedText: "缺少字段",
    },
    {
        name: "缺失清单文件用例",
        root: "tools/fixtures/hot-update/case-missing-manifest",
        expectPass: true,
        expectedText: "未找到 hot-update-manifest.json",
    },
];

function runCase(testCase) {
    const result = spawnSync(
        process.execPath,
        ["tools/check-hot-update-manifest.js", "--root", testCase.root],
        {
            cwd: ROOT,
            encoding: "utf-8",
        },
    );

    const output = `${result.stdout || ""}${result.stderr || ""}`;
    const passed = result.status === 0;

    if (testCase.expectPass && !passed) {
        console.error(`[check-hot-update-fixtures] ${testCase.name} 期望通过但失败`);
        console.error(output);
        return false;
    }

    if (!testCase.expectPass && passed) {
        console.error(`[check-hot-update-fixtures] ${testCase.name} 期望失败但通过`);
        console.error(output);
        return false;
    }

    if (testCase.expectedText && !output.includes(testCase.expectedText)) {
        console.error(`[check-hot-update-fixtures] ${testCase.name} 未命中预期文本`);
        console.error(output);
        return false;
    }

    console.log(`[check-hot-update-fixtures] 通过: ${testCase.name}`);
    return true;
}

function run() {
    for (const testCase of cases) {
        if (!runCase(testCase)) {
            process.exit(1);
        }
    }

    console.log("[check-hot-update-fixtures] 全部通过");
}

run();
