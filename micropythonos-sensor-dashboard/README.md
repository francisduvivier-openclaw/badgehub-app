# Sensor Dashboard (fri3d_2024) for MicroPythonOS

MVP app scaffold for a `fri3d_2024` board.

## What this does

- Displays a live dashboard with:
  - Temperature (°C)
  - Humidity (%)
  - Light (lux)
  - Battery (%)
  - Motion state
  - SD card status (plugged in + used/total)
  - Last update time
- Auto-refreshes every second
- Uses a board adapter (`board_fri3d_2024.py`) so hardware specifics stay isolated

## Files

- `app/main.py` – app entry point + dashboard loop
- `app/board_fri3d_2024.py` – sensor wiring layer (currently safe defaults + examples)

## Integrate on real hardware

1. Copy the `app/` files into your MicroPythonOS app folder.
2. Open `app/board_fri3d_2024.py`.
3. Replace stub methods with your board-specific sensor drivers:
   - temperature/humidity sensor (e.g. SHT3x, BME280, AHT20)
   - light sensor (e.g. BH1750)
   - accelerometer/IMU (for motion)
   - battery ADC read
4. Keep method signatures the same so UI code remains unchanged.

## Notes

- The app is intentionally framework-light so it works even if your exact MicroPythonOS UI API differs.
- If you share your exact `fri3d_2024` pinout + onboard sensors, I can wire the full driver implementation next.
