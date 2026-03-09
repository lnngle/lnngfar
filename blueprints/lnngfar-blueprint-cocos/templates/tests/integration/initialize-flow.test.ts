import { InitRes } from '../../assets/script/game/initialize/bll/InitRes';
import { Initialize } from '../../assets/script/game/initialize/Initialize';

describe('Initialize integration', () => {
  test('run 会触发资源预加载', () => {
    const spy = jest.spyOn(InitRes.prototype, 'preload');

    const initialize = new Initialize();
    initialize.run();

    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });
});
