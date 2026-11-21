# Comprehensive Dependency & Conflict Report

This report audits all runtime, development, and system dependencies across the four repositories and evaluates potential conflicts within the target MMORPG environment.

---

## 1. Python Dependency Matrix (Agent Tooling)

| Package | Source Repository | Required Version | Target Environment Version | Conflict Status | Notes |
|---|---|---|---|---|---|
| **Python** | All Tools | 3.9+ / 3.10+ | **Python 3.11** | None | Fully backward and forward compatible. |
| **numpy** | `agent-sprite-forge` | `>=1.26` | `1.26.4` | None | Matrix math and pixel mask processing. |
| **Pillow** | `agent-sprite-forge` | `>=10.1` | `10.3.0` | None | Image I/O and alpha channel processing. |
| **scipy** | `agent-sprite-forge` | `>=1.11` | `1.12.0` | None | Distance transform for matte extraction. |
| **fastapi** | `agent-game-studio` | `>=0.115.0` | `0.115.4` | None | Studio dashboard web server. |
| **uvicorn** | `agent-game-studio` | `>=0.30.0` | `0.32.0` | None | ASGI web server. |
| **pydantic** | `agent-game-studio` | `>=2.9.0` | `2.9.2` | None | Strict JSON schema validation. |
| **pyyaml** | `agent-game-studio` | `>=6.0.2` | `6.0.2` | None | Task definition parsing. |
| **httpx** | `agent-game-studio` | `>=0.28.0` | `0.28.1` | None | Async HTTP client for AI adapters. |
| **pytest** | `agent-game-studio` / `sprite-forge` | `>=8.3.0` | `8.3.3` | None | Automated unit testing. |
| **pytest-asyncio**| `agent-game-studio` | `>=0.24.0` | `0.24.0` | None | Async test runner. |

> [!NOTE]
> `ui-ux-pro-max-skill` uses only Python standard library modules (`csv`, `json`, `argparse`, `math`, `re`, `pathlib`). It introduces zero third-party pip dependencies.

---

## 2. Rust Server Dependencies

| Crate | Source / Purpose | Version | Safety / Status |
|---|---|---|---|
| `tokio` | Async runtime & 20 TPS loop | `1.40` (full) | Production standard |
| `axum` | HTTP & WebSocket server | `0.8` (ws) | High performance |
| `tower-http` | CORS & compression | `0.6` | Official Tower middleware |
| `serde` & `serde_json` | Opcode serialization | `1.0` | Zero-copy deserialization |
| `dashmap` | Thread-safe concurrent state | `6.0` | Lock-free concurrent hash map |
| `noise` | Procedural Perlin noise biomes | `0.9` | Procedural generation |
| `sqlx` | PostgreSQL async driver | `0.8` (postgres, runtime-tokio) | Added for persistence layer |
| `redis` | Redis session & pub/sub | `0.27` (tokio-comp) | Added for distributed caching |
| `bincode` | Binary packet serialization | `1.3` | Low-latency binary packets |
| `uuid` | Entity and session IDs | `1.10` (v4, serde) | Standard UUID generator |
| `tracing` | Structured logging | `0.1` | High-throughput logging |

---

## 3. Web Client Dependencies (Node.js / npm)

| Package | Source / Purpose | Target Version | Status |
|---|---|---|---|
| `three` | 3D WebGL isometric engine | `^0.170.0` | Core rendering engine |
| `@types/three` | TypeScript definitions for Three.js| `^0.170.0` | Type checking |
| `next` | React server & web portal | `^15.0.0` | Web framework & routes |
| `react` & `react-dom`| DOM UI / HUD rendering | `^19.0.0` | HUD component tree |
| `tailwindcss` | Utility CSS for HUD and menus | `^4.0.0` | Theming and styling |
| `vite` | Ultra-fast client bundler | `^8.0.0` | Client bundling |
| `typescript` | Static type safety | `^5.6.0` | Language compiler |

> [!WARNING]
> `realmforge` client originally uses `phaser` (^3.90.0) and `preact` (^10.29.1). To meet the project requirements (**Three.js** + **TypeScript** + **Next.js**), `phaser` will be excluded from the client build and replaced with the Three.js viewport.

---

## 4. System Binaries & Network Port Allocations

### 4.1. External System Binaries
- **FFmpeg (`ffmpeg`):** Required on host PATH for `agent-sprite-forge` video-to-frame splitting.
- **Blender (3.6+ LTS / 4.x):** Required for 3D character modeling, rigging, and GLB export.

### 4.2. Port Map
| Service | Default Port | Protocol | Purpose |
|---|---|---|---|
| **Authoritative Game Server** | `8080` | WebSocket / TCP | Real-time game loop & network packets |
| **Web Client Dev Server** | `3000` | HTTP | Next.js / Vite web application |
| **Agent Studio Dashboard** | `8000` | HTTP / WebSocket | Multi-agent DAG & task monitor (Localhost only) |
| **PostgreSQL Database** | `5432` | TCP | Durable player accounts, inventories, guilds |
| **Redis Cache** | `6379` | TCP | Session state & cross-node message broker |
