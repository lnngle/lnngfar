import { GameApp } from '../core/GameApp';
import { MiniGamePlatformAdapter } from '../platform/MiniGamePlatformAdapter';

export class GameEntry {
  public static boot(): GameApp {
    const app = new GameApp(new MiniGamePlatformAdapter());
    app.start();
    return app;
  }
}
