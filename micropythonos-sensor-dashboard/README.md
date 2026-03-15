# Sensor Dashboard (fri3d_2024) for MicroPythonOS

Real sensor dashboard app for Fri3d Badge 2024.

## Features

- Live dashboard (1s refresh)
- WSEN-ISDS IMU
  - Accelerometer `x/y/z` (mg)
  - Gyroscope `x/y/z` (dps)
  - IMU temperature (°C)
- Battery level (%)
- Motion indicator
- Joystick x/y values
- Onboard button states (A/B/X/Y/MENU/START)
- SD card status
  - plugged in / not detected
  - used / total storage

## Files

- `app/main.py` – app entry + dashboard loop
- `app/board_fri3d_2024.py` – Fri3d 2024 hardware adapter

## Hardware assumptions (Fri3d 2024)

- I2C: SDA=9, SCL=18
- IMU: WSEN-ISDS on I2C `0x6B` (fallback `0x6A`)
- Battery ADC pin: 13
- SD mounts on `/sd`, `/sdcard`, or `/mnt/sd`

## Run

Copy `app/` to your badge filesystem and run:

```python
import main
main.run()
```

or set it as your app entrypoint.

## Notes

- If Fri3d MicroPython helpers are available (`fri3d.badge.*`), this app uses them.
- Otherwise it falls back to `machine.I2C` / `machine.ADC`.
- If IMU values stay `--`, check I2C scan output from `Board health` and verify firmware/build includes I2C support.
