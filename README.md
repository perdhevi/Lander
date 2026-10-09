# Lander

My personal landing page, live at **[perdhevi.com](https://perdhevi.com)**.

It's two things in one page: a React + TypeScript portfolio site, and an interactive Three.js mini-game in the middle of it, the story of an astronaut stranded on a barren planet.

## What's inside

### The page (React + TypeScript)
- Built with **React** and **TypeScript**, bundled by **Vite**, styled with **Sass**.
- All copy (hero, projects, writing, track record, certifications) lives in [`src/data/content.ts`](src/data/content.ts), so the text can change without touching layout code.
- The page is split into two React roots, `Top` and `Bottom`, that sit above and below the Three.js canvas. That way the 3D scene and its HUD overlays stay independent of the React tree.

### The lost astronaut (Three.js)
Click the scene to expand it and play:
- **Starfield intro** that transitions into the planet surface once clicked.
- **Animated astronaut** (FBX model with idle, run, kneel and carry animations, driven by an `AnimationMixer`).
- **WASD movement**, plus on-screen rotate and pick-up buttons.
- **Pick up and carry** objects (crates) to complete the story, with a raycaster for interaction.
- **HUD** drawn on separate canvases: map, compass, controls and story messages, ending with an outro and credits.
- A simple **state machine** (`Experience` → `World` → `Universe`) handles intro, loading, gameplay and outro.

## Build notes

- **Compressed models:** the FBX assets are stored deflated (`.dat`) and inflated in the browser with `pako`, which keeps the download small.
- **Chunk splitting:** [`vite.config.ts`](vite.config.ts) splits Three.js and its loaders into their own vendor chunks, so the page loads first and the 3D code follows.
- **Structure:** the `Experience` / `Camera` / `Renderer` / `Sizes` / `Time` layout follows the pattern taught in [Three.js Journey](https://threejs-journey.com/).

## How it was built

- **2022:** the Three.js scene, game logic and original React page were written by hand while I was learning Three.js.
- **2026:** the React page was redesigned and refactored with Claude Code into the current modernist layout, with content moved into a single data file. The Three.js scene was left essentially untouched.

## Run it locally

```bash
npm install
npm run dev      # dev server at http://localhost:3000/
npm run build    # type-check + production build into dist/
npm run preview  # serve the production build locally
```

## License

[LGPL-2.1](LICENSE)
