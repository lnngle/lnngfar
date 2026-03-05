import { GameEntry } from '../assets/scripts/entry/GameEntry';
import { SampleModule } from '../assets/scripts/modules/sample/SampleModule';
import { gameConfig } from '../assets/scripts/config/GameConfig';

describe('sample blueprint output', () => {
  test('初始化入口可用', () => {
    const app = GameEntry.boot();
    const hud = app.update(16);
    expect(hud.running).toBe(true);
  });

  test('示例模块可用', () => {
    const module = new SampleModule();
    expect(module.getName()).toBe('mini-game-sample-feature');
    expect(module.getFeatureFlags()).toContain('score-system');
  });

  test('小游戏配置可加载', () => {
    expect(gameConfig.sceneName).toBe('MainScene');
    expect(gameConfig.spawnIntervalMs).toBeGreaterThan(100);
  });
});
