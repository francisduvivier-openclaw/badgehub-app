"""
Board adapter for fri3d_2024.

Replace internals with your actual sensor wiring.
Method signatures are stable for the dashboard UI.
"""

try:
    import machine
except Exception:
    machine = None

try:
    import time
except Exception:
    import utime as time


class Fri3d2024Board:
    def __init__(self):
        self._boot_ms = time.ticks_ms() if hasattr(time, "ticks_ms") else 0
        self._last_motion = False

        # Example placeholders. Adjust for your board:
        self.i2c = None
        self.adc = None

        if machine:
            # Example I2C init (edit pins/freq for your board)
            # self.i2c = machine.I2C(0, scl=machine.Pin(9), sda=machine.Pin(8), freq=400000)

            # Example battery ADC (edit pin/attenuation for ESP32)
            # self.adc = machine.ADC(machine.Pin(1))
            # self.adc.atten(machine.ADC.ATTN_11DB)
            pass

    def read_temperature_c(self):
        """Return float temperature in Celsius or None."""
        # TODO: Replace with real sensor read
        return 22.5

    def read_humidity_pct(self):
        """Return float humidity % or None."""
        # TODO: Replace with real sensor read
        return 48.0

    def read_light_lux(self):
        """Return float lux or None."""
        # TODO: Replace with real sensor read
        return 130.0

    def read_battery_pct(self):
        """Return integer battery percentage 0..100 or None."""
        # Example ADC conversion stub:
        # if self.adc is None:
        #     return None
        # raw = self.adc.read()  # ESP32 legacy API (0..4095)
        # volts = (raw / 4095.0) * 3.3 * 2.0  # if voltage divider is 1:1
        # pct = int(max(0, min(100, (volts - 3.3) / (4.2 - 3.3) * 100)))
        # return pct
        return 87

    def read_motion(self):
        """Return bool motion state.

        If you have an IMU, map acceleration magnitude threshold to motion.
        """
        # TODO: Replace with real IMU/PIR logic
        elapsed = self._elapsed_seconds()
        self._last_motion = (elapsed % 8) < 2
        return self._last_motion

    def _elapsed_seconds(self):
        if hasattr(time, "ticks_ms") and self._boot_ms is not None:
            return time.ticks_diff(time.ticks_ms(), self._boot_ms) // 1000
        return int(time.time())

    def health(self):
        """Optional diagnostic data for debug screen."""
        out = {"i2c": "uninitialized"}
        try:
            if self.i2c:
                out["i2c"] = [hex(x) for x in self.i2c.scan()]
        except Exception as e:
            out["i2c_error"] = str(e)
        return out
