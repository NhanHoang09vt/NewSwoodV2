# Deep Technical Analysis: Agent Sprite Forge
**Repository:** [0x0funky/agent-sprite-forge](https://github.com/0x0funky/agent-sprite-forge)  
**Version Inspected:** 0.6.0  
**License:** MIT License  
**Language Breakdown:** Python 96.9%, JavaScript 3.1%  
**Primary Class:** Asset Pipeline / AI Generation & Signal-Processing Toolkit

---

## 1. Executive Summary & Purpose

`agent-sprite-forge` is an automated 2D game asset creation pipeline tailored for AI agents (supporting Google Antigravity, OpenAI Codex, Claude Code, and Grok CLI). 

Unlike naive generative workflows that attempt to prompt multi-frame sprite sheets in a single image (which notoriously produces inconsistent proportions, broken perspective, and bleeding frame boundaries), `agent-sprite-forge` establishes a rigorous two-stage paradigm:
1. **Approval of a single "Master Still"** (`master_still.py`) establishing character geometry, shading, and hero perspective.
2. **Generation of action clips via Image-to-Video (I2V)** (`video2dsprite` / `sprite_set.py`), followed by deterministic Python signal processing (chroma keying, alpha trimming, cycle loop detection, velocity estimation, and pixel quantization).

---

## 2. Architecture & Main Components

```
agent-sprite-forge/
├── .claude-plugin/             # Claude agent manifest
├── docs/                       # Architectural documentation & pipeline specs
├── shared/                     # Common math, color, and file manipulation utilities
├── skills/                     # Modular agent skills
│   ├── generate2dsprite/       # Sprite sheet & frame processing
│   │   ├── SKILL.md            # Entry point for sprite slicing and registration
│   │   └── scripts/
│   │       ├── master_still.py # Master still generation and approval
│   │       ├── sheet_qc.py     # Background spill and quality checking
│   │       ├── scale_frames.py # Aspect-preserving bounding box scaling
│   │       ├── export_engine.py# Aseprite JSON & Godot SpriteFrames export
│   │       └── ...
│   ├── video2dsprite/          # Video-to-sprite action extractor
│   │   ├── SKILL.md            # Action loop extraction instructions
│   │   └── scripts/
│   │       └── sprite_set.py   # Multi-action planning, I2V orchestration, and QC
│   ├── generate2dmap/          # 2D isometric/orthographic map generation
│   │   ├── SKILL.md            # Map layout, collision masks, Y-sort layers
│   │   └── scripts/
│   ├── generate2dmedia/        # Media generation & provider router
│   │   ├── SKILL.md            # Media routing specifications
│   │   └── scripts/
│   │       └── route_media.py  # Multi-backend router (Gemini, OpenAI, Grok, Fal)
│   └── codeart2d/              # Deterministic code-drawn fallback generator
├── src/                        # Internal core modules
├── tests/                      # Pytest suite
├── tools/                      # Standalone CLI tools
├── requirements.txt            # Core dependencies (numpy, Pillow, scipy)
├── requirements-codeart.txt    # Optional procedural generation tools
└── requirements-dev.txt        # Development & testing dependencies
```

---

## 3. Verified Skills & Available Tools

### 3.1. Included Skills
1. `generate2dsprite`: Handles the full lifecycle of slicing, alpha keying, optical flow registration, and packaging of 2D sprites.
2. `video2dsprite`: Converts short video takes into looped animation sets (`idle`, `walk`, `run`, `attack`, `hurt`, `cast`).
3. `generate2dmap`: Generates layered maps with background ground tiles, collision masks, and Y-sorted object placements.
4. `generate2dmedia`: Standardized API broker for AI image and video endpoints.
5. `codeart2d`: Procedural rendering fallback using pure code (Pillow / vector rendering) when API keys are absent.

### 3.2. Core Pipeline Tools & Scripts

#### A. `master_still.py`
- **Purpose:** Generates and locks the single source of truth for an entity.
- **Commands:**
  - `prompt`: Generates prompt variations from semantic spec (e.g., "Anime sorceress, orthographic isometric 45-degree angle").
  - `generate`: Dispatches request to `route_media.py` with `--takes N`.
  - `edit`: Applies inpainting or localized prompt alterations.
  - `pad`: Automatically keys background and frames hero to 788px inside a 1024x1024 canvas.
  - `approve`: Commits final artifacts: `master.png`, `master_rgba.png`, and `master.json`.

#### B. `sprite_set.py`
- **Purpose:** Orchestrates full animation suites from the approved master still.
- **Commands:**
  - `plan`: Reads `master.json` and produces `set_plan.json` containing action definitions (durations, frame counts, loop vs. one-shot).
  - `run`: Dispatches I2V requests, extracts frames, performs cycle alignment and QC.
  - `review`: Generates HTML contact sheets and sprite review ribbons.
  - `accept` / `retake`: Approves specific action sets or prompts re-generation of failing animations.

#### C. `route_media.py`
- **Supported Providers:**
  - Google Gemini (Gemini Flash Image / Pro routes via `GEMINI_API_KEY`).
  - OpenAI (`gpt-image`, DALL-E via `OPENAI_API_KEY`).
  - xAI (`grok-imagine-image`, Grok video via `XAI_API_KEY`).
  - BytePlus ModelArk (`Seedream` / `Seedance` via `ARK_API_KEY`).
  - fal.ai (`Kling`, `Veo`, `Luma`, `Minimax`, `Wan` via `FAL_KEY`).
  - Local CLI routing: Codex CLI and Grok CLI local agents.
  - Fallback: Deterministic algorithmic drawing via `codeart2d`.

#### D. `export_engine.py`
- **Outputs:**
  - Standard Sprite Sheet PNG + JSON metadata (Aseprite compatible).
  - Godot 4 `SpriteFrames` resource (`.tres`).
  - Godot `Sprite3D` billboard setup.

---

## 4. Input and Output Formats

| Step | Input | Output |
|---|---|---|
| Master Still | Text specification & direction | `master.png`, `master_rgba.png`, `master.json` |
| Video Action Set | `master.json` + Action prompt | MP4 / WebM raw clip |
| Signal Processing | Raw video frames | Cropped, keyed, centered PNG frames (`frame_001.png`...`frame_016.png`) |
| Engine Packaging | PNG frames + timing data | Master Atlas PNG + Frame metadata JSON (UV coordinates, pivot points, durations) |

---

## 5. Dependencies and Runtime Requirements

- **Python Version:** Python 3.10+
- **Exact Requirements (`requirements.txt`):**
  - `numpy>=1.26` (matrix operations, pixel mask manipulation)
  - `Pillow>=10.1` (image IO, alpha channel keying, resizing)
  - `scipy>=1.11` (spatial distance transforms for soft-matte background separation)
- **External Dependencies:**
  - `ffmpeg` on PATH (required for video slicing and MP4-to-frame extraction).
  - Valid API Key (`GEMINI_API_KEY`, `OPENAI_API_KEY`, etc.) OR local generator.

---

## 6. MMORPG Application Mapping: Hybrid 2D + 3D

In our Web MMORPG, the architecture is **Hybrid 2D + 3D** (Three.js canvas with anime-stylized 3D models alongside high-performance 2D sprite elements):

### 6.1. Where 2D Sprite Assets Apply
1. **Item & Inventory Icons:** Weapon icons, consumable potions, armor sets, quest items (256x256 or 128x128 transparent PNGs).
2. **Skill & Buff Icons:** 64x64 spell icons with border states (cooldown overlays, active buffs, debuffs).
3. **2D Visual Effects (VFX) in Three.js:**
   - Ground spell indicators (AoE damage rings, healing runes, elemental circles).
   - Particle textures: Hit sparks, slash trails, blood splatters, level-up flares.
   - Animated Billboard Sprites: In Three.js, using `THREE.Sprite` or `THREE.InstancedMesh` with billboard shaders for distant environmental crowds, ambient wildlife, flying birds, or decorative foliage.
4. **Map Minimap Tiles:** Isometric floor tiles and minimap chunk previews.

### 6.2. Distinction from 3D Assets
- **Player Characters & Major Bosses:** Modeled in Blender and exported as rigged **GLB / glTF** meshes to allow dynamic equipment swapping, full 360-degree rotation, smooth skeletal blending, and synchronized Three.js animations.
- **Agent Sprite Forge will NOT replace 3D GLB characters**; instead, it provides the rapid asset pipeline for the **hundreds of 2D UI icons, decals, billboarding particles, and visual effect flipbooks** required by the MMORPG.

---

## 7. Strengths, Weaknesses, and Limitations

### Strengths
- **Solves the "AI Sprite Consistency" Problem:** By utilizing Master Still -> Image-to-Video -> Deterministic Slicing, it completely avoids deformed frame-to-frame anatomy.
- **Native Antigravity & Codex Integration:** Includes explicit agent manifests and CLI routing.
- **Clean JSON Exports:** The resulting frame data (frames, pivots, durations) can be fed directly into Three.js `TextureLoader` and custom sprite animation shaders.

### Weaknesses & Limitations
- **Requires Video Generation Quota/API:** Image-to-Video generation can be latency-heavy or require cloud credits unless using local ComfyUI/fallback.
- **Heavy Dependencies for Video Extraction:** Requires `ffmpeg` installed on the host system to break video takes into image sequences.

---

## 8. License & Security Considerations

- **License:** MIT License. Free for commercial MMORPG development.
- **Security:** Relies on environment variables for API keys (`GEMINI_API_KEY`, `OPENAI_API_KEY`). Ensure keys are never committed to version control. Script execution must be sandboxed.
