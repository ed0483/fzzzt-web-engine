# 🤖 Fzzzt! Digital Game Engine (v2.0)
**Live Demo:** [https://fzzzt-web.vercel.app](https://fzzzt-web.vercel.app)

A high-performance digital implementation of the 2009 robot-auction tabletop game **Fzzzt!**. This project demonstrates complex state synchronization, resource allocation algorithms, and modern frontend architecture.

## 🚀 Key Features
- **Two-Phase Gameplay Loop:** Seamlessly transitions from a real-time **Auction Phase** to a tactical **Construction Phase**.
- **Strategic Advisory Engine:** A heuristic system that analyzes the current auction target against the player's inventory to provide real-time strategic advice.
- **Fog of War (Page 9 Rules):** Implemented dynamic "Belt Speed" visibility logic to simulate strategic information hiding.
- **Resource Allocation Logic:** Custom algorithm for matching robot symbols (Nut, Oil, Cog, Bolt) to Production Unit "Recipes" to calculate bonuses and penalties.
- **Chief Mechanic Tie-Breaker:** Engineered logic to handle specific rule-book edge cases where the player wins all tied bids.

## 🛠️ Tech Stack & Engineering Highlights
- **Framework:** React 19 + Vite
- **Language:** **TypeScript** (Strict Mode) using custom interfaces to model the game domain.
- **Styling:** **Tailwind CSS v4** (Zero-Config) for high-speed, modern UI development.
- **Animation:** **Framer Motion** for state-driven layout transitions (Spring Physics).
- **Optimization:** Used `useMemo` for complex score calculations and `AnimatePresence` for asynchronous DOM lifecycle management.

## 🧠 Software Engineering Challenges Solved
1. **State Synchronization:** Managed the synchronization of a 52-card deck, a sliding conveyor belt, and individual player hands across multiple game phases.
2. **Logic Abstraction:** Separated game data (JSON) from business logic (TypeScript) and UI components (React) to ensure a clean, maintainable codebase.
3. **UX Empathy:** Developed an "On-Demand Manual" and visual target cues to reduce cognitive load for new users.

## 📜 How to Play
1. **Auction:** Bid for the first robot using power cards (1-3).
2. **Strategy:** Look at the "Belt Speed" on the target card to peek at future robots.
3. **Build:** In the final phase, click a Production Unit, then click your robots to install them and claim your bonus points.
