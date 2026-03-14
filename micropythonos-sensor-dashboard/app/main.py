"""
Sensor Dashboard app (fri3d_2024).

Runs as plain MicroPython loop; adapt render_* hooks to MicroPythonOS UI widgets.
"""

try:
    import utime as time
except Exception:
    import time

from board_fri3d_2024 import Fri3d2024Board


REFRESH_MS = 1000


def fmt(value, unit="", digits=1):
    if value is None:
        return "--"
    if isinstance(value, float):
        return ("{:0." + str(digits) + "f}").format(value) + unit
    return str(value) + unit


def now_label():
    # Portable-ish HH:MM:SS formatter for MicroPython
    try:
        t = time.localtime()
        return "{:02d}:{:02d}:{:02d}".format(t[3], t[4], t[5])
    except Exception:
        return "n/a"


def collect(board):
    return {
        "temp": board.read_temperature_c(),
        "hum": board.read_humidity_pct(),
        "lux": board.read_light_lux(),
        "bat": board.read_battery_pct(),
        "motion": board.read_motion(),
        "updated": now_label(),
    }


def render_console(data):
    # Replace this with MicroPythonOS UI draw/update logic.
    print("\n=== Sensor Dashboard (fri3d_2024) ===")
    print("Temp:    ", fmt(data["temp"], " °C"))
    print("Humidity:", fmt(data["hum"], " %"))
    print("Light:   ", fmt(data["lux"], " lx", digits=0))
    print("Battery: ", fmt(data["bat"], " %", digits=0))
    print("Motion:  ", "YES" if data["motion"] else "no")
    print("Updated: ", data["updated"])


def sleep_ms(ms):
    if hasattr(time, "sleep_ms"):
        time.sleep_ms(ms)
    else:
        time.sleep(ms / 1000)


def run():
    board = Fri3d2024Board()
    print("Starting Sensor Dashboard...")
    print("Board health:", board.health())

    while True:
        try:
            data = collect(board)
            render_console(data)
        except Exception as e:
            print("Dashboard error:", e)
        sleep_ms(REFRESH_MS)


if __name__ == "__main__":
    run()
