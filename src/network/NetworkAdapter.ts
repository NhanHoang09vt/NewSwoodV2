export interface PlayerStatePacket {
  id: string;
  x: number;
  y: number;
  z: number;
  rotY: number;
  hp: number;
}

export interface NetworkAdapter {
  start(onPlayerState: (packet: PlayerStatePacket) => void): void;
  stop(): void;
}

export class MockNetworkAdapter implements NetworkAdapter {
  private timer: number | undefined;

  start(onPlayerState: (packet: PlayerStatePacket) => void): void {
    this.stop();
    const start = performance.now();

    const send = (): void => {
      const elapsed = (performance.now() - start) / 1000;
      const angle = elapsed * 0.65;
      this.timer = window.setTimeout(send, 50);
      onPlayerState({
        id: 'training-bot',
        x: 7 + Math.cos(angle) * 3,
        y: 0,
        z: -4 + Math.sin(angle) * 3,
        rotY: -angle,
        hp: 100,
      });
    };

    this.timer = window.setTimeout(send, 50);
  }

  stop(): void {
    window.clearTimeout(this.timer);
    this.timer = undefined;
  }
}
