# MEMORY.md

## Durable environment notes

- GitHub CLI is available as `/home/node/.local/bin/gh` (not on default PATH).
- Prefer absolute path for gh commands, e.g. `/home/node/.local/bin/gh pr create ...`.
- Fallback PR creation remains: push branch and share `https://github.com/<fork>/<repo>/pull/new/<branch>`.

## Operational guardrail

- Avoid shell command strings containing unescaped backticks in PR bodies/titles because shell command substitution can produce noisy/misleading errors.

## Tooling lesson: Playwright in this container

- `require('playwright')` failed initially because the workspace did not have Playwright installed as a dependency.
- Working sequence in this environment:
  1. `npm install playwright`
  2. `npx playwright install chromium`
  3. Run scripts with `node` + `require('playwright')`.
- Sanity check that worked: launch Chromium headless, open YouTube URL, read `window.ytInitialPlayerResponse`.
- `npx playwright --version` can succeed even when `require('playwright')` fails, because npx may use a temporary package; local install is still needed for scripts.

## User preference: package manager

- User preference: always use `pnpm` by default (not npm) across workspaces/sessions.
- If `pnpm` is missing, install/activate with Corepack:
  1. `corepack enable`
  2. `corepack prepare pnpm@latest --activate`
  3. verify with `pnpm --version`
- For monorepos, add `pnpm-workspace.yaml` (e.g. `packages/*`) to avoid workspace warnings.
- Migration note: when switching from npm to pnpm, pnpm may move previously npm-installed deps to `node_modules/.ignored`; then run `pnpm install`.
- Verified in this environment: pnpm v10.32.0 installed and `pnpm install --ignore-scripts` completed successfully.

## User preference (PR discipline)

- For any branch/PR work: always push commits promptly and follow up on CI/PR build status until green or until blockers are clearly reported.
- Default PR target is the personal fork; only open upstream PRs when explicitly requested.
- Do not stop at "changes pushed"; include build/check follow-through as part of completion.
- If checks are pending, schedule a delayed re-check (e.g. sleep + check) and proactively report status updates without being asked again.
- Treat missed follow-up as a process failure and correct it immediately in-session.
