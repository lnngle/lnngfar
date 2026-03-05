import { GameEntry } from '../assets/scripts/entry/GameEntry';
import { SampleModule } from '../assets/scripts/modules/sample/SampleModule';

describe('sample blueprint output', () => {
  test('初始化入口可用', () => {
    expect(GameEntry.boot()).toBe('oops-framework-initialized');
  });

  test('示例模块可用', () => {
    const module = new SampleModule();
    expect(module.getName()).toBe('sample-module');
  });
});
