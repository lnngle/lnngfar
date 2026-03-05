import { GameSnapshot } from '../core/types';

export interface HudState {
  scoreText: string;
  hpText: string;
  running: boolean;
}

export class HudView {
  public render(snapshot: GameSnapshot): HudState {
    return {
      scoreText: `Score: ${snapshot.score}`,
      hpText: `HP: ${snapshot.hitPoint}`,
      running: !snapshot.isGameOver
    };
  }
}
