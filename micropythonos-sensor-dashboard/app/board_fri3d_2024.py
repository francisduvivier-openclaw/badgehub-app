"""
Real hardware adapter for Fri3d Badge 2024.

Sources used for pin/sensor choices:
- I2C: SDA=9, SCL=18
- IMU: WSEN-ISDS at I2C 0x6B (fallback 0x6A)
- Battery ADC pin: 13

This module prefers Fri3d MicroPython helper modules when available,
then falls back to plain machine.* APIs.
"""

try:
    import os
except Exception:
    os = None

try:
    import time
except Exception:
    import utime as time

try:
    import machine
except Exception:
    machine = None


class Fri3d2024Board:
    # WSEN-ISDS / LSM6-style register map
    _WHO_AM_I = 0x0F
    _CTRL1_XL = 0x10
    _CTRL2_G = 0x11
    _OUT_TEMP_L = 0x20
    _OUTX_L_G = 0x22
    _OUTX_L_XL = 0x28

    _IMU_ADDRS = (0x6B, 0x6A)

    # Sensitivity assuming ±2g and ±250dps
    _ACC_MG_PER_LSB = 0.061
    _GYRO_DPS_PER_LSB = 0.00875

    # Battery mapping from Fri3d Arduino examples
    _BAT_RAW_MIN = 1400
    _BAT_RAW_MAX = 2330

    def __init__(self):
        self.i2c = None
        self.imu_addr = None
        self.adc_bat = None
        self.joystick = None
        self.buttons = None
        self._last_motion = False

        self._init_i2c()
        self._init_imu()
        self._init_battery()
        self._init_inputs()

    def _init_i2c(self):
        # Prefer fri3d convenience module if present
        try:
            from fri3d.badge.i2c import i2c as fri3d_i2c
            self.i2c = fri3d_i2c
            return
        except Exception:
            pass

        if not machine:
            return

        try:
            self.i2c = machine.I2C(1, scl=machine.Pin(18), sda=machine.Pin(9), freq=400000)
        except Exception:
            try:
                self.i2c = machine.I2C(0, scl=machine.Pin(18), sda=machine.Pin(9), freq=400000)
            except Exception:
                self.i2c = None

    def _init_imu(self):
        if not self.i2c:
            return

        for addr in self._IMU_ADDRS:
            try:
                who = self.i2c.readfrom_mem(addr, self._WHO_AM_I, 1)[0]
                # WSEN-ISDS expected device id is 0x6A in Fri3d Arduino examples
                if who in (0x6A, 0x6C, 0x69):
                    self.imu_addr = addr
                    break
            except Exception:
                pass

        if self.imu_addr is None:
            return

        try:
            # 26 Hz ODR, accel ±2g
            self.i2c.writeto_mem(self.imu_addr, self._CTRL1_XL, bytes([0x20]))
            # 26 Hz ODR, gyro ±250 dps
            self.i2c.writeto_mem(self.imu_addr, self._CTRL2_G, bytes([0x20]))
        except Exception:
            pass

    def _init_battery(self):
        if not machine:
            return
        try:
            self.adc_bat = machine.ADC(machine.Pin(13))
            if hasattr(self.adc_bat, "atten") and hasattr(machine.ADC, "ATTN_11DB"):
                self.adc_bat.atten(machine.ADC.ATTN_11DB)
        except Exception:
            self.adc_bat = None

    def _init_inputs(self):
        try:
            from fri3d.badge.joystick import joystick
            self.joystick = joystick
        except Exception:
            self.joystick = None

        try:
            from fri3d.badge.buttons import buttons
            self.buttons = buttons
        except Exception:
            self.buttons = None

    @staticmethod
    def _to_i16(lo, hi):
        v = (hi << 8) | lo
        return v - 65536 if v & 0x8000 else v

    def _read_imu_vec3_i16(self, reg):
        if not self.i2c or self.imu_addr is None:
            return None
        try:
            b = self.i2c.readfrom_mem(self.imu_addr, reg, 6)
            x = self._to_i16(b[0], b[1])
            y = self._to_i16(b[2], b[3])
            z = self._to_i16(b[4], b[5])
            return (x, y, z)
        except Exception:
            return None

    def read_accel_mg(self):
        raw = self._read_imu_vec3_i16(self._OUTX_L_XL)
        if raw is None:
            return None
        return tuple(v * self._ACC_MG_PER_LSB for v in raw)

    def read_gyro_dps(self):
        raw = self._read_imu_vec3_i16(self._OUTX_L_G)
        if raw is None:
            return None
        return tuple(v * self._GYRO_DPS_PER_LSB for v in raw)

    def read_temperature_c(self):
        if not self.i2c or self.imu_addr is None:
            return None
        try:
            b = self.i2c.readfrom_mem(self.imu_addr, self._OUT_TEMP_L, 2)
            raw = self._to_i16(b[0], b[1])
            return 25.0 + (raw / 256.0)
        except Exception:
            return None

    def read_humidity_pct(self):
        return None

    def read_light_lux(self):
        return None

    def _read_battery_raw(self):
        if self.adc_bat is None:
            return None
        try:
            # Follow Fri3d Arduino approach: take max of multiple samples
            mx = 0
            for _ in range(5):
                r = self.adc_bat.read()
                if r > mx:
                    mx = r
            return mx
        except Exception:
            return None

    def read_battery_pct(self):
        raw = self._read_battery_raw()
        if raw is None:
            return None
        if raw < self._BAT_RAW_MIN:
            raw = self._BAT_RAW_MIN
        if raw > self._BAT_RAW_MAX:
            raw = self._BAT_RAW_MAX
        span = self._BAT_RAW_MAX - self._BAT_RAW_MIN
        return int((raw - self._BAT_RAW_MIN) * 100 / span) if span > 0 else None

    def read_motion(self):
        acc = self.read_accel_mg()
        if not acc:
            return False
        x, y, z = acc
        # crude motion heuristic: deviation from ~1g on z and lateral movement
        motion_score = abs(x) + abs(y) + abs(abs(z) - 1000)
        self._last_motion = motion_score > 220
        return self._last_motion

    def read_joystick(self):
        if not self.joystick:
            return None
        try:
            x = self.joystick.x.read() if self.joystick.x else None
            y = self.joystick.y.read() if self.joystick.y else None
            return {"x": x, "y": y}
        except Exception:
            return None

    def read_buttons(self):
        if not self.buttons:
            return None
        out = {}
        for name in ("a", "b", "x", "y", "menu", "start"):
            btn = getattr(self.buttons, name, None)
            if btn is None:
                continue
            try:
                out[name] = bool(btn.value())
            except Exception:
                out[name] = False
        return out

    def read_sd_status(self):
        mount_points = ("/sd", "/sdcard", "/mnt/sd")
        if not os:
            return {"present": False, "used_bytes": None, "total_bytes": None}

        for mp in mount_points:
            try:
                st = os.statvfs(mp)
                block_size = st[0]
                total_blocks = st[2]
                free_blocks = st[3]
                total = block_size * total_blocks
                free = block_size * free_blocks
                used = total - free
                return {
                    "present": True,
                    "used_bytes": used,
                    "total_bytes": total,
                }
            except Exception:
                pass

        return {
            "present": False,
            "used_bytes": None,
            "total_bytes": None,
        }

    def health(self):
        out = {"i2c": "uninitialized", "imu_addr": self.imu_addr}
        try:
            if self.i2c:
                out["i2c"] = [hex(x) for x in self.i2c.scan()]
        except Exception as e:
            out["i2c_error"] = str(e)
        out["battery_adc"] = self.adc_bat is not None
        out["joystick"] = self.joystick is not None
        out["buttons"] = self.buttons is not None
        return out
