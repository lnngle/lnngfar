import fs from 'fs-extra';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

export interface BlueprintTestResult {
  ok: boolean;
  exitCode: number;
  output: string;
}

function collectBlueprintTestFiles(testRoot: string): string[] {
  const testFiles: string[] = [];
  const stack = [testRoot];

  while (stack.length > 0) {
    const current = stack.pop() as string;
    const entries = fs.readdirSync(current, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
        continue;
      }

      if (/\.(test|spec)\.(ts|tsx|js|jsx)$/.test(entry.name)) {
        testFiles.push(fullPath);
      }
    }
  }

  return testFiles.sort();
}

export function runBlueprintTests(blueprintTestsPath: string, repoRoot: string): BlueprintTestResult {
  if (process.env.LNNGFAR_SKIP_BLUEPRINT_TESTS === '1') {
    return {
      ok: true,
      exitCode: 0,
      output: '跳过 Blueprint 测试'
    };
  }

  if (!fs.existsSync(blueprintTestsPath)) {
    return {
      ok: false,
      exitCode: 1,
      output: `未找到 Blueprint 测试目录: ${blueprintTestsPath}`
    };
  }

  const testFiles = collectBlueprintTestFiles(blueprintTestsPath);
  if (testFiles.length === 0) {
    return {
      ok: false,
      exitCode: 1,
      output: `Blueprint 测试目录中未找到测试文件: ${blueprintTestsPath}`
    };
  }

  const jestBin = path.join(repoRoot, 'node_modules', 'jest', 'bin', 'jest.js');
  const commandArgs = fs.existsSync(jestBin)
    ? [jestBin, '--runInBand', '--runTestsByPath', ...testFiles]
    : [path.join(repoRoot, 'node_modules', '.bin', 'jest'), '--runInBand', '--runTestsByPath', ...testFiles];

  const result = spawnSync(process.execPath, commandArgs, {
    cwd: repoRoot,
    encoding: 'utf-8'
  });

  const mergedOutput = `${result.stdout ?? ''}${result.stderr ?? ''}`;
  return {
    ok: result.status === 0,
    exitCode: result.status ?? 1,
    output: mergedOutput
  };
}
