import { UIConfigData } from '../../assets/script/game/common/config/GameUIConfig';

describe('GameUIConfig', () => {
  test('提供默认首屏 UI 配置', () => {
    expect(UIConfigData.bootUI).toBe('Demo');
  });

  test('配置对象为只读', () => {
    expect(Object.isFrozen(UIConfigData)).toBe(true);
  });
});
