import { ObstacleEntity, GameWorld } from '../model/GameWorld';

export class ObstacleSystem {
  public update(world: GameWorld, deltaMs: number): void {
    const survivors: ObstacleEntity[] = [];

    for (const obstacle of world.obstacles) {
      obstacle.distance -= obstacle.speed * (deltaMs / 1000);

      if (obstacle.distance <= 0 && obstacle.lane === world.player.lane) {
        world.player.damage(1);
        continue;
      }

      if (obstacle.distance > -2) {
        survivors.push(obstacle);
      }
    }

    world.obstacles.length = 0;
    world.obstacles.push(...survivors);

    if (!world.player.isAlive) {
      world.running = false;
    }
  }
}
