# Skill & Capability Matrix: 4-Repository Cross-Evaluation

This document provides a comprehensive cross-evaluation of the four inspected repositories, categorizing their capabilities, integration feasibility, and application to the independent Web MMORPG project.

---

## 1. High-Level Classification Matrix

| Repository | Primary Category | Verified State | Installation Viability | Primary Upstream License | Target MMORPG Subsystem |
|---|---|---|---|---|---|
| **nextlevelbuilder/ui-ux-pro-max-skill** | AI Agent Skill / Design Intelligence | v2.15.0 (Active) | Direct Skill Installation (`skill.json`, `.claude/skills`) | MIT License | HUD, Menus, Modals, Admin Dashboard, Web Portal |
| **0x0funky/agent-sprite-forge** | Asset Pipeline & Generator | v0.6.0 (Active) | Pipeline Tooling (`skills/`, `requirements.txt`) | MIT License | 2D Icons, VFX Flipbooks, Billboard Sprites, Decals |
| **NhanHoang09vt/agent-game-studio** | Multi-Agent Orchestration Platform | 21 passing tests (Active) | Standalone Studio Service (`studio.py`, `dashboard/`) | MIT License | Game Architecture, Balance Modeling, Multi-Model Review |
| **mattiaa95/realmforge** | Full-Stack Engine & MMORPG Blueprint | v0.1.0 (Active) | Codebase Reusable Library & Subsystem Scaffold | MIT License (Assets CC0 1.0) | Authoritative Rust Server, Spatial Hash, Network Protocol |

---

## 2. Granular Capability Breakdown

### 2.1. Knowledge, Skills, Scripts, and Templates

| Repository | 1. Knowledge to Learn | 2. Skills to Install | 3. Scripts to Reuse | 4. Tools to Integrate | 5. Templates to Reuse | 6. Dependencies to Install | 7. Features Needing Adaptation |
|---|---|---|---|---|---|---|---|
| **ui-ux-pro-max-skill** | - 194 UI reasoning rules<br>- 130 UX heuristics<br>- 80 aesthetic styles<br>- WCAG contrast math | `ui-ux-pro-max` (Native Antigravity & Codex skill) | `src/ui-ux-pro-max/scripts/search.py`<br>`src/ui-ux-pro-max/scripts/core.py` | CLI BM25 Search Engine (`--domain`, `--stack`, `--tokens`) | `design-system/<slug>/MASTER.md` specification template | Python 3.9+ standard library (Zero pip dependencies) | Tailor design dials (`--density 8`, `--variance 4`) for anime MMORPG aesthetic |
| **agent-sprite-forge** | - Master Still -> I2V paradigm<br>- Cycle loop detection<br>- Soft-matte keying<br>- Frame bounding box scaling | `generate2dsprite`<br>`video2dsprite`<br>`generate2dmap`<br>`generate2dmedia` | `master_still.py`<br>`sprite_set.py`<br>`sheet_qc.py`<br>`scale_frames.py`<br>`route_media.py` | Frame slicer, contact sheet generator, pixel-look quantizer | JSON sprite metadata schemas (frame bounds, pivots, durations) | `numpy>=1.26`<br>`Pillow>=10.1`<br>`scipy>=1.11`<br>`ffmpeg` | Re-target export from Godot 4 to Three.js Texture Atlas & Shader UV mappings |
| **agent-game-studio** | - 4-Tier Memory model<br>- Multi-agent DAG execution<br>- Peer consensus review matrix<br>- Concurrency mutex locking | Multi-agent studio orchestration skills | `core/orchestration.py`<br>`core/memory.py`<br>`core/locks.py`<br>`providers/*_adapter.py` | FastAPI Dashboard (port 8000), DAG scheduler, Provider health monitor | `task.yaml` task templates, agent role definitions | `fastapi>=0.115`<br>`uvicorn>=0.30`<br>`pydantic>=2.9`<br>`pyyaml>=6.0`<br>`httpx>=0.28` | Replace Godot/Unity game prompts with Three.js / Rust Tokio MMORPG prompts |
| **realmforge** | - 20 TPS game loop<br>- 16x16 spatial hash partitioning<br>- Authoritative auto-attack<br>- Packet opcode protocol | N/A (Full application / architecture reference) | `server/src/main.rs`<br>`server/src/world.rs`<br>`server/src/enemy.rs`<br>`server/src/protocol.rs` | WebSocket packet dispatcher, chunk generator, interest manager | `shared/constants/balance.json` progression & combat curves | `tokio 1.x`<br>`axum 0.8`<br>`serde 1.x`<br>`dashmap 6.x`<br>`noise 0.9` | 1. Port client rendering from Phaser 2D to Three.js 3D isometric<br>2. Add PostgreSQL & Redis persistence |

---

## 3. MMORPG Subsystem Allocation Matrix

| MMORPG Subsystem | Primary Repository Contributor | Secondary Contributor | Role in Target MMORPG |
|---|---|---|---|
| **HUD, HP/MP, Skill Bars, Menus** | `ui-ux-pro-max-skill` | `realmforge` (Preact component logic) | Generate accessible, high-density anime-styled UI tokens and CSS/Tailwind layouts |
| **Inventory, Equipment, Tooltips** | `ui-ux-pro-max-skill` | `realmforge` | Design token generation for rarity borders + backend item slot protocol (`MSG_EQUIP_ITEM`) |
| **2D Icons & Visual Effects** | `agent-sprite-forge` | N/A | Generate skill icons, buff/debuff badges, ground spell decals, and particle flipbooks |
| **3D Character & Monster Models** | *Independent Blender Pipeline* | N/A | Characters and major bosses remain rigged 3D GLB/glTF models loaded via Three.js GLTFLoader |
| **Game Server & Game Loop** | `realmforge` | `agent-game-studio` | 20 TPS Tokio loop, 16x16 spatial grid broadcast, authoritative movement and combat checks |
| **Combat & Balance Calculations** | `realmforge` (`balance.json`) | `agent-game-studio` (Economy Lead agent) | Mathematical curves for Level 1-60 XP, stat allocation, damage formulas, and enemy tiers |
| **World Generation & Biomes** | `realmforge` (`world.rs`) | `agent-sprite-forge` (Map tile keying) | Server-side Perlin noise biome generation streamed to client via chunk requests (`MSG_REQUEST_CHUNK`) |
| **Database Persistence (PostgreSQL/Redis)**| *Custom Rust Architecture* | `agent-game-studio` (Systems Architect audit) | Replace in-memory DashMap with transactional PostgreSQL storage and Redis pub/sub |
| **AI Agent Governance & Verification** | `agent-game-studio` | `ui-ux-pro-max-skill` + `agent-sprite-forge` | Dual-agent workflow (Antigravity implementation + Codex review) via consensus engine |
