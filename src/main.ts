import { Engine } from './core/Engine';
import { MockNetworkAdapter } from './network/NetworkAdapter';
import './style.css';

const canvas = document.querySelector<HTMLCanvasElement>('#game-canvas')!;
const errorMessage = document.getElementById('error')!;

try {
  const engine = new Engine(canvas, new MockNetworkAdapter());
  engine.start();

  window.addEventListener('pagehide', (event) => {
    if (event.persisted) return;
    engine.dispose();
  });

  if (import.meta.hot) import.meta.hot.dispose(() => engine.dispose());
} catch (error) {
  console.error(error);
  errorMessage.textContent = 'Không thể khởi tạo bản đồ 3D. Hãy thử mở game trên trình duyệt hỗ trợ WebGL 2.';
  errorMessage.hidden = false;
}
