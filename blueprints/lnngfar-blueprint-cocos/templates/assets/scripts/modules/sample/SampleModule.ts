export class SampleModule {
  public getName(): string {
    return 'mini-game-sample-feature';
  }

  public getFeatureFlags(): string[] {
    return ['score-system', 'obstacle-system', 'hud-view'];
  }
}
