import { GameConfig, gameConfig } from '../config/GameConfig';
import { GameLoop } from '../gameplay/GameLoop';
import { HudState, HudView } from '../ui/HudView';
import { GameSnapshot, PlatformAdapter } from './types';

export class GameApp {
  private readonly loop: GameLoop;
  private readonly hudView = new HudView();

  constructor(private readonly platform: PlatformAdapter, config: GameConfig = gameConfig) {
    this.loop = new GameLoop(config);
  }

  public start(): HudState {
    return this.update(16);
  }

  public update(deltaMs: number): HudState {
    const snapshot = this.loop.tick(deltaMs);
    if (snapshot.isGameOver) {
      this.platform.vibrate(100);
      this.platform.reportScore(snapshot.score);
      this.platform.saveBestScore(snapshot.bestScore);
    }

    return this.hudView.render(snapshot);
  }

  public moveLeft(): void {
    this.loop.moveLeft();
  }

  public moveRight(): void {
    this.loop.moveRight();
  }

  public getSnapshot(): GameSnapshot {
    return this.loop.getSnapshot();
  }
}
