import rawConfig from '../../resources/config/game-config.json';

export interface GameConfig {
  sceneName: string;
  targetFps: number;
  spawnIntervalMs: number;
  obstacleSpeed: number;
  arenaDistance: number;
  laneCount: number;
  maxHitPoint: number;
}

export const gameConfig: GameConfig = Object.freeze({ ...(rawConfig as GameConfig) });
