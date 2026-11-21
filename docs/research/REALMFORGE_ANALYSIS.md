# Deep Technical Analysis: RealmForge
**Repository:** [mattiaa95/realmforge](https://github.com/mattiaa95/realmforge)  
**License:** MIT License (Kenney Game Assets: CC0 1.0)  
**Language Breakdown:** Rust 49.9%, TypeScript 49.5%, Other 0.6%  
**Primary Class:** Full-Stack Game Engine & Browser MMORPG Reference Implementation

---

## 1. Executive Summary & Purpose

`realmforge` is an open-source, full-stack browser-based isometric MMORPG. It implements an authoritative, high-performance server in **Rust** (leveraging **Tokio**, **Axum**, and **DashMap**) paired with a modular TypeScript web client (Preact, Tailwind CSS, Vite) running over **WebSocket**.

It provides a battle-tested blueprint for real-time MMO networking, spatial partitioning (16x16 tile spatial hash grid), tick-based game loops (20 TPS), procedural Perlin-noise world generation (8 biomes), combat calculation, auto-attack logic, and player progression systems.

---

## 2. Architecture & Main Components

```
realmforge/
├── client/                     # Web Frontend
│   ├── src/                    # TypeScript client source code
│   │   ├── components/         # Preact UI components (HUD, Chat, Inventory)
│   │   ├── game/               # Game scenes & isometric rendering pipeline
│   │   ├── net/                # WebSocket client & packet deserializer
│   │   └── state/              # Preact signals reactive state store
│   ├── package.json            # Client dependencies (Vite 8, Tailwind 4, TS 6)
│   └── vite.config.ts          # Vite build configuration
├── server/                     # Authoritative Rust Backend
│   ├── Cargo.toml              # Rust 2024 dependencies (Tokio 1, Axum 0.8)
│   └── src/
│       ├── main.rs             # Axum WS router, socket lifecycle, 20 TPS loop
│       ├── protocol.rs         # Binary / JSON opcode definitions (1 to 34)
│       ├── world.rs            # Spatial hash grid, chunk noise generation
│       └── enemy.rs            # AI state machine, pack aggro, loot tables
├── shared/                     # Shared protocol & design data
│   └── constants/
│       └── balance.json        # Unified balance curves, stats, enemy tiers
├── Makefile                    # Unified build & launch scripts
├── LICENSE                     # MIT License
└── README.md                   # Architecture diagrams & quickstart
```

---

## 3. Verified Technical Implementation

### 3.1. Server Architecture (`server/src/main.rs`)
- **Web Framework:** `axum = "0.8"` with WebSocket upgrade handlers (`/ws`).
- **Asynchronous Runtime:** `tokio = { version = "1", features = ["full"] }`.
- **State Storage:** Concurrent lock-free memory via `dashmap = "6"` (`AppState.players`, `AppState.enemies`, `AppState.senders`).
- **Game Loop Execution:**
  ```rust
  tokio::spawn(async move {
      game_loop(game_state).await;
  });
  ```
  Runs at 20 ticks per second (50ms interval). Every tick updates player positions, evaluates enemy pathfinding, applies damage ticks, and flushes dirty entity buffers.
- **Spatial Hash Grid:** Entities are hashed into 16x16 coordinate cells (`spatial_key = (x >> 4, y >> 4)`). Broadcasts are restricted to `nearby_cells` (a 3x3 cell neighborhood around the player), reducing bandwidth consumption from $O(N^2)$ to $O(N)$ localized message distribution.

### 3.2. Network Protocol & Opcode Registry (`server/src/protocol.rs`)
The WebSocket message dispatcher operates on typed opcode constants:
- `MSG_AUTH = 1`: Client login and token handshake.
- `MSG_MOVE = 2`: Path movement vectors and position synchronizations.
- `MSG_CHAT = 3`: Multi-channel chat messages (Local, Global, Party, Guild).
- `MSG_ATTACK = 4`: Basic physical / auto-attack triggers.
- `MSG_PICKUP_ITEM = 5` / `MSG_USE_ITEM = 6`: Ground loot and inventory consumption.
- `MSG_EQUIP_ITEM = 7` / `MSG_UNEQUIP_ITEM = 8`: Equipment slot modification.
- `MSG_BANK_DEPOSIT = 9` / `MSG_BANK_WITHDRAW = 10`: Secure vault banking.
- `MSG_ATTACK_PLAYER = 11`: PvP flagged combat engagements.
- `MSG_REQUEST_CHUNK = 12`: Dynamic terrain chunk streaming.
- `MSG_ALLOCATE_STATS = 13` / `MSG_SELECT_CLASS = 14`: Progression and class specializations.
- `MSG_USE_SKILL = 15`: 6-slot active skill execution with cooldown validation.
- `MSG_PARTY_ACTION = 16` / `MSG_TRADE_ACTION = 18`: Cooperative party and direct player trading.
- `MSG_QUEST_ACCEPT = 20` / `MSG_QUEST_TURN_IN = 21`: Quest state transitions.
- `MSG_NPC_INTERACT = 23`: Dialogue trees and merchant interactions.
- `MSG_SKILL_TREE_UNLOCK = 24`: Talent tree branching.
- `MSG_GUILD_ACTION = 26`: Guild creation, ranking, and roster updates.
- `MSG_ENCHANT_ITEM = 27`: Equipment item reforging and upgrading.
- `MSG_FISHING_ACTION = 28` / `MSG_GATHER_ACTION = 32`: Gathering professions.
- `MSG_AUCTION_ACTION = 34`: Asynchronous player marketplace transactions.

### 3.3. Shared Balance Model (`shared/constants/balance.json`)
- **Progression Math:** Base XP 100, exponent 2.5, level cap 60.
- **Attributes per Level:** HP +12, MP +6, ATK +5, DEF +3, SPD +2, LCK +1.
- **Combat Mechanics:** Base crit chance 5%, attack cooldown 800ms, weapon reach 1.5 tiles.
- **Enemy Scaling:** Base HP 50, Base ATK 8, Base DEF 3, level scaling factor 0.15. 4 Tiers: Normal (1.0x), Champion (1.8x), Elite (3.2x), World Boss (10.0x).
- **Network Defaults:** Tick rate 20, view range 50 tiles, AI update frequency every 3 ticks (150ms).

---

## 4. Dependencies and Runtime Requirements

- **Server Dependencies:**
  - Rust 1.75+ (Rust 2024 edition compatible)
  - `tokio`, `axum`, `tower-http`, `serde`, `serde_json`, `uuid`, `noise`, `rand`, `dashmap`, `tracing`, `tracing-subscriber`, `tokio-tungstenite`, `bincode`.
- **Client Dependencies:**
  - Node.js 18+ (tested with Node 20/22)
  - `preact`, `@preact/signals`, `phaser` (to be adapted to Three.js), `@tailwindcss/vite`, `tailwindcss 4`, `vite 8`, `typescript 6`.

---

## 5. MMORPG Application Mapping & Adaptation Plan

The technical stack of `realmforge` directly mirrors our target architecture:
- **Rust + Tokio + Axum + WebSocket Backend:** 100% architectural match.
- **Differences & Required Adaptations:**

| RealmForge Reference | Our Target MMORPG | Adaptation Strategy |
|---|---|---|
| **Client Rendering:** Phaser 3 (2D Canvas) | **Three.js** (Hybrid 2D + 3D with orthographic isometric camera) | Replace Phaser canvas pipeline with Three.js scene manager, WebGL renderer, and GLB animation controller. Retain Preact/Tailwind HUD components. |
| **State Persistence:** In-Memory `DashMap` | **PostgreSQL + Redis** | Connect Tokio server to `sqlx` (PostgreSQL) for persistent player profiles, inventories, and guilds; use Redis for active session caching and cross-node pub/sub. |
| **World Representation:** 2D Tile Sprites | **3D Isometric Tile Grid + 3D Meshes** | Convert 2D tile coordinates $(x, y)$ into isometric 3D space $(X = (x - y) \times \frac{\sqrt{3}}{2}, Z = (x + y) \times 0.5)$. |
| **Networking:** JSON over WebSocket | **JSON / Binary (Bincode/Protobuf) over WebSocket** | Keep JSON during development for rapid debugging; switch high-frequency `MSG_MOVE` and `MSG_ATTACK` packets to binary serialization. |

---

## 6. Strengths, Weaknesses, and Limitations

### Strengths
- **Production-Ready Rust Networking:** Battle-tested Axum WebSocket handling with zero-copy packet routing and MPSC broadcast channels.
- **Complete MMO Game Mechanics:** Contains working implementations for banking, trading, party, guild, questing, and auction systems.
- **Efficient Spatial Partitioning:** 16x16 grid prevents server CPU exhaustion during high-density player events.

### Weaknesses & Limitations
- **Lacks Database Persistence:** Current implementation is memory-only; server restart wipes progress unless PostgreSQL backing is integrated.
- **Client is Pure 2D:** Uses Phaser 3 rather than Three.js 3D viewport.

---

## 7. License & Security Considerations

- **License:** MIT License for all source code. CC0 1.0 for Kenney game assets. Full commercial reuse permitted.
- **Security:**
  - Authoritative server architecture: Client position and combat damage are validated on the server.
  - Rate limiting required on WebSocket packet influx to prevent DoS attacks.
  - Strict input sanitization on chat and character naming to prevent injection.
