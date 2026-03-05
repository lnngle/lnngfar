import { validateBlueprintManifest } from '../../src/validation/manifest-validator';

describe('blueprint upgrade compatibility integration', () => {
  test('版本升级不影响 manifest 兼容性', () => {
    const v1 = validateBlueprintManifest({
      name: 'cocos',
      packageName: 'lnngfar-blueprint-cocos',
      version: '1.0.0',
      description: 'x',
      target: 'x',
      language: 'TypeScript',
      engine: 'oops-framework',
      testFramework: 'jest'
    });

    const v2 = validateBlueprintManifest({
      name: 'cocos',
      packageName: 'lnngfar-blueprint-cocos',
      version: '2.0.0',
      description: 'x',
      target: 'x',
      language: 'TypeScript',
      engine: 'oops-framework',
      testFramework: 'jest'
    });

    expect(v1.valid).toBe(true);
    expect(v2.valid).toBe(true);
  });
});
