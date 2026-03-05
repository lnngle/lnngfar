import fs from 'fs-extra';
import path from 'node:path';
import { executePipeline } from '../../src/core/pipeline';
import { createTempDir } from '../helpers';

describe('cocos minigame template integration', () => {
  test('生成完整小游戏项目关键骨架', async () => {
    process.env.LNNGFAR_SKIP_BLUEPRINT_TESTS = '1';
    const repoRoot = path.resolve(__dirname, '../..');
    const cwd = createTempDir('lnngfar-cocos-full-');

    await executePipeline({ blueprintName: 'cocos', cwd, repoRoot });

    const requiredFiles = [
      'README.md',
      'package.json',
      'tsconfig.json',
      'jest.config.cjs',
      'assets/resources/config/game-config.json',
      'assets/resources/levels/level-001.json',
      'assets/scripts/entry/GameEntry.ts',
      'assets/scripts/core/GameApp.ts',
      'assets/scripts/gameplay/GameLoop.ts',
      'assets/scripts/gameplay/systems/ObstacleSystem.ts',
      'assets/scripts/platform/MiniGamePlatformAdapter.ts',
      'assets/scripts/ui/HudView.ts',
      'tests/game-loop.spec.ts',
      'tests/config-loading.spec.ts',
      'tests/sample.spec.ts'
    ];

    for (const relativePath of requiredFiles) {
      expect(fs.existsSync(path.join(cwd, relativePath))).toBe(true);
    }
  });
});
