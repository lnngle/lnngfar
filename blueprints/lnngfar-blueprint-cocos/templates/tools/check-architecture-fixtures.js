const { spawnSync } = require("child_process");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

const cases = [
    {
        name: "合法依赖用例",
        root: "tools/fixtures/architecture/case-valid/assets/script/game",
        expectPass: true,
    },
    {
        name: "层级依赖违规用例",
        root: "tools/fixtures/architecture/case-invalid-layer/assets/script/game",
        expectPass: false,
        expectedText: "不允许在 components 中依赖 view",
    },
    {
        name: "跨域依赖违规用例",
        root: "tools/fixtures/architecture/case-invalid-domain/assets/script/game",
        expectPass: false,
        expectedText: "不允许依赖 initialize 域",
    },
    {
        name: "initialize依赖account实现层违规用例",
        root: "tools/fixtures/architecture/case-invalid-initialize-account-impl/assets/script/game",
        expectPass: false,
        expectedText: "不允许依赖 account 实现层",
    },
    {
        name: "layouts依赖view违规用例",
        root: "tools/fixtures/architecture/case-invalid-layout/assets/script/game",
        expectPass: false,
        expectedText: "不允许在 layouts 中依赖 view",
    },
];

function runCase(testCase) {
    const result = spawnSync(
        process.execPath,
        ["tools/check-architecture.js", "--root", testCase.root],
        {
            cwd: ROOT,
            encoding: "utf-8",
        },
    );

    const output = `${result.stdout || ""}${result.stderr || ""}`;
    const passed = result.status === 0;

    if (testCase.expectPass && !passed) {
        console.error(`[check-architecture-fixtures] ${testCase.name} 期望通过但失败`);
        console.error(output);
        return false;
    }

    if (!testCase.expectPass && passed) {
        console.error(`[check-architecture-fixtures] ${testCase.name} 期望失败但通过`);
        console.error(output);
        return false;
    }

    if (!testCase.expectPass && testCase.expectedText && !output.includes(testCase.expectedText)) {
        console.error(`[check-architecture-fixtures] ${testCase.name} 未命中预期错误文本`);
        console.error(output);
        return false;
    }

    console.log(`[check-architecture-fixtures] 通过: ${testCase.name}`);
    return true;
}

function run() {
    for (const testCase of cases) {
        if (!runCase(testCase)) {
            process.exit(1);
        }
    }

    console.log("[check-architecture-fixtures] 全部通过");
}

run();
