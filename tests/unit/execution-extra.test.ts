import fs from 'fs-extra';
import path from 'node:path';
import { createTempDir } from '../helpers';
import { runBlueprintTests } from '../../src/execution/blueprint-test-runner';
import { writeArtifactsDeterministically } from '../../src/execution/deterministic-writer';
import { withTransactionalOutput } from '../../src/execution/transactional-writer';

jest.mock('node:child_process', () => ({
  spawnSync: jest.fn()
}));

import { spawnSync } from 'node:child_process';

describe('execution extra branches', () => {
  const mockedSpawnSync = spawnSync as unknown as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    delete process.env.LNNGFAR_SKIP_BLUEPRINT_TESTS;
  });

  test('blueprint 测试文件为空时返回失败', () => {
    const root = createTempDir('lnngfar-tests-empty-');
    fs.ensureDirSync(root);

    const result = runBlueprintTests(root, process.cwd());
    expect(result.ok).toBe(false);
    expect(result.output).toContain('未找到测试文件');
  });

  test('jest.js 不存在时走 .bin/jest 回退路径', () => {
    const tempRoot = createTempDir('lnngfar-tests-fallback-');
    const testsPath = path.join(tempRoot, 'tests');
    const repoRoot = path.join(tempRoot, 'repo');

    fs.ensureDirSync(testsPath);
    fs.writeFileSync(path.join(testsPath, 'sample.test.ts'), 'test("x", () => expect(1).toBe(1));', 'utf-8');
    fs.ensureDirSync(path.join(repoRoot, 'node_modules', '.bin'));
    fs.writeFileSync(path.join(repoRoot, 'node_modules', '.bin', 'jest'), '', 'utf-8');

    mockedSpawnSync.mockReturnValue({ status: 0, stdout: 'ok', stderr: '' });

    const result = runBlueprintTests(testsPath, repoRoot);
    expect(result.ok).toBe(true);

    const args = mockedSpawnSync.mock.calls[0][1] as string[];
    expect(args[0]).toBe(path.join(repoRoot, 'node_modules', '.bin', 'jest'));
  });

  test('spawnSync 返回空输出与 null 状态时使用默认回退值', () => {
    const tempRoot = createTempDir('lnngfar-tests-null-status-');
    const testsPath = path.join(tempRoot, 'tests');
    const repoRoot = path.join(tempRoot, 'repo');

    fs.ensureDirSync(testsPath);
    fs.writeFileSync(path.join(testsPath, 'sample.test.ts'), 'test("x", () => expect(1).toBe(1));', 'utf-8');
    fs.ensureDirSync(path.join(repoRoot, 'node_modules', '.bin'));
    fs.writeFileSync(path.join(repoRoot, 'node_modules', '.bin', 'jest'), '', 'utf-8');

    mockedSpawnSync.mockReturnValue({ status: null, stdout: undefined, stderr: undefined });

    const result = runBlueprintTests(testsPath, repoRoot);
    expect(result.ok).toBe(false);
    expect(result.exitCode).toBe(1);
    expect(result.output).toBe('');
  });

  test('deterministic writer 支持 base64 和 sort=false', async () => {
    const out = createTempDir('lnngfar-writer-');

    await writeArtifactsDeterministically(
      out,
      [
        { path: 'b.txt', content: 'B', contentEncoding: 'utf-8' },
        { path: 'a.bin', content: Buffer.from('hello').toString('base64'), contentEncoding: 'base64' }
      ],
      { sort: false, concurrency: 0 }
    );

    const text = fs.readFileSync(path.join(out, 'b.txt'), 'utf-8');
    const bin = fs.readFileSync(path.join(out, 'a.bin')).toString('utf-8');
    expect(text).toBe('B');
    expect(bin).toBe('hello');
  });

  test('deterministic writer 默认按路径排序写入', async () => {
    const out = createTempDir('lnngfar-writer-sorted-');

    await writeArtifactsDeterministically(out, [
      { path: 'z.txt', content: 'Z', contentEncoding: 'utf-8' },
      { path: 'a.txt', content: 'A', contentEncoding: 'utf-8' }
    ]);

    expect(fs.readFileSync(path.join(out, 'a.txt'), 'utf-8')).toBe('A');
    expect(fs.readFileSync(path.join(out, 'z.txt'), 'utf-8')).toBe('Z');
  });

  test('transactional writer 在 writer 抛错时清理临时目录并透传错误', async () => {
    const out = path.join(createTempDir('lnngfar-txn-fail-'), 'project');

    await expect(
      withTransactionalOutput(out, async () => {
        throw new Error('writer failed');
      })
    ).rejects.toThrow('writer failed');

    expect(fs.existsSync(out)).toBe(false);
  });
});
