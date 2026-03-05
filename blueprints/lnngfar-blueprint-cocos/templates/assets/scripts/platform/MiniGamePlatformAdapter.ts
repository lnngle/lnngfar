import { PlatformAdapter } from '../core/types';

export class MiniGamePlatformAdapter implements PlatformAdapter {
  public lastReportedScore = 0;
  public lastSavedBestScore = 0;
  public vibrationCount = 0;

  public vibrate(_: number): void {
    this.vibrationCount += 1;
  }

  public reportScore(score: number): void {
    this.lastReportedScore = score;
  }

  public saveBestScore(score: number): void {
    this.lastSavedBestScore = score;
  }
}
