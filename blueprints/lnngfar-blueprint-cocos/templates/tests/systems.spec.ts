import { GameWorld } from '../assets/scripts/gameplay/model/GameWorld';
import { ObstacleSystem } from '../assets/scripts/gameplay/systems/ObstacleSystem';
import { ScoreSystem } from '../assets/scripts/gameplay/systems/ScoreSystem';

describe('game systems', () => {
  test('障碍碰撞会扣血并在生命归零后结束游戏', () => {
    const world = new GameWorld(1);
    world.createObstacle(world.player.lane, 0.5, 10);

    const obstacleSystem = new ObstacleSystem();
    obstacleSystem.update(world, 100);

    expect(world.player.hitPoint).toBe(0);
    expect(world.running).toBe(false);
  });

  test('错道通过障碍会增加奖励分并更新最高分', () => {
    const world = new GameWorld(3);
    world.createObstacle(0, 0, 1);
    world.player.moveRight();

    const scoreSystem = new ScoreSystem();
    scoreSystem.apply(world, 120);

    expect(world.score).toBeGreaterThanOrEqual(6);
    expect(world.bestScore).toBe(world.score);
  });
});
