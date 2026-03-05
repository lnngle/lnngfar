import { toBlueprintName, toPackageName } from '../../src/discovery/blueprint-name-mapper';

describe('blueprint-name-mapper', () => {
  test('包名转换为逻辑名', () => {
    expect(toBlueprintName('lnngfar-blueprint-cocos')).toBe('cocos');
  });

  test('非法包名前缀返回 null', () => {
    expect(toBlueprintName('foo-blueprint-cocos')).toBeNull();
  });

  test('逻辑名转换为包名', () => {
    expect(toPackageName('cocos')).toBe('lnngfar-blueprint-cocos');
  });
});
