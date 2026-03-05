import { LaneIndex, PlayerState } from './PlayerState';

export interface ObstacleEntity {
  id: number;
  lane: LaneIndex;
  distance: number;
  speed: number;
  passed: boolean;
}

export class GameWorld {
  public readonly player: PlayerState;
  public readonly obstacles: ObstacleEntity[] = [];
  public elapsedMs = 0;
  public spawnAccumulatorMs = 0;
  public score = 0;
  public bestScore = 0;
  public running = true;
  private nextObstacleId = 1;

  constructor(maxHitPoint: number) {
    this.player = new PlayerState(maxHitPoint);
  }

  public createObstacle(lane: LaneIndex, distance: number, speed: number): ObstacleEntity {
    const obstacle: ObstacleEntity = {
      id: this.nextObstacleId,
      lane,
      distance,
      speed,
      passed: false
    };

    this.nextObstacleId += 1;
    this.obstacles.push(obstacle);
    return obstacle;
  }

  public updateBestScore(): void {
    this.bestScore = Math.max(this.bestScore, this.score);
  }
}
