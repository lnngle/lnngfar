#!/usr/bin/env node
const { spawnSync } = require('node:child_process');
const { existsSync } = require('node:fs');
const { resolve } = require('node:path');

const entry = resolve(__dirname, '../dist/src/cli/index.js');
const projectRoot = resolve(__dirname, '..');

if (!existsSync(entry)) {
	const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
	const buildResult = spawnSync(npmCmd, ['run', 'build'], {
		cwd: projectRoot,
		stdio: 'inherit'
	});

	if (buildResult.status !== 0 || !existsSync(entry)) {
		process.stderr.write('lnngfar 启动失败：未找到 CLI 构建产物，请执行 npm run build 后重试。\n');
		process.exit(buildResult.status ?? 1);
	}
}

const args = [entry, ...process.argv.slice(2)];
const result = spawnSync(process.execPath, args, { stdio: 'inherit' });
process.exit(result.status ?? 1);
