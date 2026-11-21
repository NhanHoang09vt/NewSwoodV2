# Antigravity Skill Registry & Registration Specifications

This document defines how external repository capabilities are registered as modular skills within Google Antigravity.

---

## 1. Antigravity Skill Architecture Standards

In Google Antigravity, a skill is a self-contained directory containing:
1. **`SKILL.md` (Mandatory):** Instruction file with YAML frontmatter defining `name` and `description`, followed by task execution rules.
2. **`scripts/` (Optional):** Executable scripts run by the agent via tools.
3. **`references/` / `data/` (Optional):** Supporting schemas, CSV tables, or configuration models.

### Directory Layout for Project Skills:
```
tools/agent-skills/
├── ui-ux-pro-max/
│   ├── SKILL.md
│   ├── scripts/
│   │   ├── search.py
│   │   └── core.py
│   └── data/
├── sprite-forge/
│   ├── SKILL.md
│   ├── scripts/
│   │   ├── master_still.py
│   │   ├── sprite_set.py
│   │   ├── scale_frames.py
│   │   └── export_threejs.py
│   └── requirements.txt
├── game-studio-orchestrator/
│   ├── SKILL.md
│   ├── core/
│   ├── providers/
│   └── studio.py
└── realmforge-engine/
    ├── SKILL.md
    └── references/
        ├── protocol_opcodes.json
        └── balance_curves.json
```

---

## 2. Skill Registration Specifications

### 2.1. Skill 1: `ui-ux-pro-max`
- **Location:** `tools/agent-skills/ui-ux-pro-max/`
- **Frontmatter:**
  ```yaml
  name: ui-ux-pro-max
  description: Design intelligence for Web MMORPG HUD, UI panels, typography, color palettes, and responsive layouts.
  ```
- **Primary Tool Invocation:**
  ```bash
  python tools/agent-skills/ui-ux-pro-max/scripts/search.py "<query>" --domain <domain> --stack <stack>
  ```
- **Supported Query Domains:** `style`, `color`, `typography`, `ux`, `chart`, `icons`, `gsap`, `threejs`.
- **Target Output:** Design tokens (CSS/Tailwind), accessible layout specifications, and `design-system/MASTER.md`.

### 2.2. Skill 2: `sprite-forge`
- **Location:** `tools/agent-skills/sprite-forge/`
- **Frontmatter:**
  ```yaml
  name: sprite-forge
  description: Pipeline for generating, alpha-keying, cycling, and packaging 2D MMORPG skill icons, VFX flipbooks, and billboard sprites.
  ```
- **Primary Tool Invocation:**
  ```bash
  python tools/agent-skills/sprite-forge/scripts/master_still.py prompt --spec "<icon/vfx spec>"
  python tools/agent-skills/sprite-forge/scripts/scale_frames.py --input <frames> --size 64x64
  python tools/agent-skills/sprite-forge/scripts/export_threejs.py --atlas <png> --meta <json>
  ```
- **Target Output:** Clean, keyed transparent PNGs, Three.js sprite sheets, and UV coordinate JSON.

### 2.3. Skill 3: `game-studio-orchestrator`
- **Location:** `tools/agent-skills/game-studio-orchestrator/`
- **Frontmatter:**
  ```yaml
  name: game-studio-orchestrator
  description: Multi-agent task orchestration, DAG scheduling, 4-tier memory management, and cross-model consensus verification.
  ```
- **Primary Tool Invocation:**
  ```bash
  python tools/agent-skills/game-studio-orchestrator/studio.py test
  python tools/agent-skills/game-studio-orchestrator/studio.py providers
  ```
- **Target Output:** Validated architecture specs, consensus audit reports, and multi-agent task execution plans.

### 2.4. Skill 4: `realmforge-engine`
- **Location:** `tools/agent-skills/realmforge-engine/`
- **Frontmatter:**
  ```yaml
  name: realmforge-engine
  description: Authoritative Rust MMORPG server patterns, 20 TPS game loop, 16x16 spatial hash partitioning, and WebSocket protocol definitions.
  ```
- **Reference Assets:**
  - `protocol_opcodes.json`: Typed message mappings (1-34).
  - `balance_curves.json`: Stat formulas, Level 1-60 XP progression, combat math.
- **Target Output:** Rust server systems, Axum WebSocket handlers, and Three.js client synchronization controllers.

---

## 3. Skill Activation & Isolation Protocol

To prevent context bloat and hallucination, Antigravity adheres to the following loading rules:
1. **Zero Global Preload:** Never load all four skills into active working memory simultaneously.
2. **Task-Specific Invocation:** Load a skill only when the prompt explicitly touches its domain (e.g., UI design triggers `ui-ux-pro-max`, sprite VFX triggers `sprite-forge`).
3. **Execution Sandboxing:** Scripts run with bounded directory arguments (`d:/Build/Swood/tools/...`).
