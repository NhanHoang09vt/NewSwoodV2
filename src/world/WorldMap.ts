import { GridHelper, Group, Mesh, MeshStandardMaterial, PlaneGeometry } from 'three';

export const WORLD_SIZE = 100;

export class WorldMap extends Group {
  private readonly ground = new Mesh(
    new PlaneGeometry(WORLD_SIZE, WORLD_SIZE),
    new MeshStandardMaterial({ color: 0x232c3a, roughness: 1 }),
  );

  private readonly grid = new GridHelper(WORLD_SIZE, 50, 0x546685, 0x364358);

  constructor() {
    super();
    this.ground.rotation.x = -Math.PI / 2;
    this.grid.position.y = 0.02;
    this.add(this.ground, this.grid);
  }

  dispose(): void {
    this.removeFromParent();
    this.ground.geometry.dispose();
    this.ground.material.dispose();
    this.grid.dispose();
  }
}
