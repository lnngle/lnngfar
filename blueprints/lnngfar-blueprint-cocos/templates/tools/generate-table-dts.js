const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const TABLE_DIR = path.join(ROOT, "assets", "bundle", "config", "game");
const OUTPUT_FILE = path.join(
    ROOT,
    "assets",
    "script",
    "game",
    "common",
    "types",
    "generated-tables.d.ts",
);

function toType(value) {
    if (value === null) return "null";
    if (Array.isArray(value)) {
        if (value.length === 0) return "unknown[]";
        return `${toType(value[0])}[]`;
    }
    switch (typeof value) {
        case "string":
            return "string";
        case "number":
            return "number";
        case "boolean":
            return "boolean";
        case "object": {
            const entries = Object.entries(value);
            if (entries.length === 0) return "Record<string, unknown>";
            const props = entries.map(([k, v]) => `    ${k}: ${toType(v)};`).join("\n");
            return `\n{\n${props}\n}`;
        }
        default:
            return "unknown";
    }
}

function pascalCase(name) {
    return name
        .replace(/\.json$/i, "")
        .split(/[-_]/g)
        .map((x) => x.charAt(0).toUpperCase() + x.slice(1))
        .join("");
}

function run() {
    if (!fs.existsSync(TABLE_DIR)) {
        console.warn("[generate-table-dts] 未找到表目录，跳过生成");
        return;
    }

    const files = fs.readdirSync(TABLE_DIR).filter((file) => file.endsWith(".json"));
    const lines = [
        "// 自动生成文件，请勿手动修改",
        "",
    ];

    for (const file of files) {
        const abs = path.join(TABLE_DIR, file);
        const json = JSON.parse(fs.readFileSync(abs, "utf-8"));
        const typeName = `${pascalCase(file)}Row`;
        lines.push(`export type ${typeName} = ${toType(json)};`);
        lines.push("");
    }

    fs.writeFileSync(OUTPUT_FILE, lines.join("\n"), "utf-8");
    console.log(`[generate-table-dts] 已生成: ${path.relative(ROOT, OUTPUT_FILE)}`);
}

run();
