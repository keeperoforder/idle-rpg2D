# Idle RPG 2D

Web-based 2D idle RPG prototype built with **Phaser + TypeScript + Vite**.

## Current prototype

The game boots into a custom dark-fantasy main menu with:

- START GAME
- CHOOSE HERO
- SETTINGS
- EXIT
- custom vector logo and atmospheric background
- animated hover/press feedback for menu buttons
- placeholder interactions ready to be connected to future systems

## Development

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal.

## Build

```bash
npm run build
```

## Structure

- `src/main.ts` — Phaser bootstrap
- `src/game/scenes/` — game scenes
- `src/game/ui/` — reusable UI components
- `src/game/data/` — static configuration and data
- `src/game/types.ts` — shared game types
- `src/styles.css` — page-level styles
- `public/assets/` — future game assets
