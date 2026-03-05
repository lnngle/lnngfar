import { GameWorld } from '../model/GameWorld';

export class ScoreSystem {
  public apply(world: GameWorld, deltaMs: number): void {
    const survivalScore = Math.max(1, Math.floor(deltaMs / 120));
    world.score += survivalScore;

    for (const obstacle of world.obstacles) {
      if (!obstacle.passed && obstacle.distance <= 0 && obstacle.lane !== world.player.lane) {
        obstacle.passed = true;
        world.score += 5;
      }
    }

    world.updateBestScore();
  }
}
