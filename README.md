# NewSwoodV2

> Next-Generation Web MMORPG & Game Development Framework

## 📖 Overview

NewSwoodV2 is a unified, high-performance Web MMORPG framework combining real-time 3D client rendering (Three.js / WebGL / Next.js) and an authoritative multiplayer backend engine, integrated with AI-driven game studio workflows, asset pipelines, and development agent skills.

## 📂 Documentation

Detailed architecture specifications, research, workflows, and task roadmaps are available in the [`docs/`](./docs) directory:

- **[Integration & Architecture](./docs/integration/)**: System design, dependencies, installation guide, and security reviews.
  - [Integration Architecture](./docs/integration/INTEGRATION_ARCHITECTURE.md)
  - [Installation Guide](./docs/integration/INSTALLATION_GUIDE.md)
  - [Dependency Report](./docs/integration/DEPENDENCY_REPORT.md)
- **[Task Roadmap](./docs/TASKS.md)**: Implementation tasks, milestones, and blockers.
- **[Research & Analyses](./docs/research/)**: Deep dives into agent game studio engines, sprite generation, UI/UX systems, and RealmForge architecture.
- **[Workflows](./docs/workflows/)**: End-to-end game development, world building, sprite creation, and UI design pipelines.
- **[Skills & Agent Registry](./docs/skills/)**: Skill activation rules and capability matrices for AI development agents.

## 🛠️ Tech Stack Highlights

- **Client**: Next.js, Three.js, TypeScript, Vite, Tailwind CSS
- **Server**: Authoritative Rust backend (Tokio, Axum, WebSocket, Spatial Hash Grid)
- **Database / Cache**: PostgreSQL (sqlx), Redis
- **Tooling & AI Pipelines**: Game Studio agent consensus, UI/UX design engine, Sprite Forge pipeline
