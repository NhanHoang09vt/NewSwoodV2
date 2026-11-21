const gameKeys = new Set(['KeyW', 'KeyA', 'KeyS', 'KeyD', 'Space']);

export class InputManager {
  private readonly pressed = new Set<string>();
  private attackQueued = false;

  constructor() {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('blur', this.clear);
    document.addEventListener('visibilitychange', this.clear);
  }

  isDown(code: string): boolean {
    return this.pressed.has(code);
  }

  consumeAttack(): boolean {
    const queued = this.attackQueued;
    this.attackQueued = false;
    return queued;
  }

  readonly clear = (): void => {
    this.pressed.clear();
    this.attackQueued = false;
  };

  dispose(): void {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('blur', this.clear);
    document.removeEventListener('visibilitychange', this.clear);
    this.clear();
  }

  private readonly onKeyDown = (event: KeyboardEvent): void => {
    if (!gameKeys.has(event.code) || event.target instanceof HTMLButtonElement ||
        event.ctrlKey || event.metaKey || event.altKey) return;

    event.preventDefault();
    this.pressed.add(event.code);
    if (event.code === 'Space' && !event.repeat) this.attackQueued = true;
  };

  private readonly onKeyUp = (event: KeyboardEvent): void => {
    this.pressed.delete(event.code);
  };
}
