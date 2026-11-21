import { BoxGeometry, Group, Mesh, MeshBasicMaterial, MeshStandardMaterial, PlaneGeometry } from 'three';

export class Mob extends Group {
  readonly maxHp = 100;
  hp = this.maxHp;

  private readonly body = new Mesh(
    new BoxGeometry(1.45, 1.45, 1.45),
    new MeshStandardMaterial({ color: 0xe74c3c }),
  );

  private readonly healthTrack = new Mesh(
    new PlaneGeometry(1.4, 0.14),
    new MeshBasicMaterial({ color: 0x301e29 }),
  );

  private readonly healthFill = new Mesh(
    this.healthTrack.geometry,
    new MeshBasicMaterial({ color: 0xff8f81 }),
  );

  constructor(readonly mobId: string, x: number, z: number) {
    super();
    this.position.set(x, 0, z);
    this.body.position.y = 0.725;
    this.healthTrack.position.y = 1.85;
    this.healthTrack.add(this.healthFill);
    this.healthFill.position.z = 0.01;
    this.add(this.body, this.healthTrack);
  }

  get isDead(): boolean {
    return this.hp <= 0;
  }

  takeDamage(damage: number): void {
    this.hp = Math.max(0, this.hp - damage);
    const remaining = this.hp / this.maxHp;
    this.healthFill.scale.x = remaining;
    this.healthFill.position.x = -0.7 * (1 - remaining);
    this.visible = !this.isDead;
  }

  faceCamera(rotation: Group['quaternion']): void {
    this.healthTrack.quaternion.copy(rotation);
  }

  dispose(): void {
    this.removeFromParent();
    this.body.geometry.dispose();
    this.body.material.dispose();
    this.healthTrack.geometry.dispose();
    this.healthTrack.material.dispose();
    this.healthFill.material.dispose();
  }
}
