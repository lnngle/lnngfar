import { gameConfig, GameConfig } from '../assets/scripts/config/GameConfig';
import { GameLoop } from '../assets/scripts/gameplay/GameLoop';

describe('game loop', () => {
  test('固定步长下可稳定产出障碍与得分', () => {
    const loop = new GameLoop(gameConfig);

    const first = loop.tick(800);
    const second = loop.tick(800);

    expect(first.obstacleCount).toBeGreaterThanOrEqual(1);
    expect(second.score).toBeGreaterThan(first.score);
    expect(second.isGameOver).toBe(false);
  });

  test('多次碰撞后游戏结束', () => {
    const fastConfig: GameConfig = {
      ...gameConfig,
      spawnIntervalMs: 100,
      obstacleSpeed: 100,
      arenaDistance: 1,
      maxHitPoint: 3
    };

    const loop = new GameLoop(fastConfig);

    for (let i = 0; i < 12; i += 1) {
      loop.tick(100);
    }

    expect(loop.getSnapshot().isGameOver).toBe(true);
  });
});
