import level001 from '../assets/resources/levels/level-001.json';
import { gameConfig } from '../assets/scripts/config/GameConfig';
import { GameApp } from '../assets/scripts/core/GameApp';
import { MiniGamePlatformAdapter } from '../assets/scripts/platform/MiniGamePlatformAdapter';

describe('project configuration', () => {
  test('加载小游戏配置与关卡数据', () => {
    expect(gameConfig.sceneName).toBe('MainScene');
    expect(gameConfig.laneCount).toBe(3);
    expect(level001.id).toBe('level-001');
    expect(Object.isFrozen(gameConfig)).toBe(true);
  });

  test('应用可启动并返回 HUD 状态', () => {
    const app = new GameApp(new MiniGamePlatformAdapter());
    const state = app.start();

    expect(state.running).toBe(true);
    expect(state.scoreText.startsWith('Score:')).toBe(true);
  });
});
