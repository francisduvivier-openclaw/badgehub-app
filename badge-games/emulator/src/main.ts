import './style.css';

type Cell = '#' | '.' | 'S' | 'G';

type Level = {
  name: string;
  grid: string[];
};

const levels: Level[] = [
  {
    name: 'Level 1',
    grid: [
      '##########',
      '#S...#...#',
      '#.##.#.#.#',
      '#....#.#G#',
      '##########',
    ],
  },
  {
    name: 'Level 2',
    grid: [
      '############',
      '#S...#.....#',
      '###.#.###..#',
      '#...#...##.#',
      '#.#####....#',
      '#......###G#',
      '############',
    ],
  },
  {
    name: 'Level 3',
    grid: [
      '############',
      '#S....#....#',
      '#.##.##.##.#',
      '#..#....#..#',
      '##.####.#.##',
      '#....#..#G.#',
      '############',
    ],
  },
];

let levelIndex = 0;
let ball = { x: 1, y: 1 };
let startTime = performance.now();
const best: Record<string, number> = JSON.parse(localStorage.getItem('tilt-maze-best') || '{}');

const app = document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML = `
<div class="mx-auto max-w-5xl p-6 space-y-4">
  <h1 class="text-3xl font-bold">🎮 Badge Games Emulator</h1>
  <p class="text-slate-300">Web emulator for badge-games. Start with <b>Tilt Maze</b>. Controls: arrow keys (simulate tilt).</p>
  <div class="grid gap-4 md:grid-cols-3">
    <div class="card md:col-span-2">
      <div id="hud" class="mb-3 text-sm text-slate-300"></div>
      <pre id="maze" class="overflow-auto rounded-xl bg-black/30 p-4 text-lg leading-6"></pre>
      <div class="mt-3 flex gap-2">
        <button id="reset" class="btn">Reset Level</button>
        <button id="next" class="btn">Next Level</button>
      </div>
    </div>
    <div class="card">
      <h2 class="mb-2 text-xl font-semibold">Games</h2>
      <ul class="space-y-2 text-slate-200">
        <li>✅ Tilt Maze (playable)</li>
        <li>🛠️ Reaction Arena (coming)</li>
        <li>🛠️ Pixel Studio (coming)</li>
      </ul>
      <h3 class="mt-4 font-semibold">Deployment</h3>
      <p class="text-sm text-slate-300">GitHub Pages via Actions is preconfigured.</p>
    </div>
  </div>
</div>`;

const mazeEl = document.getElementById('maze')!;
const hudEl = document.getElementById('hud')!;

function find(grid: string[], ch: string) {
  for (let y = 0; y < grid.length; y++) {
    const x = grid[y].indexOf(ch);
    if (x >= 0) return { x, y };
  }
  return { x: 1, y: 1 };
}

function levelKey(i: number) {
  return `level_${i + 1}`;
}

function resetLevel() {
  ball = find(levels[levelIndex].grid, 'S');
  startTime = performance.now();
  render();
}

function render() {
  const level = levels[levelIndex];
  const elapsed = (performance.now() - startTime) / 1000;
  const bestScore = best[levelKey(levelIndex)];
  hudEl.textContent = `${level.name} | Time: ${elapsed.toFixed(1)}s | Best: ${bestScore ? bestScore.toFixed(1) + 's' : '--'}`;

  const out: string[] = [];
  level.grid.forEach((row, y) => {
    let line = '';
    row.split('').forEach((c, x) => {
      const cell = c as Cell;
      if (x === ball.x && y === ball.y) line += 'O';
      else if (cell === 'S') line += '.';
      else line += cell;
    });
    out.push(line);
  });
  mazeEl.textContent = out.join('\n');
}

function tryMove(dx: number, dy: number) {
  const level = levels[levelIndex];
  const nx = ball.x + dx;
  const ny = ball.y + dy;
  if (ny < 0 || ny >= level.grid.length) return;
  if (nx < 0 || nx >= level.grid[0].length) return;
  const cell = level.grid[ny][nx] as Cell;
  if (cell === '#') return;
  ball = { x: nx, y: ny };
  if (cell === 'G') {
    const t = (performance.now() - startTime) / 1000;
    const k = levelKey(levelIndex);
    if (!best[k] || t < best[k]) {
      best[k] = t;
      localStorage.setItem('tilt-maze-best', JSON.stringify(best));
    }
    alert(`Level clear in ${t.toFixed(2)}s`);
    if (levelIndex < levels.length - 1) levelIndex += 1;
    resetLevel();
    return;
  }
  render();
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') tryMove(0, -1);
  if (e.key === 'ArrowDown') tryMove(0, 1);
  if (e.key === 'ArrowLeft') tryMove(-1, 0);
  if (e.key === 'ArrowRight') tryMove(1, 0);
});

document.getElementById('reset')!.addEventListener('click', resetLevel);
document.getElementById('next')!.addEventListener('click', () => {
  levelIndex = (levelIndex + 1) % levels.length;
  resetLevel();
});

resetLevel();
