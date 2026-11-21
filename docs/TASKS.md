## T1 [BLOCKER] Khởi tạo cấu trúc thư mục và file cấu hình TypeScript + Vite
- File: `package.json`, `tsconfig.json`, `index.html`
- Việc cần làm:
  1. Tạo `package.json` với dependency `three`, `@types/three`, `vite`, `typescript`.
  2. Cấu hình `tsconfig.json` bật `"strict": true`, `"target": "ES2022"`, `"moduleResolution": "bundler"`.
  3. Tạo `index.html` chứa `<canvas id="game-canvas"></canvas>` và thẻ `<script type="module" src="/src/main.ts"></script>`.
- Vì sao: Thiết lập môi trường build chuẩn và ép kiểu chặt chẽ để tránh lỗi runtime ngầm trên Three.js.
- Không được: Dùng CDN link trực tiếp cho Three.js hoặc để `tsconfig.json` tắt `strict` mode.
- Kiểm chứng: Chạy `npm install && npm run build` thành công với 0 lỗi TypeScript.
- Sau: T2
- [ ] Xong

## T2 [BLOCKER] Tạo lõi vòng lặp game (GameLoop) và quản lý tài nguyên (Dispose)
- File: `src/core/Engine.ts`
- Việc cần làm:
  1. Tạo class `Engine` khởi tạo `THREE.WebGLRenderer`, `THREE.Scene`, `THREE.PerspectiveCamera` và gắn vào `#game-canvas`.
  2. Viết hàm `start()` dùng `requestAnimationFrame` tính `deltaTime` (giới hạn `Math.min(delta, 0.1)` để tránh nhảy xuyên vật thể khi đổi tab).
  3. Tạo hàm `dispose()` hủy listener `resize` và giải phóng `renderer.dispose()`.
- Vì sao: Đảm bảo tốc độ di chuyển/vật lý độc lập với tần số quét màn hình (FPS) và chống rò rỉ bộ nhớ WebGL.
- Không được: Hardcode kích thước canvas cố định (phải lắng nghe `window.resize`) hoặc không kẹp trần `deltaTime`.
- Kiểm chứng: Mở trình duyệt thấy màn hình nền màu xanh tối (`0x1a1a2e`), thu phóng cửa sổ trình duyệt thì khung hình tự co giãn không méo tỷ lệ.
- Sau: T3, T4
- [ ] Xong

## T3 [BLOCKER] Xây dựng hệ thống Input và điều khiển nhân vật cục bộ (LocalPlayer)
- File: `src/entities/Player.ts`, `src/core/InputManager.ts`
- Việc cần làm:
  1. Tạo `InputManager` lưu trạng thái phím nhấn bằng `Set<string>` (`KeyW`, `KeyA`, `KeyS`, `KeyD`).
  2. Tạo class `Player` kế thừa hoặc bọc `THREE.Group` với mesh đại diện (BoxGeometry 1x2x1), thuộc tính `speed = 6`, `hp = 100`, `maxHp = 100`.
  3. Viết hàm `update(delta: number, input: InputManager)` chuẩn hóa vector di chuyển (`vector.normalize()`) trước khi nhân `speed * delta`.
- Vì sao: Chuẩn hóa vector giúp nhân vật không chạy nhanh hơn gấp $\sqrt{2}$ lần khi bấm chéo (W+D).
- Không được: Đặt logic đọc sự kiện `keydown` trực tiếp bên trong `Player.update()`.
- Kiểm chứng: Nhấn WASD nhân vật di chuyển mượt theo 8 hướng với tốc độ đồng nhất 6 đơn vị/giây.
- Sau: T5
- [ ] Xong

## T4 [BLOCKER] Tạo mặt đất lưới (Terrain Grid) và Camera góc nhìn thứ 3 bám theo nhân vật
- File: `src/world/WorldMap.ts`, `src/core/FollowCamera.ts`
- Việc cần làm:
  1. Trong `WorldMap.ts`, tạo mặt phẳng `PlaneGeometry(100, 100)` kèm `THREE.GridHelper(100, 50)` để dễ định vị không gian.
  2. Trong `FollowCamera.ts`, tạo offset cố định `new THREE.Vector3(0, 12, 14)` và dùng `camera.position.lerp(targetPos, 1 - Math.exp(-8 * delta))` để bám mượt theo `Player`.
  3. Gọi `camera.lookAt(player.position)` ở cuối mỗi frame.
- Vì sao: Dùng hàm mũ độc lập FPS cho `lerp` giúp camera bám nhân vật mượt mà trên mọi thiết bị.
- Không được: Đặt camera làm con trực tiếp (`player.add(camera)`) vì camera sẽ bị xoay lắc theo hướng nhân vật.
- Kiểm chứng: Di chuyển nhân vật ra mép lưới, camera trượt theo mượt mà và luôn giữ nhân vật ở tâm màn hình.
- Sau: T5
- [ ] Xong

## T5 [MAJOR] Tạo thực thể Quái vật (Mob) và hệ thống va chạm/tấn công cận chiến cơ bản
- File: `src/entities/Mob.ts`, `src/systems/CombatSystem.ts`
- Việc cần làm:
  1. Tạo class `Mob` có `id: string`, `hp: number`, `position: THREE.Vector3`, `isDead: boolean` và mesh màu đỏ (`0xe74c3c`).
  2. Trong `CombatSystem.ts`, viết hàm `performMeleeAttack(attacker: Player, mobs: Mob[], range = 2.5, damage = 35)` kiểm tra khoảng cách `distanceTo`.
  3. Khi `mob.hp <= 0`, đặt `mob.isDead = true`, ẩn mesh và xóa khỏi danh sách active.
- Vì sao: Tách biệt logic tính sát thương vào `CombatSystem` để sau này dễ đồng bộ với server MMORPG.
- Không được: Xóa phần tử khỏi mảng `mobs` bằng `splice` ngay trong vòng lặp `for...of` đang duyệt chính mảng đó.
- Kiểm chứng: Đứng cách quái dưới 2.5m và bấm phím `Space` 3 lần, quái mất 100 HP và biến mất khỏi scene.
- Sau: T6
- [ ] Xong

## T6 [MAJOR] Tạo lớp trừu tượng mạng (NetworkAdapter) chuẩn bị cho đồng bộ MMORPG
- File: `src/network/NetworkAdapter.ts`
- Việc cần làm:
  1. Định nghĩa interface `PlayerStatePacket { id: string; x: number; y: number; z: number; rotY: number; hp: number }`.
  2. Tạo class `MockNetworkAdapter` giả lập độ trễ 50ms (`setTimeout`) phát lại trạng thái của 1 bot mẫu di chuyển vòng tròn để test render người chơi khác.
  3. Tạo map `remotePlayers: Map<string, Player>` trong `Engine` để cập nhật vị trí từ packet nhận được.
- Vì sao: Cô lập tầng mạng ngay từ đầu giúp chuyển sang WebSocket/Colyseus sau này mà không phải sửa code gameplay.
- Không được: Đưa trực tiếp `THREE.Vector3` hay object của Three.js vào gói tin mạng (`PlayerStatePacket`).
- Kiểm chứng: Chạy game thấy xuất hiện thêm 1 nhân vật màu xanh lá tự động chạy vòng tròn mượt mà trên bản đồ.
- Sau: T7
- [ ] Xong

## T7 [MINOR] Hiển thị HUD tối giản (Thanh máu & Tọa độ) bằng HTML/CSS Overlay
- File: `src/ui/HudOverlay.ts`, `index.html`
- Việc cần làm:
  1. Thêm thẻ `<div id="hud">` phủ lên canvas với `pointer-events: none`.
  2. Viết hàm `updateHud(hp: number, maxHp: number, pos: THREE.Vector3)` chỉ cập nhật DOM khi giá trị thực sự thay đổi (dirty check).
- Vì sao: Tránh thao tác DOM mỗi frame (60 lần/giây) gây tụt FPS và chặn sự kiện chuột vào canvas.
- Không được: Dùng `innerHTML` liên tục trong vòng lặp `requestAnimationFrame` hoặc tạo text 3D nặng nề cho HUD cơ bản.
- Kiểm chứng: Góc trái trên hiển thị `HP: 100/100` và tọa độ `X, Z` cập nhật chính xác khi nhân vật bước đi.
- Sau: Không
- [ ] Xong

## Định hướng tiếp theo
1. B
