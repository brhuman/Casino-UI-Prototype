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

## 🧪 Testing & Quality Assurance
This project includes a suite of automated unit tests for the core game logic:
- **Core Logic Tests**: Verified `useUserStore` balance calculations, level-up mechanics, and achievement triggers.
- **Reliability**: All tests pass in the current build environment, ensuring the stable foundation of the gaming platform.
- **How to run**: Simply execute `npm run test:raw -- src/store/useUserStore.test.ts` to see the core logic tests.

For a deep dive into our testing strategy, check out [test.md](./neon-spin/test.md).

## 💎 Key Features
- **Custom Game Engines**: Slot machines and Roulette implemented with raw PIXI.js graphics and optimized sprite handling.
- **Responsive Architecture**: Fully optimized UX for desktop and mobile (breakpoints handled via Tailwind and custom ResizeObservers).
- **Global State synchronization**: Real-time balance and statistics tracking across multiple game modules.

---
> [!IMPORTANT]
> **This is a technical demonstration.** No real money gambling is involved. All credits are virtual and provided for testing the interface and game logic only.

---
Created as a showcase of modern web graphics capabilities.
