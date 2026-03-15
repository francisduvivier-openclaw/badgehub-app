"""
Sensor Dashboard app (fri3d_2024) - real hardware version.

- WSEN-ISDS IMU (accel/gyro/temp)
- Battery percentage
- Joystick + button states
- SD-card status and storage usage
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


def fmt_bytes(n):
    if n is None:
        return "--"
    units = ("B", "KB", "MB", "GB")
    i = 0
    x = float(n)
    while x >= 1024 and i < len(units) - 1:
        x /= 1024.0
        i += 1
    return "{:.1f} {}".format(x, units[i]) if i > 0 else "{} {}".format(int(x), units[i])


def fmt_vec3(vec, digits=1):
    if vec is None:
        return "-- / -- / --"
    return " / ".join(fmt(v, "", digits) for v in vec)


def now_label():
    try:
        t = time.localtime()
        return "{:02d}:{:02d}:{:02d}".format(t[3], t[4], t[5])
    except Exception:
        return "n/a"


def collect(board):
    sd = board.read_sd_status()
    return {
        "temp": board.read_temperature_c(),
        "acc": board.read_accel_mg(),
        "gyro": board.read_gyro_dps(),
        "bat": board.read_battery_pct(),
        "motion": board.read_motion(),
        "joy": board.read_joystick(),
        "buttons": board.read_buttons(),
        "sd_present": sd.get("present", False),
        "sd_used": sd.get("used_bytes"),
        "sd_total": sd.get("total_bytes"),
        "updated": now_label(),
    }


def render_console(data):
    print("\n=== Sensor Dashboard (fri3d_2024) ===")
    print("Temp:    ", fmt(data["temp"], " °C"))
    print("Accel mg:", fmt_vec3(data["acc"], 0), "(x / y / z)")
    print("Gyro dps:", fmt_vec3(data["gyro"], 1), "(x / y / z)")
    print("Battery: ", fmt(data["bat"], " %", digits=0))
    print("Motion:  ", "YES" if data["motion"] else "no")

    joy = data["joy"]
    if joy:
        print("Joystick:", "x={} y={}".format(joy.get("x", "--"), joy.get("y", "--")))
    else:
        print("Joystick:", "--")

    btn = data["buttons"] or {}
    if btn:
        pressed = [k.upper() for k, v in btn.items() if v]
        print("Buttons: ", ", ".join(pressed) if pressed else "none")
    else:
        print("Buttons: ", "--")

    if data["sd_present"]:
        print("SD card: ", "plugged in")
        print("SD used: ", "{} / {}".format(fmt_bytes(data["sd_used"]), fmt_bytes(data["sd_total"])))
    else:
        print("SD card: ", "not detected")

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
