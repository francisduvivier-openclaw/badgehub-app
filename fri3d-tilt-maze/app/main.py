try:
    import utime as time
except Exception:
    import time

try:
    import ujson as json
except Exception:
    import json

try:
    import os
except Exception:
    os = None

from board_fri3d_2024 import Fri3dBoard

TICK_MS = 120
TILT_THRESHOLD = 120
SCORES_FILE = "tilt_maze_scores.json"

LEVELS = [
    {
        "name": "Level 1",
        "grid": [
            "##########",
            "#S...#...#",
            "#.##.#.#.#",
            "#....#.#G#",
            "##########",
        ],
    },
    {
        "name": "Level 2",
        "grid": [
            "############",
            "#S...#.....#",
            "###.#.###..#",
            "#...#...##.#",
            "#.#####....#",
            "#......###G#",
            "############",
        ],
    },
    {
        "name": "Level 3",
        "grid": [
            "############",
            "#S....#....#",
            "#.##.##.##.#",
            "#..#....#..#",
            "##.####.#.##",
            "#....#..#G.#",
            "############",
        ],
    },
]


def ticks_ms():
    return time.ticks_ms() if hasattr(time, "ticks_ms") else int(time.time() * 1000)


def ticks_diff(a, b):
    return time.ticks_diff(a, b) if hasattr(time, "ticks_diff") else a - b


def sleep_ms(ms):
    if hasattr(time, "sleep_ms"):
        time.sleep_ms(ms)
    else:
        time.sleep(ms / 1000)


def clear_screen():
    print("\x1b[2J\x1b[H", end="")


def find_char(grid, ch):
    for y, row in enumerate(grid):
        x = row.find(ch)
        if x >= 0:
            return x, y
    return None


def load_scores():
    if not os:
        return {}
    for base in ("/sd", "/sdcard", ""):
        p = (base + "/" + SCORES_FILE) if base else SCORES_FILE
        try:
            with open(p, "r") as f:
                return json.loads(f.read())
        except Exception:
            pass
    return {}


def save_scores(scores):
    if not os:
        return False
    for base in ("/sd", "/sdcard", ""):
        p = (base + "/" + SCORES_FILE) if base else SCORES_FILE
        try:
            with open(p, "w") as f:
                f.write(json.dumps(scores))
            return True
        except Exception:
            pass
    return False


def render(level_name, grid, ball, elapsed_s, best_s):
    clear_screen()
    print("Tilt Maze - {}".format(level_name))
    print("Move by tilting badge. Reach G. # = wall")
    print("Time: {:.1f}s | Best: {}".format(elapsed_s, "--" if best_s is None else "{:.1f}s".format(best_s)))
    print()
    for y, row in enumerate(grid):
        out = []
        for x, c in enumerate(row):
            if (x, y) == ball:
                out.append("O")
            elif c == "S":
                out.append(".")
            else:
                out.append(c)
        print("".join(out))


def try_move(grid, pos, dx, dy):
    x, y = pos
    nx, ny = x + dx, y + dy
    if ny < 0 or ny >= len(grid) or nx < 0 or nx >= len(grid[0]):
        return pos
    if grid[ny][nx] == "#":
        return pos
    return (nx, ny)


def tilt_to_step(acc):
    if not acc:
        return (0, 0)
    x, y, _ = acc
    dx = 0
    dy = 0
    # y tilt -> vertical movement, x tilt -> horizontal movement
    if y > TILT_THRESHOLD:
        dy = 1
    elif y < -TILT_THRESHOLD:
        dy = -1

    if x > TILT_THRESHOLD:
        dx = 1
    elif x < -TILT_THRESHOLD:
        dx = -1

    # avoid diagonal sprinting; prefer stronger axis
    if dx and dy:
        if abs(x) > abs(y):
            dy = 0
        else:
            dx = 0
    return (dx, dy)


def play_level(board, idx, scores):
    level = LEVELS[idx]
    grid = level["grid"]
    start = find_char(grid, "S")
    goal = find_char(grid, "G")
    if not start or not goal:
        return False

    ball = start
    level_key = "level_{}".format(idx + 1)
    best = scores.get(level_key)

    t0 = ticks_ms()
    while True:
        elapsed = ticks_diff(ticks_ms(), t0) / 1000.0
        render(level["name"], grid, ball, elapsed, best)

        if ball == goal:
            print("\n✅ Level complete in {:.2f}s".format(elapsed))
            if (best is None) or (elapsed < best):
                scores[level_key] = round(elapsed, 2)
                save_scores(scores)
                print("🏆 New best time!")
            sleep_ms(1400)
            return True

        acc = board.read_accel_mg()
        dx, dy = tilt_to_step(acc)
        if dx or dy:
            ball = try_move(grid, ball, dx, dy)

        sleep_ms(TICK_MS)


def run():
    board = Fri3dBoard()
    scores = load_scores()

    clear_screen()
    print("Tilt Maze booting...")
    print("Board health:", board.health())
    sleep_ms(1200)

    for i in range(len(LEVELS)):
        ok = play_level(board, i, scores)
        if not ok:
            print("Level load error")
            return

    clear_screen()
    print("🎉 You finished all levels!")
    for i in range(len(LEVELS)):
        k = "level_{}".format(i + 1)
        v = scores.get(k)
        print("Level {} best: {}".format(i + 1, "--" if v is None else "{:.2f}s".format(v)))


if __name__ == "__main__":
    run()
