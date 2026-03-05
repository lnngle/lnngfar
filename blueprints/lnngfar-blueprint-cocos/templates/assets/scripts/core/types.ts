export interface PlatformAdapter {
  vibrate(durationMs: number): void;
  reportScore(score: number): void;
  saveBestScore(score: number): void;
}

export interface GameSnapshot {
  elapsedMs: number;
  score: number;
  bestScore: number;
  hitPoint: number;
  obstacleCount: number;
  isGameOver: boolean;
}
