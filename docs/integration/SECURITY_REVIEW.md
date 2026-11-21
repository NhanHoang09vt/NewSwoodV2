# Security Review & Threat Modeling

This document provides a technical threat model and security evaluation for integrating the four repositories into the Web MMORPG project.

---

## 1. Security Overview by Subsystem

| Subsystem / Repository | Attack Surface | Vulnerability Risk Level | Primary Risk Vector | Required Countermeasure |
|---|---|---|---|---|
| **ui-ux-pro-max-skill** | Local Python CLI | **Very Low** | Path injection in CSV loading | Bounded directory paths; static dataset isolation |
| **agent-sprite-forge** | Cloud AI APIs & FFmpeg Subprocesses | **Medium** | API key leakage; shell argument injection | Environment variable encapsulation; subprocess list arguments (no `shell=True`) |
| **agent-game-studio** | Local FastAPI Webhook & Multi-Agent File IO | **Medium-High** | Path traversal (`../`); CORS / Unauthenticated REST calls | Bind strictly to `127.0.0.1`; canonical path resolution; strict file write boundaries |
| **realmforge (Rust Server)** | Public WebSocket Endpoint (`/ws`) | **Critical** | Packet spoofing, DoS flooding, item duplication, memory leaks | Authoritative server state, bounded channels, frame rate-limiting |

---

## 2. Threat Analysis & Mitigations

### 2.1. Agent Tooling Threat Analysis

#### A. API Credential Protection (`agent-sprite-forge` & `agent-game-studio`)
- **Threat:** AI provider credentials (`GEMINI_API_KEY`, `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`) accidentally logged to console, written to task output JSONs, or committed to git.
- **Enforced Mitigations:**
  1. API keys must only be read from process environment variables.
  2. Add `.env`, `*.key`, and `credentials.json` to root `.gitignore`.
  3. Ensure `BaseAIAdapter` scrubs authorization headers from all debug logs and test reports.

#### B. Subprocess Execution & Command Injection (`agent-sprite-forge`)
- **Threat:** Malicious file paths or shell metacharacters passed into `ffmpeg` or `scale_frames.py`.
- **Enforced Mitigations:**
  1. Never invoke commands using `shell=True` in Python.
  2. Always pass arguments as sanitized arrays (e.g., `["ffmpeg", "-i", input_path, "-r", "16", output_pattern]`).
  3. Enforce alphanumeric character validation on asset slugs and action names.

#### C. Path Traversal & File Write Sandboxing (`agent-game-studio`)
- **Threat:** Autonomous agents writing files outside the designated workspace (e.g., modifying system files or global user settings).
- **Enforced Mitigations:**
  1. Implement strict canonical path validation in `core/locks.py` and `core/orchestration.py`:
     ```python
     def validate_safe_path(target_path: Path, workspace_root: Path) -> Path:
         resolved = target_path.resolve()
         if not resolved.is_relative_to(workspace_root.resolve()):
             raise PermissionError(f"Access Denied: Path {target_path} escapes workspace root.")
         return resolved
     ```
  2. Restrict FastAPI listener strictly to `127.0.0.1` (never `0.0.0.0`).

---

### 2.2. Game Server Threat Analysis (`realmforge` Rust Server)

#### A. Client-Side State Spoofing & Speed Hacks
- **Threat:** Compromised client sends illegitimate `MSG_MOVE` coordinates or instant teleport vectors.
- **Mitigation:**
  - The Rust server tracks player velocity and previous tick position. If $\Delta \text{distance} > (\text{speed} \times \Delta t) + \epsilon$, the movement packet is rejected and the client is rubber-banded back to the authoritative position.

#### B. Combat Exploits & Range Hacks
- **Threat:** Client sends `MSG_ATTACK` targeting an enemy out of line-of-sight or outside weapon range.
- **Mitigation:**
  - Server calculates Euclidean distance between player and target coordinates before processing damage. Attack cooldown is enforced server-side using high-resolution monotonic timestamps (`tokio::time::Instant`).

#### C. Denial of Service & Channel Flooding
- **Threat:** Malicious client spams thousands of WebSocket frames per second to exhaust server memory and CPU.
- **Mitigation:**
  - Replace unbounded MPSC channels (`mpsc::unbounded_channel`) with bounded channels (`mpsc::channel(128)`).
  - Implement token-bucket rate limiting per socket connection (maximum 30 incoming packets per second per client; disconnect upon repeated violations).

#### D. Item Duplication & Banking Race Conditions
- **Threat:** Player initiates simultaneous trade and bank deposit requests across concurrent worker threads.
- **Mitigation:**
  - All inventory and banking mutations must execute within atomic PostgreSQL transactions using row-level locking (`SELECT ... FOR UPDATE`).
