import { PlayerState } from '../assets/scripts/gameplay/model/PlayerState';

describe('player state', () => {
  test('车道移动边界正确', () => {
    const player = new PlayerState(3);

    player.moveLeft();
    player.moveLeft();
    player.moveLeft();
    expect(player.lane).toBe(0);

    player.moveRight();
    player.moveRight();
    player.moveRight();
    expect(player.lane).toBe(2);
  });

  test('受伤后生命值不低于 0', () => {
    const player = new PlayerState(2);

    player.damage(1);
    expect(player.hitPoint).toBe(1);
    expect(player.isAlive).toBe(true);

    player.damage(5);
    expect(player.hitPoint).toBe(0);
    expect(player.isAlive).toBe(false);
  });
});
