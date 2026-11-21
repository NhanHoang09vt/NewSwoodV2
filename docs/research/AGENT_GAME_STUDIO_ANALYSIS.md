# Deep Technical Analysis: Agent Game Studio
**Repository:** [NhanHoang09vt/agent-game-studio](https://github.com/NhanHoang09vt/agent-game-studio)  
**Origin / Attribution:** Multi-Provider Architecture based on `Claude-Code-Game-Studios` (Donchitos)  
**License:** MIT License  
**Language Breakdown:** Shell 73.2%, Python 20.2%, HTML 6.2%, Other 0.4%  
**Primary Class:** Multi-Agent Orchestration Platform & Game Development Studio Framework

---

## 1. Executive Summary & Purpose

`agent-game-studio` is an enterprise-grade multi-agent orchestration framework designed specifically for end-to-end game development. While upstream templates were tied exclusively to Claude Code, this repository provides a vendor-neutral, multi-provider abstraction layer running over Google Gemini (supporting Gemini 3.8 Flash & Pro, Gemini 2.5), Anthropic Claude (3.7 Sonnet / Opus), OpenAI (GPT-4o / o3-mini), DeepSeek, and local inference engines (vLLM / Ollama).

The platform models an actual game studio hierarchy containing 50 specialized agents across 4 executive divisions (Production, Creative Direction, Technical Architecture, and Quality Assurance). It features a DAG (Directed Acyclic Graph) task scheduler with concurrency control, file locking, a 4-tier memory management system, and a peer-review consensus arbiter.

---

## 2. Architecture & Main Components

```
agent-game-studio/
├── core/                       # Core orchestration runtime
│   ├── memory.py               # 4-tier memory management engine
│   ├── orchestration.py        # DAG execution engine, task graph, & consensus
│   ├── locks.py                # Concurrency gates & file mutexes
│   └── agents.py               # Agent roster loader & role definitions
├── dashboard/                  # FastAPI web application & monitoring UI
│   ├── api_server.py           # REST & WebSocket API endpoints (port 8000)
│   ├── static/                 # Frontend dashboard assets
│   └── templates/              # Jinja2 dashboard templates
├── data/                       # State databases, templates, and agent logs
│   ├── memory/                 # Persisted tier memory stores
│   └── tasks/                  # Task definitions and status manifests
├── docs/                       # Architectural manuals and agent role charts
├── providers/                  # Multi-provider AI adapters
│   ├── base_adapter.py         # Abstract BaseAIAdapter (async httpx client)
│   ├── gemini_adapter.py       # Google Generative Language REST adapter
│   ├── claude_adapter.py       # Anthropic Messages API adapter
│   ├── openai_adapter.py       # OpenAI REST adapter (with offline mock fallback)
│   ├── deepseek_adapter.py     # DeepSeek API adapter
│   └── local_adapter.py        # vLLM / Ollama / LM Studio adapter
├── tests/                      # 21 comprehensive end-to-end test cases
├── upstream/                   # Upstream reference skills and prompts
├── studio.py                   # Master CLI controller
├── requirements.txt            # Python dependencies
└── .env.example                # API credentials template
```

---

## 3. Verified Skills & Available Tools

### 3.1. CLI Tool: `studio.py`
The master executable exposes the following verified commands:
- `python studio.py dashboard`: Launches the FastAPI dashboard on `http://127.0.0.1:8000` (monitoring task execution, agent token usage, DAG status, and logs).
- `python studio.py providers`: Queries and displays health/connection status across all configured AI providers.
- `python studio.py agents`: Enumerates the active 50-agent roster and their domain capabilities.
- `python studio.py test`: Runs the automated test suite (`pytest tests/ -v`).
- `python studio.py play`: Serves an interactive HTML5 game canvas prototype at `http://127.0.0.1:8000/game`.
- `python studio.py generate-art`: Executes the asset creation sub-pipeline.

### 3.2. Core Orchestration Engine (`core/orchestration.py`)
- **DAG Task Engine:** Uses `TaskNode` states (`pending`, `running`, `reviewing`, `waiting_approval`, `completed`, `failed`, `blocked`). Tasks declare upstream dependencies and execute concurrently using `asyncio.gather` up to user-defined concurrency limits.
- **File Locking (`FileLockManager`):** Prevents race conditions when multiple agents attempt to modify code or design files simultaneously.
- **Peer-Review Consensus Matrix:** Critical architecture files (such as database schemas, network protocols, or balance constants) require multi-model cross-validation (e.g., Gemini proposes -> Claude audits -> Codex reviews) before status is marked `completed`.

### 3.3. 4-Tier Memory Management System (`core/memory.py`)
1. **Tier 1: GLOBAL Memory:** Read-only foundational rules (e.g., MMORPG network optimization principles, Rust memory safety rules, Three.js performance guidelines).
2. **Tier 2: PROJECT Memory:** Project-isolated context (GDD, World Lore, entity IDs, protocol opcodes, PostgreSQL schemas).
3. **Tier 3: AGENT Memory:** Learnings, conventions, and style preferences acquired by specific roles over time.
4. **Tier 4: TASK Memory:** Ephemeral scratchpad for intermediate generation steps, discarded upon task completion.

---

## 4. Input and Output Formats

| Layer | Input Format | Output Format |
|---|---|---|
| Task Submission | JSON / YAML task spec (`task.yaml`) with dependencies | DAG execution graph + real-time status events |
| Provider Adapters | Normalized request payload (`messages`, `tools`, `temperature`) | Normalized response object (`content`, `tool_calls`, `usage`) |
| Consensus Gate | Code / Document diff + review rubric | Structured review report with pass/fail and suggested edits |
| Dashboard Stream | WebSocket connection to `/ws/events` | JSON event stream (`agent_started`, `token_used`, `task_done`) |

---

## 5. Dependencies and Runtime Requirements

- **Python Version:** Python 3.10+
- **Verified Requirements (`requirements.txt`):**
  - `fastapi>=0.115.0` (async dashboard API)
  - `uvicorn>=0.30.0` (ASGI server)
  - `pydantic>=2.9.0` (strict schema validation)
  - `pyyaml>=6.0.2` (task and config parsing)
  - `httpx>=0.28.0` (async HTTP client for LLM providers)
  - `pytest>=8.3.0` & `pytest-asyncio>=0.24.0` (test framework)
- **Host Ports:** Port 8000 for dashboard (configurable via `--port`).

---

## 6. MMORPG Application Mapping

In our Web MMORPG project, `agent-game-studio` provides the **engineering collaboration and multi-agent governance structure**:

### 6.1. Gameplay & System Engineering
- **Rust Backend Architecture:** The Technical Director and Systems Architect agents can be tasked with verifying Tokio actor patterns, Axum WebSocket routing, and Redis caching layers.
- **Combat Balance & Numerical Modeling:** The Game Economy & Balance Lead agent can design progression curves, calculate DPS equations, simulate TTK (time-to-kill), and output formatted JSON balance tables.
- **Protocol Synchronization:** The Network Engineer agent coordinates between the Rust server and Three.js client to verify message opcodes and serialization consistency.

### 6.2. Cross-Model Peer Review
By configuring Google Antigravity (Gemini) as primary implementation agent and OpenAI Codex / Claude as reviewing agents via `agent-game-studio`'s consensus arbiter, critical MMORPG code (e.g., PostgreSQL transaction handlers, inventory item-duplication prevention, spatial grid queries) is audited before landing in the master branch.

---

## 7. Strengths, Weaknesses, and Limitations

### Strengths
- **Native Support for Gemini and OpenAI:** First-class async adapters for both our primary AI development platforms.
- **Robust Concurrency & Locking:** Prevents agents from corrupting shared project files through granular file mutexes.
- **Structured 4-Tier Memory:** Eliminates context window overflow by cleanly segmenting persistent project knowledge from task scratchpads.

### Weaknesses & Limitations
- **Upstream Engine Bias:** Upstream agents contain templates oriented toward Godot, Unity, and Unreal; must be adapted with custom prompts for our **Three.js + Rust (Axum/Tokio)** stack.
- **Requires Running Service:** The dashboard and orchestration engine run as a local FastAPI service rather than a lightweight static markdown skill.

---

## 8. License & Security Considerations

- **License:** MIT License. Permissive and compliant with independent commercial MMORPG projects.
- **Security:** Local service bounds to `127.0.0.1`. API keys must be protected in local `.env` and never exposed via web endpoints. Multi-agent file write operations must remain strictly bounded to the MMORPG project directory.
