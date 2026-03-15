# badge-games

Monorepo for Fri3d badge games.

## Structure

- `games/tilt-maze` – playable Tilt Maze (Fri3d 2024)
- `games/reaction-arena` – scaffolded (next to implement)
- `games/pixel-studio` – scaffolded (next to implement)
- `emulator/` – Bun + Vite + Tailwind web emulator

## Emulator

### Local dev

```bash
cd emulator
bun install
bun run dev
```

### Build

```bash
cd emulator
bun run build
```

### GitHub Pages

- Workflow: `.github/workflows/deploy-pages.yml`
- On push to `main`, deploys `emulator/dist` to Pages
- `BASE_PATH` is set automatically to `/${repo-name}/`

After first push, ensure repository settings include:

- **Settings → Pages → Source = GitHub Actions**

## Next games planned

- badge-pet

## Target

- Fri3d Badge 2024 (MicroPython)
