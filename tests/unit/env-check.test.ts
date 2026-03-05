import { checkNodeVersion, parseNodeMajor } from '../../src/core/env-check';
import { PipelineError } from '../../src/errors/stage-error';

describe('env-check', () => {
  test('解析 major 版本', () => {
    expect(parseNodeMajor('18.20.4')).toBe(18);
  });

  test('低版本抛出环境错误', () => {
    expect(() => checkNodeVersion('16.0.0', 18)).toThrow(PipelineError);
  });

  test('满足版本返回成功', () => {
    const result = checkNodeVersion('18.0.0', 18);
    expect(result.ok).toBe(true);
  });
});
