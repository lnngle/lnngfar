import { validateBlueprintManifest } from '../../src/validation/manifest-validator';

describe('prefix validation contract', () => {
  test('非法包名前缀被拒绝', () => {
    const result = validateBlueprintManifest({
      name: 'cocos',
      packageName: 'cocos-blueprint',
      version: '1.0.0',
      description: 'x',
      target: 'x',
      language: 'x',
      engine: 'x',
      testFramework: 'jest'
    });

    expect(result.valid).toBe(false);
    expect(result.errors.join(' ')).toContain('packageName 必须以 lnngfar-blueprint- 开头');
  });
});
