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
      'settings/v2/packages/project.json',
      'settings/v2/packages/program.json',
      'settings/v2/packages/builder.json',
      'settings/v2/packages/engine.json',
      'settings/v2/packages/device.json',
      'assets/main.scene',
      'assets/main.scene.meta',
      'assets/bundle.meta',
      'assets/libs.meta',
      'assets/resources.meta',
      'assets/bundle/common/texture/bg_window.png',
      'assets/libs/seedrandom/seedrandom.min.js',
      'assets/resources/config.json',
      'assets/script/Main.ts',
      'assets/script/Main.ts.meta',
      'assets/script.meta',
      'assets/script/game/common/SingletonModuleComp.ts',
      'assets/script/game/common/config/GameUIConfig.ts',
      'assets/script/game/initialize/Initialize.ts',
      'assets/script/game/initialize/bll/InitRes.ts'
    ];

    for (const relativePath of requiredFiles) {
      expect(fs.existsSync(path.join(cwd, relativePath))).toBe(true);
    }

    const removedLegacyPaths = [
      'assets/scripts',
      'tests',
      'jest.config.cjs'
    ];

    for (const relativePath of removedLegacyPaths) {
      expect(fs.existsSync(path.join(cwd, relativePath))).toBe(false);
    }
  });
});
