# DevSpace Enhanced Phase 0 Baseline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish a clean, reproducible, installable official DevSpace `v1.0.5` source baseline in the user's fork before any feature work or Python PoC migration begins.

**Architecture:** Keep the official Git history intact, use `origin` for `AuRevior-ai/devspace` and `upstream` for `Waishnav/devspace`, and base the enhancement branch on the exact npm `1.0.5` source commit. Verify the source checkout through the official dependency lock, typecheck, test, build, package, CLI, and isolated server startup paths without replacing the globally installed service on port `7676`.

**Tech Stack:** Git/GitHub CLI, Node.js 24, npm 11, TypeScript, Vite, tsx, PowerShell for an isolated Windows startup smoke test.

---

## Fixed Baseline Inputs

- Local repository: `D:\use_as_desktop\devspace-enhanced`
- Official upstream: `https://github.com/Waishnav/devspace.git`
- User fork: `https://github.com/AuRevior-ai/devspace.git`
- Official tag: `v1.0.5`
- Exact source commit: `dca3b6a345a9285e63446d72376afdafe8c72af4`
- Enhancement branch: `enhanced/main`
- Existing production service: globally installed `@waishnav/devspace@1.0.5` on port `7676`
- Baseline smoke-test port: `17676`

## Files Created by Phase 0

- Create: `docs/superpowers/plans/2026-08-05-devspace-enhanced-phase-0-baseline.md`
  - Exact execution checklist for the official-source baseline.
- Create: `docs/superpowers/baselines/2026-08-05-official-v1.0.5.md`
  - Actual commands, versions, commit identity, verification results, package evidence, startup evidence, and remaining limitations.

No production source file is modified in Phase 0.

### Task 1: Establish the Official Fork and Local Checkout

**Files:** None.

- [x] **Step 1: Confirm the target path is unused**

Run:

```bash
powershell.exe -NoProfile -Command 'Test-Path -LiteralPath "D:\use_as_desktop\devspace-enhanced"'
```

Expected before cloning: `False`.

- [x] **Step 2: Create the GitHub fork**

Run:

```bash
gh repo fork Waishnav/devspace --clone=false
```

Expected: the command prints `https://github.com/AuRevior-ai/devspace`.

- [x] **Step 3: Clone the user fork**

Run from `D:\`:

```bash
git clone https://github.com/AuRevior-ai/devspace.git D:/use_as_desktop/devspace-enhanced
```

Expected: a new Git checkout appears at the approved local path.

- [x] **Step 4: Verify the initial clone identity**

Run:

```bash
git remote -v
git branch --show-current
git rev-parse HEAD
```

Expected:

- `origin` points to `AuRevior-ai/devspace`;
- initial branch is `main`;
- initial HEAD matches the current fork default branch before the baseline branch is created.

### Task 2: Lock the Branch to Official `v1.0.5`

**Files:** None.

- [x] **Step 1: Add the official upstream remote**

Run:

```bash
git remote add upstream https://github.com/Waishnav/devspace.git
git fetch upstream --tags
```

Expected: `upstream/main` and official tags are available locally.

- [x] **Step 2: Create the enhancement branch from the official tag**

Run:

```bash
git checkout -b enhanced/main v1.0.5
```

Expected: Git reports a new branch named `enhanced/main`.

- [x] **Step 3: Verify the exact source commit**

Run:

```bash
git rev-parse HEAD
git describe --tags --exact-match HEAD
git status --short
```

Expected:

```text
dca3b6a345a9285e63446d72376afdafe8c72af4
v1.0.5
```

The worktree must be clean before documentation is added.

### Task 3: Record the Toolchain and Install Locked Dependencies

**Files:**
- Verify: `package.json`
- Verify: `package-lock.json`

- [ ] **Step 1: Record the local toolchain**

Run:

```bash
node --version
npm --version
git --version
gh --version
```

Expected:

- Node satisfies `>=22.19 <27` from `package.json`;
- npm and Git report usable versions;
- GitHub CLI is authenticated as `AuRevior-ai`.

- [ ] **Step 2: Verify package identity and lockfile identity**

Run:

```bash
node -p "const p=require('./package.json'); JSON.stringify({name:p.name,version:p.version,engines:p.engines,scripts:Object.keys(p.scripts)},null,2)"
node -p "const p=require('./package-lock.json'); JSON.stringify({name:p.name,version:p.version,lockfileVersion:p.lockfileVersion},null,2)"
```

Expected: both files identify `@waishnav/devspace` version `1.0.5`; lockfile version is `3`.

- [ ] **Step 3: Install exactly from the lockfile**

Run:

```bash
npm ci
```

Expected: exit code `0`; postinstall may report the Windows `node-pty` permission path but must not fail.

- [ ] **Step 4: Prove installation did not rewrite tracked dependency metadata**

Run:

```bash
git diff --exit-code -- package.json package-lock.json
```

Expected: exit code `0` and no diff.

### Task 4: Run the Official Verification Gates

**Files:** No source modifications.

- [ ] **Step 1: Run TypeScript type checking**

Run:

```bash
npm run typecheck
```

Expected: exit code `0` with no TypeScript errors.

- [ ] **Step 2: Run the complete official test script**

Run:

```bash
npm test
```

Expected: exit code `0`; every test command listed in `package.json` completes successfully.

- [ ] **Step 3: Run the production build**

Run:

```bash
npm run build
```

Expected: exit code `0`; Vite app assets and TypeScript server output are produced under `dist/`.

- [ ] **Step 4: Confirm tracked source remains unchanged**

Run:

```bash
git status --short
git diff --check
```

Expected: only the Phase 0 documentation files are untracked or modified; no official source file or lockfile is changed.

### Task 5: Verify Package and CLI Behavior

**Files:** No source modifications.

- [ ] **Step 1: Inspect the npm package payload without publishing**

Run:

```bash
npm pack --dry-run --json
```

Expected: exit code `0`; package name is `@waishnav/devspace`, version is `1.0.5`, and payload includes `dist`, `docs`, `examples`, `scripts`, `skills`, and `README.md` as configured by `package.json`.

- [ ] **Step 2: Verify the built CLI version**

Run:

```bash
node dist/cli.js --version
```

Expected: `1.0.5`.

- [ ] **Step 3: Verify the built CLI help surface**

Run:

```bash
node dist/cli.js --help
```

Expected: exit code `0` and commands including `serve`, `init`, `doctor`, `config`, and `agents`.

- [ ] **Step 4: Run the read-only doctor command**

Run:

```bash
node dist/cli.js doctor
```

Expected: exit code `0`; output records Node, Git, Bash, SQLite, config paths, MCP URL, and allowed roots without changing the persisted configuration.

### Task 6: Run an Isolated Server Startup Smoke Test

**Files:** No tracked files. Temporary state is created only under the Windows temporary directory and removed after the test.

- [ ] **Step 1: Confirm the smoke-test port is unused**

Run:

```powershell
powershell.exe -NoProfile -Command 'if (Get-NetTCPConnection -LocalPort 17676 -State Listen -ErrorAction SilentlyContinue) { exit 1 } else { exit 0 }'
```

Expected: exit code `0`.

- [ ] **Step 2: Start the built server on isolated settings, probe it, and stop it**

Run from the repository root:

```powershell
powershell.exe -NoProfile -Command '$root = Join-Path $env:TEMP "devspace-phase0-baseline"; Remove-Item -LiteralPath $root -Recurse -Force -ErrorAction SilentlyContinue; New-Item -ItemType Directory -Path $root | Out-Null; $env:HOST = "127.0.0.1"; $env:PORT = "17676"; $env:DEVSPACE_CONFIG_DIR = Join-Path $root "config"; $env:DEVSPACE_STATE_DIR = Join-Path $root "state"; $env:DEVSPACE_WORKTREE_ROOT = Join-Path $root "worktrees"; $env:DEVSPACE_OAUTH_OWNER_TOKEN = "phase0-baseline-owner-token"; $env:DEVSPACE_ALLOWED_ROOTS = "D:\use_as_desktop\devspace-enhanced"; $env:DEVSPACE_PUBLIC_BASE_URL = "http://127.0.0.1:17676"; $stdout = Join-Path $root "stdout.log"; $stderr = Join-Path $root "stderr.log"; $process = Start-Process -FilePath node -ArgumentList "dist/cli.js", "serve" -WorkingDirectory (Get-Location) -PassThru -RedirectStandardOutput $stdout -RedirectStandardError $stderr; try { $ready = $false; for ($i = 0; $i -lt 20; $i++) { Start-Sleep -Milliseconds 250; if (Get-NetTCPConnection -LocalPort 17676 -State Listen -ErrorAction SilentlyContinue) { $ready = $true; break }; if ($process.HasExited) { break } }; if (-not $ready) { Get-Content $stdout -ErrorAction SilentlyContinue; Get-Content $stderr -ErrorAction SilentlyContinue; exit 1 }; "SMOKE_LISTENING=YES"; Get-Content $stdout } finally { if (-not $process.HasExited) { Stop-Process -Id $process.Id -Force }; Wait-Process -Id $process.Id -ErrorAction SilentlyContinue; Remove-Item -LiteralPath $root -Recurse -Force -ErrorAction SilentlyContinue }'
```

Expected:

- `SMOKE_LISTENING=YES`;
- output states `devspace listening on http://127.0.0.1:17676/mcp`;
- the process is stopped;
- port `7676` and the globally installed production service are untouched;
- temporary smoke-test state is removed.

- [ ] **Step 3: Confirm both port isolation and cleanup**

Run:

```powershell
powershell.exe -NoProfile -Command 'if (Get-NetTCPConnection -LocalPort 17676 -State Listen -ErrorAction SilentlyContinue) { exit 1 }; if (Test-Path -LiteralPath (Join-Path $env:TEMP "devspace-phase0-baseline")) { exit 1 }; exit 0'
```

Expected: exit code `0`.

### Task 7: Write the Official Baseline Record

**Files:**
- Create: `docs/superpowers/baselines/2026-08-05-official-v1.0.5.md`

- [ ] **Step 1: Write the baseline evidence document**

The document must contain these exact sections:

```markdown
# Official DevSpace v1.0.5 Baseline

## Source Identity
## Git Topology
## Local Toolchain
## Dependency Installation
## Typecheck
## Tests
## Build
## Package Payload
## CLI Verification
## Isolated Startup Smoke Test
## Production-Service Isolation
## Baseline Conclusion
## Known Limits
```

Record actual commands, exit results, version strings, the exact source commit, the branch name, and any warnings. Do not claim that a later enhancement works; this document proves only the untouched official source baseline.

- [ ] **Step 2: Self-review the evidence document**

Run:

```bash
rg -n "TBD|TODO|PLACEHOLDER|not yet run|should pass" docs/superpowers/baselines/2026-08-05-official-v1.0.5.md
git diff --check
```

Expected: the placeholder search has no matches and `git diff --check` exits `0`.

### Task 8: Commit and Publish the Baseline Branch

**Files:**
- Add: `docs/superpowers/plans/2026-08-05-devspace-enhanced-phase-0-baseline.md`
- Add: `docs/superpowers/baselines/2026-08-05-official-v1.0.5.md`

- [ ] **Step 1: Inspect the final Phase 0 diff**

Run:

```bash
git status --short
git diff --stat
git diff -- docs/superpowers/plans/2026-08-05-devspace-enhanced-phase-0-baseline.md docs/superpowers/baselines/2026-08-05-official-v1.0.5.md
```

Expected: only the two Phase 0 documentation files are part of the intended commit.

- [ ] **Step 2: Commit the Phase 0 evidence**

Run:

```bash
git add docs/superpowers/plans/2026-08-05-devspace-enhanced-phase-0-baseline.md docs/superpowers/baselines/2026-08-05-official-v1.0.5.md
git commit -m "docs: record official devspace baseline"
```

Expected: one commit containing only the two documentation files.

- [ ] **Step 3: Re-run the minimum post-commit verification**

Run:

```bash
git status --short
git rev-parse HEAD
git log -1 --oneline
```

Expected: clean worktree and a new documentation commit on `enhanced/main`.

- [ ] **Step 4: Push the enhancement branch to the user fork**

Run:

```bash
git push -u origin enhanced/main
```

Expected: `origin/enhanced/main` is created and the local branch tracks it.

## Phase 0 Completion Gate

Phase 0 is complete only when all of the following are true:

1. `D:\use_as_desktop\devspace-enhanced` contains official Git history.
2. `origin` and `upstream` point to the approved repositories.
3. `enhanced/main` descends exactly from official `v1.0.5` commit `dca3b6a345a9285e63446d72376afdafe8c72af4`.
4. `npm ci`, `npm run typecheck`, `npm test`, and `npm run build` all exit `0`.
5. `npm pack --dry-run --json` confirms an installable npm payload.
6. built CLI version, help, and doctor paths run successfully.
7. the source-built server listens successfully on isolated port `17676` and is then terminated cleanly.
8. the existing global DevSpace service on port `7676` is never replaced or stopped.
9. the baseline evidence document contains actual results with no placeholders.
10. the documentation-only commit is pushed to `origin/enhanced/main`.

Feature work, permission changes, notifications, and browser-worker migration remain blocked until this gate is satisfied.
