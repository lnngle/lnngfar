import { GameApp } from '../assets/scripts/core/GameApp';
import { gameConfig, GameConfig } from '../assets/scripts/config/GameConfig';
import { MiniGamePlatformAdapter } from '../assets/scripts/platform/MiniGamePlatformAdapter';

describe('game app lifecycle', () => {
  test('移动输入与快照读取可用', () => {
    const adapter = new MiniGamePlatformAdapter();
    const app = new GameApp(adapter);

    app.moveLeft();
    app.moveRight();
    const snapshot = app.getSnapshot();

    expect(snapshot.isGameOver).toBe(false);
    expect(snapshot.hitPoint).toBeGreaterThan(0);
    expect(snapshot.elapsedMs).toBeGreaterThanOrEqual(0);
  });

  test('start 后返回可运行 HUD 状态', () => {
    const adapter = new MiniGamePlatformAdapter();
    const app = new GameApp(adapter);

    const hud = app.start();

    expect(hud.running).toBe(true);
    expect(hud.hpText).toContain('HP:');
    expect(hud.scoreText).toContain('Score:');
  });

  test('游戏结束时上报平台数据', () => {
    const fastConfig: GameConfig = {
      ...gameConfig,
      spawnIntervalMs: 100,
      obstacleSpeed: 100,
      arenaDistance: 1,
      maxHitPoint: 1
    };

    const adapter = new MiniGamePlatformAdapter();
    const app = new GameApp(adapter, fastConfig);

    for (let i = 0; i < 8; i += 1) {
      app.update(100);
    }

    const snapshot = app.getSnapshot();
    expect(snapshot.isGameOver).toBe(true);
    expect(adapter.vibrationCount).toBeGreaterThan(0);
    expect(adapter.lastReportedScore).toBe(snapshot.score);
    expect(adapter.lastSavedBestScore).toBe(snapshot.bestScore);
  });
});
