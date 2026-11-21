import { BoxGeometry, Group, Mesh, MeshStandardMaterial, Vector3 } from 'three';
import type { InputManager } from '../core/InputManager';

const bodyWidth = 1;

export class Player extends Group {
  readonly speed = 6;
  readonly maxHp = 100;
  hp = this.maxHp;

  private readonly direction = new Vector3();
  private readonly body: Mesh<BoxGeometry, MeshStandardMaterial>;

  constructor(color = 0x63b3ff) {
    super();
    this.body = new Mesh(
      new BoxGeometry(bodyWidth, 2, bodyWidth),
      new MeshStandardMaterial({ color, roughness: 0.65 }),
    );
    this.body.position.y = 1;
    this.add(this.body);
  }

  move(delta: number, input: InputManager, worldHalfSize: number): void {
    this.direction.set(
      Number(input.isDown('KeyD')) - Number(input.isDown('KeyA')),
      0,
      Number(input.isDown('KeyS')) - Number(input.isDown('KeyW')),
    );
    if (this.direction.lengthSq() === 0) return;

    this.direction.normalize();
    this.position.addScaledVector(this.direction, this.speed * delta);
    const limit = worldHalfSize - Math.SQRT2 * bodyWidth / 2;
    this.position.x = Math.max(-limit, Math.min(limit, this.position.x));
    this.position.z = Math.max(-limit, Math.min(limit, this.position.z));
    this.rotation.y = Math.atan2(this.direction.x, this.direction.z);
  }

  dispose(): void {
    this.removeFromParent();
    this.body.geometry.dispose();
    this.body.material.dispose();
  }
}
