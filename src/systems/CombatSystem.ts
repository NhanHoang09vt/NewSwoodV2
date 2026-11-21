import type { Mob } from '../entities/Mob';
import type { Player } from '../entities/Player';

export function performMeleeAttack(
  attacker: Player,
  mobs: readonly Mob[],
  range = 2.5,
  damage = 35,
): void {
  for (const mob of mobs) {
    if (!mob.isDead && attacker.position.distanceTo(mob.position) <= range) {
      mob.takeDamage(damage);
    }
  }
}
