import type { Vector3 } from 'three';

export class HudOverlay {
  private readonly healthText = document.getElementById('health-text')!;
  private readonly healthBar = document.querySelector<HTMLProgressElement>('#health-bar')!;
  private readonly coordinates = document.getElementById('position')!;
  private readonly objective = document.getElementById('mob-count')!;
  private readonly restart = document.querySelector<HTMLButtonElement>('#restart')!;

  constructor(private readonly onRestart: () => void) {
    this.restart.addEventListener('click', this.onRestart);
  }

  update(hp: number, maxHp: number, position: Vector3): void {
    const health = `HP ${hp}/${maxHp}`;
    if (this.healthText.textContent !== health) {
      this.healthText.textContent = health;
      this.healthBar.max = maxHp;
      this.healthBar.value = hp;
    }

    const x = Math.round(position.x * 10) / 10;
    const z = Math.round(position.z * 10) / 10;
    const coordinates = `X ${x.toFixed(1)} · Z ${z.toFixed(1)}`;
    if (this.coordinates.textContent !== coordinates) this.coordinates.textContent = coordinates;
  }

  setRemaining(remaining: number, total: number): void {
    this.objective.textContent = remaining > 0
      ? `Quái còn lại ${remaining}/${total}`
      : 'Đã hạ hết quái!';
    this.restart.hidden = remaining !== 0;
  }

  dispose(): void {
    this.restart.removeEventListener('click', this.onRestart);
  }
}
