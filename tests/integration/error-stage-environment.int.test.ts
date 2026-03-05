import { checkNodeVersion } from '../../src/core/env-check';

describe('error stage environment integration', () => {
  test('环境失败可识别', () => {
    expect(() => checkNodeVersion('14.0.0', 18)).toThrow();
  });
});
