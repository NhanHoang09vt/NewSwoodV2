# Step-by-Step Installation & Integration Guide

This guide details the exact procedure for staging, installing, configuring, and verifying all four repository integrations.

---

## 1. Prerequisites & System Requirements

Ensure the following runtimes and utilities are installed on the host operating system:
- **Operating System:** Windows 10/11 (or Linux / macOS)
- **Python:** 3.10 or 3.11 (`python --version`)
- **Node.js:** 20.x or 22.x LTS (`node --version`)
- **Rust:** 1.75+ (`rustc --version`)
- **FFmpeg:** Installed and added to system PATH (`ffmpeg -version`)

---

## 2. Environment Configuration

Create a root `.env` file from the provided template:

```ini
# AI Provider Keys (For Sprite Forge & Game Studio)
GEMINI_API_KEY="your-gemini-api-key"
OPENAI_API_KEY="your-openai-api-key"
ANTHROPIC_API_KEY="your-anthropic-api-key"

# Authoritative Game Server
SERVER_PORT=8080
SERVER_TICK_RATE=20
SERVER_HOST=127.0.0.1

# Database & Cache (Production / Local Dev)
DATABASE_URL=postgres://mmorpg_user:mmorpg_pass@localhost:5432/mmorpg_db
REDIS_URL=redis://localhost:6379

# Studio Dashboard
STUDIO_PORT=8000
STUDIO_HOST=127.0.0.1
```

---

## 3. Modular Staging & Installation Steps

### Step 1: Install UI/UX Pro Max Tooling
`ui-ux-pro-max` requires no pip dependencies and runs directly via the Python standard library.
1. Stage files into `tools/agent-skills/ui-ux-pro-max/`:
   ```bash
   # Copy scripts and data from upstream
   mkdir -p tools/agent-skills/ui-ux-pro-max/scripts
   mkdir -p tools/agent-skills/ui-ux-pro-max/data
   ```
2. Verify execution:
   ```bash
   python tools/agent-skills/ui-ux-pro-max/scripts/search.py "dark fantasy hud" --domain style --stack threejs
   ```

### Step 2: Install Agent Sprite Forge
1. Create a dedicated virtual environment for asset pipeline tools:
   ```bash
   python -m venv .venv-tools
   # Windows:
   .venv-tools\Scripts\activate
   # Linux/macOS:
   source .venv-tools/bin/activate
   ```
2. Install sprite pipeline requirements:
   ```bash
   pip install numpy>=1.26 Pillow>=10.1 scipy>=1.11
   ```
3. Verify video and image processing tools:
   ```bash
   python tools/agent-skills/sprite-forge/scripts/scale_frames.py --help
   ```

### Step 3: Install Agent Game Studio
1. In the same virtual environment, install studio requirements:
   ```bash
   pip install fastapi>=0.115.0 uvicorn>=0.30.0 pydantic>=2.9.0 pyyaml>=6.0.2 httpx>=0.28.0 pytest>=8.3.0 pytest-asyncio>=0.24.0
   ```
2. Test provider connectivity:
   ```bash
   python tools/agent-skills/game-studio/studio.py providers
   ```

### Step 4: Configure RealmForge Game Server (Rust)
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Build the server binary with optimizations:
   ```bash
   cargo build
   ```
3. Run the unit and integration tests:
   ```bash
   cargo test
   ```

### Step 5: Configure MMORPG Web Client (Three.js + Next.js)
1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run client in development mode:
   ```bash
   npm run dev
   ```

---

## 4. Verification & Health Checks

Run the unified test runner:
```bash
# 1. Test UI Search Tool
python tools/agent-skills/ui-ux-pro-max/scripts/search.py "test" --domain style

# 2. Test Studio Multi-Agent Tests
python tools/agent-skills/game-studio/studio.py test

# 3. Test Rust Server Game Loop
cd server && cargo test -- --nocapture
```

---

## 5. Rollback & Uninstallation Procedure

Because integrations are strictly modularized:
- To remove any tool, delete its respective subfolder under `tools/agent-skills/`.
- Deleting `.venv-tools/` removes all Python tool dependencies without altering global system packages.
- The core game source code (`client/` and `server/`) remains clean and decoupled.
