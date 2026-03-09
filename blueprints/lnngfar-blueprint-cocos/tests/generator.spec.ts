import path from 'node:path';

const generator = require('../generators/index.js');

describe('lnngfar-blueprint-cocos generator', () => {
  test('返回稳定产物列表', async () => {
    const previousCreatorVersion = process.env.LNNGFAR_COCOS_CREATOR_VERSION;
    process.env.LNNGFAR_COCOS_CREATOR_VERSION = '3.8.4';

    try {
      const blueprintRootPath = path.resolve(__dirname, '..');
      const outputDir = path.join(blueprintRootPath, '.tmp-output');

      const artifacts = await generator.generate({
        outputDir,
        blueprintRootPath,
        manifestName: 'cocos'
      });

      const paths = artifacts.map((item: { path: string }) => item.path);
      expect(paths).toContain('.creator/asset-template/typescript/Custom Script Template Help Documentation.url');
      expect(paths).toContain('package.json');
      expect(paths).toContain('LICENSE');
      expect(paths).toContain('yarn.lock');
      expect(paths).toContain('package-lock.json');
      expect(paths).toContain('excel/Language.xlsx');
      expect(paths).toContain('.c8rc.json');
      expect(paths).toContain('eslint.config.cjs');
      expect(paths).toContain('prettier.config.cjs');
      expect(paths).toContain('tools/update-plugins.js');
      expect(paths).toContain('tests/tools/checkers.test.js');
      expect(paths).toContain('settings/v2/packages/project.json');
      expect(paths).toContain('settings/v2/packages/oops-plugin-excel-to-json.json');
      expect(paths).toContain('assets/main.scene');
      expect(paths).toContain('assets/bundle/common/texture/bg_window.png');
      expect(paths).toContain('assets/libs/seedrandom/seedrandom.min.js');
      expect(paths).toContain('assets/resources/config.json');
      expect(paths).toContain('assets/script/Main.ts');
      expect(paths).toContain('assets/script/game/account/Account.ts');
      expect(paths).toContain('assets/script/game/initialize/bll/InitRes.ts');

      const pngArtifact = artifacts.find((item: { path: string }) => item.path === 'assets/bundle/common/texture/bg_window.png') as {
        contentEncoding?: string;
      };
      expect(pngArtifact.contentEncoding).toBe('base64');

      const packageArtifact = artifacts.find((item: { path: string }) => item.path === 'package.json') as {
        content: string;
      };
      const packageJson = JSON.parse(packageArtifact.content) as { creator?: { version?: string }; name?: string; description?: string };
      expect(packageJson.creator?.version).toBe('3.8.4');
      expect(packageJson.name).toBe('{{PROJECT_NAME}}');
      expect(packageJson.description).toBe('{{PROJECT_DESCRIPTION}}');

      const packageLockArtifact = artifacts.find((item: { path: string }) => item.path === 'package-lock.json') as {
        content: string;
      };
      const packageLock = JSON.parse(packageLockArtifact.content) as {
        name?: string;
        packages?: Record<string, { name?: string }>;
      };
      expect(packageLock.name).toBe('{{PROJECT_NAME}}');
      expect(packageLock.packages?.['']?.name).toBe('{{PROJECT_NAME}}');
    } finally {
      if (previousCreatorVersion === undefined) {
        delete process.env.LNNGFAR_COCOS_CREATOR_VERSION;
      } else {
        process.env.LNNGFAR_COCOS_CREATOR_VERSION = previousCreatorVersion;
      }
    }
  });
});
