# 🎰 Neon Spin - PIXI.js & React Demonstration

**Live Demo:** [https://neonspin.vercel.app/](https://neonspin.vercel.app/)

## 🚀 Overview
Hello! This is my test project, where I am experimenting with modern technologies like **React 19**, **PIXI.js 8**, **Framer Motion**, and **Tailwind CSS**. **This is not real gambling.** All credits are virtual and provided for testing the interface and engine logic only.

## 🛠 Tech Stack
- **Frontend**: React 19 + TypeScript + Vite
- **Graphics**: PIXI.js (WebGL rendering)
- **Animation**: Framer Motion + GSAP
- **State**: Zustand (Global Store)
- **Styling**: Tailwind CSS (Glassmorphism & Neon Design)
- **Testing**: Vitest + React Testing Library

## 🧪 Testing & quality assurance

Automated checks run on **GitHub Actions** for every push and pull request: ESLint, **Vitest** (unit + integration-style tests), TypeScript check + production build (`npm run build` in `neon-spin/`). CI also generates a **V8 coverage** report focused on deterministic game and store logic rather than rendering-heavy PIXI bundles, and uploads the HTML output as a workflow artifact (`coverage-html`).

### What is covered

- **Slot RNG math** (`src/game/math/rng.ts`) — matrix generation and win calculation.
- **Zustand stores** — game, user, UI, settings, and Mines state transitions.
- **Wallet transactions** — bet debits, wins, bonuses, quest rewards, XP, and balance invariants.
- **Mines** — game logic, cancellable service requests, engine events, and store behaviour.
- **Roulette** — bet validation, settlement payouts, and round state transitions.
- **React** — light component tests with **Testing Library**; heavy PIXI/GSAP paths are mocked in `src/setupTests.ts` where needed.
- **Integration-style** — e.g. `SlotSpinFlow.integration.test.tsx` exercises a spin control wired to real stores (no PIXI canvas).

### How to run tests locally

From the `neon-spin/` directory:

| Command | Purpose |
|--------|---------|
| `npm run test:raw` | Run the full suite once (verbose reporter). |
| `npm run test:ci` | Same as CI: full suite + **coverage** (text + `coverage/index.html`). |
| `npm test` | Wrapper around `scripts/test-monitor.ts` (optional local workflow). |

Run a single file, for example:

`npm run test:raw -- src/store/useUserStore.test.ts`

Coverage HTML is written to `neon-spin/coverage/` (ignored by git; download the artifact from a workflow run on GitHub if you want the report without generating it locally).

## 💎 Key Features
- **Custom Game Engines**: Slot machines and Roulette implemented with raw PIXI.js graphics and optimized sprite handling.
- **Responsive Architecture**: Fully optimized UX for desktop and mobile (breakpoints handled via Tailwind and custom ResizeObservers).
- **Transactional Wallet State**: Explicit bet, win, bonus, and quest-reward operations keep balance and statistics consistent across game modules.
- **Managed PIXI Lifecycle**: Shared initialization and cleanup guards keep WebGL applications stable under React Strict Mode and route changes.

---
> [!IMPORTANT]
> **This is a technical demonstration.** No real money gambling is involved. All credits are virtual and provided for testing the interface and game logic only.

---
Created as a showcase of modern web graphics capabilities.
