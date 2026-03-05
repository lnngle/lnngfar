export type LaneIndex = 0 | 1 | 2;

export class PlayerState {
  public lane: LaneIndex = 1;
  public hitPoint: number;

  constructor(maxHitPoint: number) {
    this.hitPoint = maxHitPoint;
  }

  public moveLeft(): void {
    if (this.lane > 0) {
      this.lane = (this.lane - 1) as LaneIndex;
    }
  }

  public moveRight(): void {
    if (this.lane < 2) {
      this.lane = (this.lane + 1) as LaneIndex;
    }
  }

  public damage(amount = 1): void {
    this.hitPoint = Math.max(0, this.hitPoint - amount);
  }

  public get isAlive(): boolean {
    return this.hitPoint > 0;
  }
}
