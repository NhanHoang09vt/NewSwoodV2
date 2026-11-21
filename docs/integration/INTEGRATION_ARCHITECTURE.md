# Unified Integration Architecture: Web MMORPG

This document defines the modular integration architecture that unifies the four inspected repositories into the new Web MMORPG codebase.

---

## 1. High-Level System Architecture

```mermaid
flowchart TB
    subgraph AI_Development["AI Agent Development & Governance Layer"]
        AG[Google Antigravity - Lead Agent]
        CX[OpenAI Codex - Review Agent]
        GS[Agent Game Studio - DAG & Consensus Arbiter]
        AG <--> GS
        CX <--> GS
    end

    subgraph Tooling_Pipelines["Asset & Design Intelligence Pipelines"]
        UI_Tool["UI/UX Pro Max - BM25 Design Engine"]
        SP_Tool["Agent Sprite Forge - 2D Icon & VFX Pipeline"]
        Blender_Pipe["Blender Pipeline - Rigged 3D GLB Characters"]
    end

    subgraph Game_Server["Authoritative Rust Server (Tokio + Axum)"]
        WS_Route["Axum WebSocket Endpoint (/ws)"]
        GameLoop["20 TPS Game Loop (50ms Interval)"]
        SpatialGrid["16x16 Spatial Hash Grid"]
        CombatEngine["Combat & Auto-Attack Validator"]
        DB_Layer["PostgreSQL (sqlx) + Redis Cache"]
        
        WS_Route --> GameLoop
        GameLoop --> SpatialGrid
        GameLoop --> CombatEngine
        CombatEngine --> DB_Layer
    end

    subgraph Web_Client["Web Client (Next.js + Three.js + Vite)"]
        DOM_UI["React/Next.js/Tailwind HUD & Menus (UI/UX Pro Max)"]
        ThreeCanvas["Three.js WebGL Canvas (Orthographic Isometric)"]
        EntityMgr["Entity Manager (3D GLBs + 2D Billboard VFX)"]
        WS_Client["WebSocket Network Client (Opcode Dispatcher)"]
        
        DOM_UI --> WS_Client
        ThreeCanvas --> EntityMgr
        WS_Client --> EntityMgr
    end

    AI_Development -->|Generates UI Specs| UI_Tool
    AI_Development -->|Generates Icons & VFX| SP_Tool
    AI_Development -->|Audits Code & Systems| Game_Server
    
    UI_Tool -->|CSS Tokens & Layouts| DOM_UI
    SP_Tool -->|Sprite Atlases & UV JSON| EntityMgr
    Blender_Pipe -->|GLB Animated Meshes| EntityMgr
    
    WS_Client <===>|WebSocket (Opcodes 1-34)| WS_Route
```

---

## 2. Workspace Directory Layout

The workspace preserves clean modular separation between upstream research, agent skills, pipeline tools, documentation, and the actual game source tree:

```
d:/Build/Swood/
├── client/                     # MMORPG Web Client (Three.js + Next.js + Tailwind)
│   ├── public/
│   │   ├── assets/
│   │   │   ├── models/         # Rigged 3D character & monster GLBs
│   │   │   ├── sprites/        # 2D icons, spell decals, particle atlases
│   │   │   └── textures/       # Terrain & environment textures
│   ├── src/
│   │   ├── components/         # DOM UI / HUD components (Tailwind CSS)
│   │   ├── engine/             # Three.js scene, camera, render loop
│   │   ├── entities/           # 3D player mesh & 2D billboard renderers
│   │   └── net/                # WebSocket opcode dispatcher
│   └── package.json
├── server/                     # Authoritative MMORPG Server (Rust)
│   ├── src/
│   │   ├── main.rs             # Axum WS router, socket lifecycle, 20 TPS loop
│   │   ├── protocol.rs         # Typed message opcodes (MSG_AUTH ... MSG_AUCTION)
│   │   ├── spatial.rs          # 16x16 spatial hash grid partitioning
│   │   ├── combat.rs           # Combat formulas, cooldowns, hit validation
│   │   ├── db.rs               # PostgreSQL connection pool & migrations
│   │   └── cache.rs            # Redis session & pub/sub manager
│   └── Cargo.toml
├── shared/                     # Shared Data & Protocols
│   ├── constants/
│   │   └── balance.json        # Unified balance curves, stats, enemy tiers
│   └── schemas/                # JSON / Bincode packet schemas
├── tools/                      # Integrated Agent Tooling & Pipelines
│   ├── agent-skills/
│   │   ├── ui-ux-pro-max/      # Integrated Skill 1 (Search scripts & data)
│   │   ├── sprite-forge/       # Integrated Skill 2 (Icon/VFX scripts & tools)
│   │   ├── game-studio/        # Integrated Skill 3 (DAG & memory modules)
│   │   └── realmforge-tools/   # Integrated Skill 4 (Protocol reference & tests)
│   └── github-research/        # Clean upstream repositories (isolated)
└── docs/                       # Comprehensive System Documentation
    ├── research/               # Deep technical analysis files
    ├── skills/                 # Capability matrix & activation rules
    ├── integration/            # Architecture, security, dependencies, validation
    └── workflows/              # Standard operating procedures
```

---

## 3. Subsystem Integration Specifications

### 3.1. Integration: `ui-ux-pro-max`
- **Source Repository:** `nextlevelbuilder/ui-ux-pro-max-skill`
- **Integration Destination:** `tools/agent-skills/ui-ux-pro-max/`
- **Required Files:**
  - `src/ui-ux-pro-max/scripts/search.py`
  - `src/ui-ux-pro-max/scripts/core.py`
  - `src/ui-ux-pro-max/data/*.csv`
  - `src/ui-ux-pro-max/data/stacks/threejs.csv`
- **Required Dependencies:** Python 3.9+ (Standard Library only).
- **Execution Command:**
  ```bash
  python tools/agent-skills/ui-ux-pro-max/scripts/search.py "MMORPG HUD dark anime" --domain style --stack threejs
  ```
- **Input/Output Contract:**
  - Input: Search query string + domain and stack flags.
  - Output: Formatted markdown design specs, CSS custom properties, and Tailwind theme extensions.
- **Rollback Procedure:** Delete `tools/agent-skills/ui-ux-pro-max/` directory. No impact on game engine.

---

### 3.2. Integration: `agent-sprite-forge`
- **Source Repository:** `0x0funky/agent-sprite-forge`
- **Integration Destination:** `tools/agent-skills/sprite-forge/`
- **Required Files:**
  - `skills/generate2dsprite/scripts/master_still.py`
  - `skills/generate2dsprite/scripts/scale_frames.py`
  - `skills/generate2dsprite/scripts/sheet_qc.py`
  - `skills/video2dsprite/scripts/sprite_set.py`
  - `skills/generate2dmedia/scripts/route_media.py`
- **Custom Adapter Required:** `export_threejs.py` (converts Aseprite/Godot frame JSON to Three.js texture UV coordinates).
- **Required Dependencies:** Python 3.10+, `numpy>=1.26`, `Pillow>=10.1`, `scipy>=1.11`, `ffmpeg`.
- **Execution Command:**
  ```bash
  python tools/agent-skills/sprite-forge/scripts/master_still.py prompt --spec "Fantasy Fireball Spell Icon 64x64"
  ```
- **Input/Output Contract:**
  - Input: Semantic text specification.
  - Output: 64x64 transparent PNG icons and packed sprite sheets written to `client/public/assets/sprites/`.
- **Rollback Procedure:** Remove `tools/agent-skills/sprite-forge/`.

---

### 3.3. Integration: `agent-game-studio`
- **Source Repository:** `NhanHoang09vt/agent-game-studio`
- **Integration Destination:** `tools/agent-skills/game-studio/`
- **Required Files:**
  - `core/orchestration.py`
  - `core/memory.py`
  - `core/locks.py`
  - `providers/gemini_adapter.py`
  - `providers/openai_adapter.py`
  - `studio.py`
- **Required Dependencies:** Python 3.10+, `fastapi`, `uvicorn`, `pydantic`, `pyyaml`, `httpx`.
- **Execution Command:**
  ```bash
  python tools/agent-skills/game-studio/studio.py providers
  ```
- **Input/Output Contract:**
  - Input: Task definition YAML (`task.yaml`).
  - Output: Multi-agent execution DAG and peer review consensus score.
- **Rollback Procedure:** Delete `tools/agent-skills/game-studio/`.

---

### 3.4. Integration: `realmforge`
- **Source Repository:** `mattiaa95/realmforge`
- **Integration Destination:** Scaffolding adapted directly into `server/` and `shared/`
- **Required Files / Architectural Modules:**
  - `server/src/main.rs` (Adapted for Axum 0.8 WS router & 20 TPS Tokio loop)
  - `server/src/protocol.rs` (Opcode registry MSG_AUTH through MSG_AUCTION)
  - `server/src/world.rs` (16x16 spatial hash grid)
  - `server/src/enemy.rs` (Aggro & AI state machine)
  - `shared/constants/balance.json` (Level 1-60 math, combat curves)
- **Required Dependencies:** Rust 1.75+, Tokio, Axum, Tower-HTTP, Serde, DashMap, Noise, SQLx, Redis-rs.
- **Client Adaptation:**
  - Discard Phaser 2D canvas pipeline.
  - Retain Preact signals / Tailwind CSS HUD structure.
  - Connect WebSocket network listener to Three.js entity manager.
- **Rollback Procedure:** Revert git commits in `server/` or `shared/`.
