import fs from 'fs-extra';
import path from 'node:path';
import { executePipeline } from '../../src/core/pipeline';
import { withPatchedEnv, withRepoTempDir } from '../helpers';

describe('generated cocos project tests integration', () => {
  test('生成项目包含 Creator 可识别并可构建的关键配置', async () => {
    const repoRoot = path.resolve(__dirname, '../..');
    await withPatchedEnv({ LNNGFAR_SKIP_BLUEPRINT_TESTS: '1' }, async () => {
      await withRepoTempDir(repoRoot, '.lnngfar-generated-', async (cwd) => {
        const result = await executePipeline({ blueprintName: 'cocos', cwd, repoRoot });
        const outputDir = path.join(cwd, 'cocos-project');
        expect(result.outputDir).toBe(outputDir);

        const packageJson = fs.readJsonSync(path.join(outputDir, 'package.json')) as {
          creator?: { version?: string };
          name?: string;
          description?: string;
        };
        expect(packageJson.creator?.version).toMatch(/^\d+\.\d+\.\d+$/);
        expect(packageJson.name).toBe('cocos-project');
        expect(packageJson.description).toBe('cocos-project project');

        const packageLock = fs.readJsonSync(path.join(outputDir, 'package-lock.json')) as {
          name?: string;
          packages?: Record<string, { name?: string }>;
        };
        expect(packageLock.name).toBe('cocos-project');
        expect(packageLock.packages?.['']?.name).toBe('cocos-project');

        const projectSettings = fs.readJsonSync(path.join(outputDir, 'settings/v2/packages/project.json')) as {
          general?: {
            designResolution?: {
              width?: number;
              height?: number;
            };
          };
        };
        expect(projectSettings.general?.designResolution?.width).toBe(1200);
        expect(projectSettings.general?.designResolution?.height).toBe(720);

        const deviceSettings = fs.readJsonSync(path.join(outputDir, 'settings/v2/packages/device.json')) as {
          __version__?: string;
        };
        expect(deviceSettings.__version__).toBe('1.0.1');

        const sceneText = fs.readFileSync(path.join(outputDir, 'assets/main.scene'), 'utf-8');
        expect(sceneText).toContain('cc.SceneAsset');
        expect(sceneText).toContain('cc.Canvas');

        expect(fs.existsSync(path.join(outputDir, 'assets/bundle/common/texture/bg_window.png'))).toBe(true);
        expect(fs.existsSync(path.join(outputDir, 'assets/libs/seedrandom/seedrandom.min.js'))).toBe(true);
        expect(fs.existsSync(path.join(outputDir, 'assets/resources/config.json'))).toBe(true);
        expect(fs.existsSync(path.join(outputDir, '.creator/asset-template/typescript/Custom Script Template Help Documentation.url'))).toBe(true);
        expect(fs.existsSync(path.join(outputDir, 'excel/Language.xlsx'))).toBe(true);
        expect(fs.existsSync(path.join(outputDir, 'settings/v2/packages/oops-plugin-excel-to-json.json'))).toBe(true);

        const mainScript = fs.readFileSync(path.join(outputDir, 'assets/script/Main.ts'), 'utf-8');
        expect(mainScript).toContain("db://oops-framework");
        expect(mainScript).toContain('class Main extends Root');
      });
    });
  });
});
