import { InitRes } from '../../assets/script/game/initialize/bll/InitRes';

describe('InitRes', () => {
  test('预加载流程可执行', () => {
    const initRes = new InitRes();
    expect(() => initRes.preload()).not.toThrow();
  });
});
