import { GameConfig } from '../config/GameConfig';
import { GameSnapshot } from '../core/types';
import { GameWorld } from './model/GameWorld';
import { LaneIndex } from './model/PlayerState';
import { ObstacleSystem } from './systems/ObstacleSystem';
import { ScoreSystem } from './systems/ScoreSystem';

const laneOrder: LaneIndex[] = [0, 1, 2];

export class GameLoop {
  private readonly world: GameWorld;
  private readonly obstacleSystem = new ObstacleSystem();
  private readonly scoreSystem = new ScoreSystem();
  private spawnSeed = 0;

  constructor(private readonly config: GameConfig) {
    this.world = new GameWorld(config.maxHitPoint);
  }

  public moveLeft(): void {
    this.world.player.moveLeft();
  }

  public moveRight(): void {
    this.world.player.moveRight();
  }

  public tick(deltaMs: number): GameSnapshot {
    if (deltaMs <= 0) {
      return this.snapshot();
    }

    if (!this.world.running) {
      return this.snapshot();
    }

    this.world.elapsedMs += deltaMs;
    this.world.spawnAccumulatorMs += deltaMs;

    while (this.world.spawnAccumulatorMs >= this.config.spawnIntervalMs) {
      this.world.spawnAccumulatorMs -= this.config.spawnIntervalMs;
      this.spawnObstacle();
    }

    this.obstacleSystem.update(this.world, deltaMs);
    this.scoreSystem.apply(this.world, deltaMs);

    return this.snapshot();
  }

  public getSnapshot(): GameSnapshot {
    return this.snapshot();
  }

  private spawnObstacle(): void {
    const lane = laneOrder[this.spawnSeed % laneOrder.length];
    this.spawnSeed += 1;
    this.world.createObstacle(lane, this.config.arenaDistance, this.config.obstacleSpeed);
  }

  private snapshot(): GameSnapshot {
    return {
      elapsedMs: this.world.elapsedMs,
      score: this.world.score,
      bestScore: this.world.bestScore,
      hitPoint: this.world.player.hitPoint,
      obstacleCount: this.world.obstacles.length,
      isGameOver: !this.world.running
    };
  }
}
