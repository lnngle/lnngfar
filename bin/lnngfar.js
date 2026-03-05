#!/usr/bin/env node
const { spawnSync } = require('node:child_process');
const { resolve } = require('node:path');

const entry = resolve(__dirname, '../dist/src/cli/index.js');
const args = [entry, ...process.argv.slice(2)];
const result = spawnSync(process.execPath, args, { stdio: 'inherit' });
process.exit(result.status ?? 1);
