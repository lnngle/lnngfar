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
    expect(paths).toContain('jest.config.cjs');
    expect(paths).toContain('tsconfig.test.json');
    expect(paths).toContain('tests/unit/game-ui-config.test.ts');
    expect(paths).toContain('tests/unit/init-res.test.ts');
    expect(paths).toContain('tests/integration/initialize-flow.test.ts');
    expect(paths).toContain('package.json');
    expect(paths).toContain('settings/v2/packages/project.json');
    expect(paths).toContain('settings/v2/packages/program.json');
    expect(paths).toContain('settings/v2/packages/builder.json');
    expect(paths).toContain('settings/v2/packages/engine.json');
    expect(paths).toContain('settings/v2/packages/device.json');
    expect(paths).toContain('assets/main.scene');
    expect(paths).toContain('assets/main.scene.meta');
    expect(paths).toContain('assets/script/Main.ts');
    expect(paths).toContain('assets/script/Main.ts.meta');
    expect(paths).toContain('assets/script.meta');
    expect(paths).toContain('assets/bundle.meta');
    expect(paths).toContain('assets/libs.meta');
    expect(paths).toContain('assets/resources.meta');
    expect(paths).toContain('assets/bundle/common/texture/bg_window.png');
    expect(paths).toContain('assets/resources/config.json');
    expect(paths).toContain('assets/libs/seedrandom/seedrandom.min.js');
    expect(paths).toContain('assets/script/game/common/SingletonModuleComp.ts');
    expect(paths).toContain('assets/script/game/common/config/GameUIConfig.ts');
    expect(paths).toContain('assets/script/game/initialize/Initialize.ts');
    expect(paths).toContain('assets/script/game/initialize/bll/InitRes.ts');

    const pngArtifact = artifacts.find((item: { path: string }) => item.path === 'assets/bundle/common/texture/bg_window.png') as {
      contentEncoding?: string;
    };
    expect(pngArtifact.contentEncoding).toBe('base64');

      const packageArtifact = artifacts.find((item: { path: string }) => item.path === 'package.json') as {
        content: string;
      };
      expect(packageArtifact.content).toContain('"version": "3.8.4"');
    } finally {
      if (previousCreatorVersion === undefined) {
        delete process.env.LNNGFAR_COCOS_CREATOR_VERSION;
      } else {
        process.env.LNNGFAR_COCOS_CREATOR_VERSION = previousCreatorVersion;
      }
    }
  });
});
