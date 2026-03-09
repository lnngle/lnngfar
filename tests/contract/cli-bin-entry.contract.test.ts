import fs from 'fs-extra';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

describe('cli bin entry contract', () => {
  test('bin 入口可直接执行并进入流水线', () => {
    const repoRoot = path.resolve(__dirname, '../..');
    const outputDir = path.join(repoRoot, 'cocos-project');
    fs.removeSync(outputDir);

    try {
      const result = spawnSync(process.execPath, [path.join(repoRoot, 'bin', 'lnngfar.js'), 'cocos'], {
        cwd: repoRoot,
        env: {
          ...process.env,
          LNNGFAR_SKIP_BLUEPRINT_TESTS: '1'
        },
        encoding: 'utf-8'
      });

      const output = `${result.stdout ?? ''}${result.stderr ?? ''}`;
      expect(result.status).toBe(0);
      expect(output).toContain('[阶段] 环境校验');
      expect(output).toContain('生成成功');
      expect(fs.existsSync(path.join(outputDir, 'assets/script/Main.ts'))).toBe(true);
      expect(fs.existsSync(path.join(repoRoot, 'dist/src/cli/index.js'))).toBe(true);
    } finally {
      fs.removeSync(outputDir);
    }
  });
});
