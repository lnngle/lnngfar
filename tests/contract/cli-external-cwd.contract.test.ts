import fs from 'fs-extra';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createTempDir } from '../helpers';

describe('cli external cwd contract', () => {
  test('在仓库外目录执行 bin 仍可发现内置 blueprint', () => {
    const repoRoot = path.resolve(__dirname, '../..');
    const cwd = createTempDir('lnngfar-cli-external-');

    try {
      const result = spawnSync(process.execPath, [path.join(repoRoot, 'bin', 'lnngfar.js'), 'cocos'], {
        cwd,
        env: {
          ...process.env,
          LNNGFAR_SKIP_BLUEPRINT_TESTS: '1'
        },
        encoding: 'utf-8'
      });

      const output = `${result.stdout ?? ''}${result.stderr ?? ''}`;
      expect(result.status).toBe(0);
      expect(output).toContain('生成成功');
      expect(fs.existsSync(path.join(cwd, 'assets/script/Main.ts'))).toBe(true);
    } finally {
      fs.removeSync(cwd);
    }
  });
});
