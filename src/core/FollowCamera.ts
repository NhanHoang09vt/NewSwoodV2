import { PerspectiveCamera, Vector3 } from 'three';

export class FollowCamera {
  private readonly offset = new Vector3(0, 12, 14);
  private readonly target = new Vector3();

  constructor(private readonly camera: PerspectiveCamera) {}

  snap(position: Vector3): void {
    this.camera.position.copy(position).add(this.offset);
    this.camera.lookAt(position);
  }

  update(delta: number, position: Vector3): void {
    this.target.copy(position).add(this.offset);
    this.camera.position.lerp(this.target, 1 - Math.exp(-8 * delta));
    this.camera.lookAt(position);
  }
}
