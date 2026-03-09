import path from 'node:path';

const generator = require('../generators/index.js');

describe('lnngfar-blueprint-cocos generator', () => {
  test('返回稳定产物列表', async () => {
    const blueprintRootPath = path.resolve(__dirname, '..');
    const outputDir = path.join(blueprintRootPath, '.tmp-output');

    const artifacts = await generator.generate({
      outputDir,
      blueprintRootPath,
      manifestName: 'cocos'
    });

    const paths = artifacts.map((item: { path: string }) => item.path);
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
  });
});
