import fs from 'fs-extra';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { executePipeline } from '../../src/core/pipeline';
import { createRepoTempDir } from '../helpers';

describe('generated cocos project tests integration', () => {
  test('生成项目后可直接通过模板自带测试', async () => {
    process.env.LNNGFAR_SKIP_BLUEPRINT_TESTS = '1';
    const repoRoot = path.resolve(__dirname, '../..');
    const cwd = createRepoTempDir(repoRoot, '.lnngfar-generated-');

    try {
      await executePipeline({ blueprintName: 'cocos', cwd, repoRoot });

      const tscBin = path.join(repoRoot, 'node_modules', 'typescript', 'bin', 'tsc');
      const jestBin = path.join(repoRoot, 'node_modules', 'jest', 'bin', 'jest.js');
      const configPath = path.join(cwd, 'jest.config.cjs');

      const buildResult = spawnSync(process.execPath, [tscBin, '-p', 'tsconfig.json', '--noEmit'], {
        cwd,
        encoding: 'utf-8'
      });

      expect(buildResult.status).toBe(0);

      const result = spawnSync(process.execPath, [jestBin, '--runInBand', '--config', configPath, '--coverage', '--coverageReporters=text-summary'], {
        cwd,
        encoding: 'utf-8'
      });

      const output = `${result.stdout ?? ''}${result.stderr ?? ''}`;
      expect(result.status).toBe(0);
      expect(output).toContain('Coverage summary');
      expect(output).toContain('PASS');
    } finally {
      fs.removeSync(cwd);
    }
  });
});
