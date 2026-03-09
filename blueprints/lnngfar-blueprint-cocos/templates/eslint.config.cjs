const tsParser = require("@typescript-eslint/parser");
const tsPlugin = require("@typescript-eslint/eslint-plugin");

module.exports = [
    {
        ignores: [
            "library/**",
            "temp/**",
            "local/**",
            "build/**",
            "profiles/**",
            "native/**",
            "assets/**/*.meta",
        ],
    },
    {
        files: ["assets/script/**/*.ts"],
        languageOptions: {
            parser: tsParser,
            ecmaVersion: "latest",
            sourceType: "module",
        },
        plugins: {
            "@typescript-eslint": tsPlugin,
        },
        rules: {
            "no-var": "error",
            "prefer-const": "error",
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/consistent-type-imports": "warn",
        },
    },
];
