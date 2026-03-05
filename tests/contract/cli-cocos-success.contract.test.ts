import fs from 'fs-extra';
import path from 'node:path';
import { executePipeline } from '../../src/core/pipeline';
import { createTempDir } from '../helpers';

describe('cli cocos success contract', () => {
  test('执行后生成核心文件', async () => {
    process.env.LNNGFAR_SKIP_BLUEPRINT_TESTS = '1';
    const repoRoot = path.resolve(__dirname, '../..');
    const cwd = createTempDir('lnngfar-us1-success-');

    const result = await executePipeline({
      blueprintName: 'cocos',
      cwd,
      repoRoot
    });

    expect(result.blueprintName).toBe('cocos');
    expect(fs.existsSync(path.join(cwd, 'assets/scripts/entry/GameEntry.ts'))).toBe(true);
    expect(fs.existsSync(path.join(cwd, 'assets/scripts/core/GameApp.ts'))).toBe(true);
    expect(fs.existsSync(path.join(cwd, 'assets/scripts/gameplay/GameLoop.ts'))).toBe(true);
    expect(fs.existsSync(path.join(cwd, 'assets/resources/config/game-config.json'))).toBe(true);
    expect(fs.existsSync(path.join(cwd, 'tests/game-loop.spec.ts'))).toBe(true);
  });
});
