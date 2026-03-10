import fs from 'fs-extra';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { withTempDir } from '../helpers';

describe('first run success e2e', () => {
  test('在空目录执行 CLI 可成功生成项目', async () => {
    const repoRoot = path.resolve(__dirname, '../..');

    await withTempDir('lnngfar-e2e-first-run-', async (cwd) => {
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
      expect(fs.existsSync(path.join(cwd, 'cocos-project', 'assets', 'script', 'Main.ts'))).toBe(true);
    });
  });
});
