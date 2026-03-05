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
    expect(paths).toContain('assets/scripts/entry/GameEntry.ts');
    expect(paths).toContain('assets/scripts/modules/sample/SampleModule.ts');
    expect(paths).toContain('tests/sample.spec.ts');
  });
});
