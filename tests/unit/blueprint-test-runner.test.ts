import fs from 'fs-extra';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { runBlueprintTests } from '../../src/execution/blueprint-test-runner';

jest.mock('node:child_process', () => ({
  spawnSync: jest.fn()
}));

describe('blueprint-test-runner', () => {
  const mockedSpawnSync = spawnSync as unknown as jest.Mock;

  test('当设置跳过环境变量时直接成功', () => {
    const previous = process.env.LNNGFAR_SKIP_BLUEPRINT_TESTS;
    process.env.LNNGFAR_SKIP_BLUEPRINT_TESTS = '1';

    try {
      const result = runBlueprintTests('ignored', 'ignored');
      expect(result.ok).toBe(true);
      expect(result.exitCode).toBe(0);
      expect(result.output).toContain('跳过 Blueprint 测试');
      expect(mockedSpawnSync).not.toHaveBeenCalled();
    } finally {
      if (previous === undefined) {
        delete process.env.LNNGFAR_SKIP_BLUEPRINT_TESTS;
      } else {
        process.env.LNNGFAR_SKIP_BLUEPRINT_TESTS = previous;
      }
    }
  });

  test('测试目录不存在时返回失败', () => {
    const result = runBlueprintTests(path.join(os.tmpdir(), 'not-exists-dir'), process.cwd());
    expect(result.ok).toBe(false);
    expect(result.output).toContain('未找到 Blueprint 测试目录');
  });

  test('仅把测试文件传递给 jest', () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'lnngfar-runner-'));
    const testsPath = path.join(tempRoot, 'blueprint-tests');
    const repoRoot = path.join(tempRoot, 'repo');
    const jestBin = path.join(repoRoot, 'node_modules', 'jest', 'bin', 'jest.js');

    fs.ensureDirSync(path.join(testsPath, 'nested'));
    fs.ensureDirSync(path.dirname(jestBin));
    fs.writeFileSync(path.join(testsPath, 'a.spec.ts'), "test('a', () => expect(1).toBe(1));", 'utf-8');
    fs.writeFileSync(path.join(testsPath, 'nested', 'b.test.ts'), "test('b', () => expect(1).toBe(1));", 'utf-8');
    fs.writeFileSync(path.join(testsPath, 'README.md'), '# not a test', 'utf-8');
    fs.writeFileSync(jestBin, '', 'utf-8');

    mockedSpawnSync.mockReturnValue({
      status: 0,
      stdout: 'ok',
      stderr: ''
    });

    try {
      const result = runBlueprintTests(testsPath, repoRoot);
      expect(result.ok).toBe(true);
      expect(mockedSpawnSync).toHaveBeenCalledTimes(1);

      const args = mockedSpawnSync.mock.calls[0][1] as string[];
      expect(args[0]).toBe(jestBin);
      expect(args[1]).toBe('--runInBand');
      expect(args[2]).toBe('--runTestsByPath');
      expect(args).toContain(path.join(testsPath, 'a.spec.ts'));
      expect(args).toContain(path.join(testsPath, 'nested', 'b.test.ts'));
      expect(args).not.toContain(path.join(testsPath, 'README.md'));
    } finally {
      fs.removeSync(tempRoot);
      mockedSpawnSync.mockReset();
    }
  });
});
