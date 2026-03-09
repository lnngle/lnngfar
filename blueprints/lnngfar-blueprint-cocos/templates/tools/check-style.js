const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SCRIPT_DIR = path.join(ROOT, "assets", "script");

const RULES = [
    { name: "禁止使用 var", pattern: /\bvar\s+/g },
    { name: "避免 any 类型", pattern: /:\s*any\b/g },
    { name: "避免 null! 非空断言", pattern: /null!/g },
];

function walk(dir, files) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            walk(full, files);
        } else if (entry.isFile() && full.endsWith(".ts")) {
            files.push(full);
        }
    }
}

function run() {
    const tsFiles = [];
    walk(SCRIPT_DIR, tsFiles);

    const issues = [];

    for (const file of tsFiles) {
        const content = fs.readFileSync(file, "utf-8");
        const rel = path.relative(ROOT, file).replace(/\\/g, "/");

        for (const rule of RULES) {
            if (rule.pattern.test(content)) {
                issues.push(`${rel}: ${rule.name}`);
            }
        }
    }

    if (issues.length > 0) {
        issues.forEach((issue) => console.error(`[check-style] ${issue}`));
        process.exit(1);
    }

    console.log("[check-style] 通过");
}

run();
