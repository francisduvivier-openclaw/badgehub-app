# HEARTBEAT.md

# BadgeHub uptime monitor

- Target: https://badgehub.eu
- Run an uptime check only if at least 60 minutes passed since the previous check.
- Check method: `curl -sS -o /dev/null -w "%{http_code} %{time_total}" https://badgehub.eu`.
- Store each check in `memory/badgehub-checks.jsonl` as one JSON object per line:
  - `ts_utc` (ISO timestamp)
  - `status_code` (integer; 0 on curl/network failure)
  - `response_ms` (integer milliseconds; null if unavailable)
  - `ok` (true if status_code is 200-399)
- If check is down (`ok=false`), immediately notify the user with a short alert including status code and response time.

## Daily report

- Once per day at 20:00 Europe/Berlin, send a report for the last 48 checks.
- Report format:
  - Title with date/time window
  - 48 lines (oldest → newest), each: icon + timestamp + response time + status code
  - Icons: 🟢 up, 🔴 down
  - Summary: uptime count/48, uptime %, avg/median/p95 response time for successful checks
- Record `last_report_date` in `memory/badgehub-monitor-state.json` to avoid duplicate reports on the same day.
