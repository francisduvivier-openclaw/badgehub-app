try:
    import machine
except Exception:
    machine = None


class Fri3dBoard:
    _WHO_AM_I = 0x0F
    _CTRL1_XL = 0x10
    _OUTX_L_XL = 0x28

    def __init__(self):
        self.i2c = None
        self.addr = None
        self._init_i2c()
        self._init_imu()

    def _init_i2c(self):
        try:
            from fri3d.badge.i2c import i2c
            self.i2c = i2c
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
        for a in (0x6B, 0x6A):
            try:
                who = self.i2c.readfrom_mem(a, self._WHO_AM_I, 1)[0]
                if who in (0x6A, 0x6C, 0x69):
                    self.addr = a
                    break
            except Exception:
                pass
        if self.addr is None:
            return
        try:
            # accel 26Hz, ±2g
            self.i2c.writeto_mem(self.addr, self._CTRL1_XL, bytes([0x20]))
        except Exception:
            pass

    @staticmethod
    def _i16(lo, hi):
        v = (hi << 8) | lo
        return v - 65536 if v & 0x8000 else v

    def read_accel_mg(self):
        if not self.i2c or self.addr is None:
            return None
        try:
            b = self.i2c.readfrom_mem(self.addr, self._OUTX_L_XL, 6)
            x = self._i16(b[0], b[1]) * 0.061
            y = self._i16(b[2], b[3]) * 0.061
            z = self._i16(b[4], b[5]) * 0.061
            return (x, y, z)
        except Exception:
            return None

    def health(self):
        out = {"imu_addr": self.addr, "i2c": None}
        try:
            if self.i2c:
                out["i2c"] = [hex(v) for v in self.i2c.scan()]
        except Exception as e:
            out["i2c_error"] = str(e)
        return out
