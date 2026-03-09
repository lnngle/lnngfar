import fs from 'fs-extra';
import path from 'node:path';
import { executePipeline } from '../../src/core/pipeline';
import { createRepoTempDir } from '../helpers';

describe('generated cocos project tests integration', () => {
  test('生成项目包含 Creator 可识别并可构建的关键配置', async () => {
    process.env.LNNGFAR_SKIP_BLUEPRINT_TESTS = '1';
    const repoRoot = path.resolve(__dirname, '../..');
    const cwd = createRepoTempDir(repoRoot, '.lnngfar-generated-');

    try {
      await executePipeline({ blueprintName: 'cocos', cwd, repoRoot });

      const packageJson = fs.readJsonSync(path.join(cwd, 'package.json')) as {
        creator?: { version?: string };
      };
      expect(packageJson.creator?.version).toBe('3.8.7');

      const projectSettings = fs.readJsonSync(path.join(cwd, 'settings/v2/packages/project.json')) as {
        general?: {
          designResolution?: {
            width?: number;
            height?: number;
          };
        };
      };
      expect(projectSettings.general?.designResolution?.width).toBe(1200);
      expect(projectSettings.general?.designResolution?.height).toBe(720);

      const deviceSettings = fs.readJsonSync(path.join(cwd, 'settings/v2/packages/device.json')) as {
        __version__?: string;
      };
      expect(deviceSettings.__version__).toBe('1.0.1');

      const sceneText = fs.readFileSync(path.join(cwd, 'assets/main.scene'), 'utf-8');
      expect(sceneText).toContain('cc.SceneAsset');
      expect(sceneText).toContain('cc.Canvas');

      const mainScript = fs.readFileSync(path.join(cwd, 'assets/script/Main.ts'), 'utf-8');
      expect(mainScript).toContain('initializeResources');
      expect(mainScript).toContain('initializeUi');
      expect(mainScript).toContain('openFirstScreen');
    } finally {
      fs.removeSync(cwd);
    }
  });
});
