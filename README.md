# 🤖 Fzzzt! Digital Game Engine

A modern web implementation of the 2009 sci-fi auction card game **Fzzzt!** by Tony Boydell. Built to demonstrate complex state management and modern frontend architecture.

## 🔗 Live Demo
[Paste your Vercel Link Here: https://fzzzt-web.vercel.app]

## 🚀 Key Features
- **Dynamic State Management:** Synchronizes a hidden "Conveyor Belt" with real-time bidding logic.
- **Information Hiding:** Implements the "Belt Speed" mechanic (Page 9 of rules) to reveal/hide cards based on the head card's speed.
- **AI Opponent:** A heuristic-based AI mechanic that competes for high-value robots.
- **Clean Architecture:** Built with a component-driven approach using **React** and **Tailwind CSS v4**.

## 🛠️ Tech Stack
- **Frontend:** React 19 + Vite
- **Styling:** Tailwind CSS v4 (Zero-Config)
- **Deployment:** Vercel

## 📜 How to Play
1. **The Belt:** 8 cards are laid out. Only the "Head" card is up for auction.
2. **The Reveal:** Depending on the Head card's speed, 1 to 8 cards are revealed on the belt.
3. **The Bid:** Choose a power card (1, 2, or 3) from your hand.
4. **Winning:** Highest bid wins. In a tie, you (the Chief Mechanic) win!