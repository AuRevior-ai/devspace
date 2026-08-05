# DevSpace Enhanced Feature Register

**Date created:** 2026-08-05  
**Status:** Active  
**Repository:** `AuRevior-ai/devspace`  
**Primary branch:** `enhanced/main`  
**Product specification:** `../specs/2026-08-05-devspace-enhanced-product-design.md`

## 1. Purpose

This register is the live source of truth for enhancement status. It separates
planned product scope from implementation reality and records the evidence still
required before a feature may be considered complete or ready for public use.

The register must be updated when:

- a feature is proposed or its scope changes;
- implementation begins;
- a test or real acceptance gate changes status;
- a public-release gap is discovered;
- a relevant commit, plan, baseline, or Git Note is created;
- a feature is merged, deployed, deprecated, or retired.

## 2. Status Vocabulary

| Status | Meaning |
|---|---|
| `proposed` | Intent is known, but architecture is not yet approved. |
| `approved` | Product and architecture direction are approved; implementation has not started. |
| `in_progress` | Implementation or migration is actively underway. |
| `partial` | A useful bounded behavior is implemented, but declared scope or public-release coverage is incomplete. |
| `blocked` | Work cannot proceed until a dependency or capability gate is resolved. |
| `verified` | Declared scope is implemented and has fresh automated and applicable real-world evidence. |
| `deployed` | Verified behavior is installed in the production fork runtime. |
| `reference_only` | Retained as historical evidence or a migration oracle, not the target runtime. |
| `retired` | Replaced and no longer required for active operation. |

A feature is not `verified` merely because code exists or a unit test passes. The
entry must satisfy its listed verification and acceptance gates.

## 3. Safety Classes

| Class | Meaning |
|---|---|
| `S0` | Documentation or read-only inspection. |
| `S1` | Local bounded behavior with no intended project mutation. |
| `S2` | Workspace mutation under exact scope and authorization. |
| `S3` | High-impact external, destructive, credential, account, deployment, publication, or history-changing behavior. |

S3 features remain blocked by default unless a separately approved flow is
created.

## 4. Summary Matrix

| ID | Feature | Status | Safety | Current milestone |
|---|---|---:|---:|---|
| BASE-001 | Official source fork and reproducible baseline | `verified` | S1 | Phase 0 complete |
| SHELL-001 | Explicit nonstandard Shell path | `verified` | S1 | Merged and verified on `enhanced/main` |
| SHELL-002 | Public cross-machine Shell Resolver | `approved` | S1 | Phase 1 candidate |
| POLICY-001 | Structured command impact policy | `approved` | S2 | Phase 1 design pending |
| GIT-001 | Safe Git inspection operations | `approved` | S1 | Phase 1 design pending |
| GIT-002 | Authorized staging and commit workflow | `approved` | S2 | Phase 1 design pending |
| TASK-001 | Durable task lifecycle and event log | `approved` | S1 | Phase 2/3 dependency |
| NOTIFY-001 | Notification adapter and redaction policy | `approved` | S1 | Phase 2 |
| NOTIFY-002 | Windows notification and local task destination | `approved` | S1 | Phase 2 |
| ORCH-001 | Typed task protocol and domain model migration | `approved` | S1 | Phase 3 |
| ORCH-002 | Scheduler, idempotency, locks, and verification | `approved` | S2 | Phase 3 |
| BROWSER-001 | Browser Worker integration boundary | `approved` | S2 | Phase 4 |
| BROWSER-002 | Browser session identity and recovery | `approved` | S2 | Phase 4 |
| CAP-001 | PoC A-D capability probes | `partial` | S2 | PoC A passed; B unresolved; C/D pending |
| MULTI-001 | Capability-gated two-Worker scheduling | `blocked` | S2 | Blocked by CAP-001 and ORCH-002 |
| PKG-001 | Fork package identity and reproducible artifact | `approved` | S2 | Phase 6 |
| CUTOVER-001 | Install, health check, and rollback | `approved` | S3 | Blocked until release gates pass |
| MIG-001 | Behavioral migration from Python PoC | `approved` | S2 | Design and mapping established; implementation not started |
| POC-RETIRE-001 | Python PoC retirement | `blocked` | S2 | Blocked until replacement gates pass |

## 5. Feature Records

### BASE-001 — Official Source Fork and Reproducible Baseline

**Status:** `verified`  
**Safety class:** S1  
**Phase:** 0

**Goal**

Create a real fork that preserves official history and can be built, tested,
packaged, started, and rolled back independently of the existing global install.

**Current official behavior**

Official `@waishnav/devspace@1.0.5` is distributed as an npm package. The former
Python PoC was not a source fork and could not replace or synchronize with the
official repository.

**Implemented behavior**

- formal local checkout at `D:\use_as_desktop\devspace-enhanced`;
- `origin` is `AuRevior-ai/devspace`;
- `upstream` is `Waishnav/devspace`;
- `enhanced/main` inherits the exact `v1.0.5` source baseline;
- official dependency install, typecheck, test, build, package, CLI, and isolated
  startup paths were exercised;
- production port `7676` and the global official install were not replaced.

**Verification evidence**

- baseline commit: `fb55f66a896ea499387867aad81ff9113affc790`;
- plan: `../plans/2026-08-05-devspace-enhanced-phase-0-baseline.md`;
- record: `../baselines/2026-08-05-official-v1.0.5.md`.

**Remaining gaps**

None for Phase 0. Later package and cutover behavior are tracked separately.

---

### SHELL-001 — Explicit Nonstandard Shell Path

**Status:** `verified`  
**Safety class:** S1  
**Phase:** 1

**Bounded scope**

This entry covers only the case where a user explicitly supplies
`DEVSPACE_SHELL_PATH`. Automatic discovery of arbitrary nonstandard
installations is tracked by SHELL-002.

**Goal**

Ensure an explicitly configured Bash executable is used consistently by both
DevSpace diagnostics and real workspace shell execution.

**Current official behavior**

Official version `1.0.5` calls shell discovery without consuming the existing
`DEVSPACE_SHELL_PATH` launcher configuration. A custom Git Bash path may work in
a specially prepared service process while `devspace doctor` still reports Bash
as unavailable.

**Implemented behavior**

- a shared `configuredShellPath()` reads and trims `DEVSPACE_SHELL_PATH`;
- `doctor` passes the configured path to shell resolution;
- `runShellTool` passes the same path to the real Bash tool;
- configuration documentation lists the environment variable;
- regression tests cover diagnostic use and a missing configured executable.

**Verification evidence**

- implementation commit: `a4089ad2d0ca7d563be251bae836437eb3bac727`;
- merged branch: `enhanced/main`;
- real path verified:
  `D:\Ubuntu双系统备份\E盘完整备份\Git\bin\bash.exe`;
- verified characteristics: non-system drive and Unicode path;
- full typecheck, official tests, build, and `doctor` completed after merge.

**External review memory**

```text
Git Notes ref: refs/notes/devspace-enhanced
Bound commit: a4089ad2d0ca7d563be251bae836437eb3bac727
```

**Out-of-scope public follow-up**

Automatic discovery, normalization, and executable probing are deliberately
tracked by SHELL-002. They do not invalidate the verified bounded behavior of
SHELL-001.

**Next action**

Implement SHELL-002 rather than extending this feature with ad hoc candidate
rules.

---

### SHELL-002 — Public Cross-Machine Shell Resolver

**Status:** `approved`  
**Safety class:** S1  
**Phase:** 1

**Goal**

Provide deterministic, explainable, and validated Bash discovery for public
Windows use without recursively scanning disks.

**Expected resolution order**

1. persisted `shellPath`;
2. `DEVSPACE_SHELL_PATH`;
3. Git for Windows registry metadata;
4. root derived from `git.exe` on `PATH`;
5. standard `Program Files` candidates;
6. `bash.exe` on `PATH`;
7. diagnostic failure with attempted candidate classes.

**Candidate requirements**

- absolute normalized path;
- Unicode and spaces preserved;
- matching outer quotes handled;
- relative paths rejected;
- executable must pass `--version` and `-c` probes;
- errors must avoid leaking unrelated environment contents.

**Dependencies**

- SHELL-001;
- configuration schema decision;
- Windows registry adapter and test seam.

**Verification gates**

- deterministic unit tests for precedence and normalization;
- Windows integration tests for registry and `git.exe` derivation;
- real tests for standard path, nonstandard drive, Unicode, spaces, missing file,
  invalid executable, Cygwin/MSYS2, and relevant WSL behavior;
- full official test and build suite.

**Public-release gate**

No documentation may claim broad automatic nonstandard-path support until this
entry becomes `verified`.

---

### POLICY-001 — Structured Command Impact Policy

**Status:** `approved`  
**Safety class:** S2  
**Phase:** 1

**Goal**

Replace coarse executable-name or command-string restrictions with structured
operation intent and impact classification.

**Required behavior**

- classify read-only, workspace-mutating, and high-impact operations;
- bind approval to workspace, paths, operation, and material parameters;
- reject attempts to smuggle additional commands through quoting, chaining, or
  shell expansion;
- emit audit-safe policy decisions;
- keep S3 operations blocked unless separately approved.

**Dependencies**

- current MCP tool boundaries;
- existing shell execution path;
- authorization UX design.

**Verification gates**

- policy table tests;
- bypass and command-composition tests;
- workspace-boundary tests;
- negative tests for push, destructive history, deployment, credential access,
  and out-of-workspace commands.

---

### GIT-001 — Safe Git Inspection Operations

**Status:** `approved`  
**Safety class:** S1  
**Phase:** 1

**Goal**

Make common Git status, diff, log, branch, and worktree inspection explicit,
reliable, and auditable without granting mutation permission.

**Required behavior**

- exact workspace binding;
- structured result fields where practical;
- no implicit fetch, checkout, staging, or cleanup;
- support for reviewing unrelated existing changes before implementation.

**Dependencies**

- POLICY-001.

**Verification gates**

- repositories with clean, dirty, untracked, detached, and worktree states;
- path names containing spaces and Unicode;
- no mutation before and after each inspection test.

---

### GIT-002 — Authorized Staging and Commit Workflow

**Status:** `approved`  
**Safety class:** S2  
**Phase:** 1

**Goal**

Allow a user-authorized local commit without granting implicit push or staging
unrelated work.

**Required behavior**

- exact list of staged paths visible before commit;
- commit message visible before commit;
- unrelated existing modifications excluded;
- sensitive file and secret checks;
- commit identity and result recorded;
- no implicit push, tag, merge, or history rewrite.

**Dependencies**

- POLICY-001;
- GIT-001;
- user approval model.

**Verification gates**

- mixed related and unrelated changes;
- untracked sensitive files;
- hooks that fail;
- empty staging set;
- detached HEAD;
- repository with nested worktrees;
- explicit proof that no remote update occurs.

---

### TASK-001 — Durable Task Lifecycle and Event Log

**Status:** `approved`  
**Safety class:** S1  
**Phase:** 2/3

**Goal**

Persist task, attempt, command, event, user-decision, and verification state so
long-running operations can recover without duplicate execution.

**Required behavior**

```text
queued -> running -> waiting_for_user | failed | completed
```

- append-only auditable events;
- stable IDs and idempotency keys;
- stale-attempt rejection;
- recovery after process restart;
- redacted persistence.

**Dependencies**

- persistence schema decision;
- migration behavior from Python `task_store.py` and models.

**Verification gates**

- restart recovery;
- duplicate command delivery;
- stale attempt;
- corrupted or incomplete event sequence;
- concurrent readers;
- redaction checks.

---

### NOTIFY-001 — Notification Adapter and Redaction Policy

**Status:** `approved`  
**Safety class:** S1  
**Phase:** 2

**Goal**

Define a platform-neutral notification interface and safe payload contract.

**Required behavior**

Notify on:

- completion;
- failure;
- authorization required;
- user decision required;
- recovery failure;
- Worker capability downgrade.

Payloads may include only a safe title, workspace label, status summary, and
local destination identifier.

**Dependencies**

- TASK-001.

**Verification gates**

- payload redaction tests;
- duplicate suppression;
- adapter failure does not change task truth;
- notification content excludes prompts, replies, tokens, cookies, and file
  contents.

---

### NOTIFY-002 — Windows Notification and Local Task Destination

**Status:** `approved`  
**Safety class:** S1  
**Phase:** 2

**Goal**

Deliver Windows completion, failure, and attention notifications that open a
local task-status surface.

**Required behavior**

- installation-safe Windows adapter;
- click opens a local DevSpace destination;
- no dependence on an unstable ChatGPT URL;
- precise ChatGPT navigation remains optional until session mapping is verified.

**Dependencies**

- NOTIFY-001;
- TASK-001;
- local task-status UI or route.

**Verification gates**

- real Windows notification delivery;
- click routing;
- no secrets in shell command lines or toast payloads;
- behavior when notifications are disabled or unavailable.

---

### ORCH-001 — Typed Task Protocol and Domain Model Migration

**Status:** `approved`  
**Safety class:** S1  
**Phase:** 3

**Goal**

Port observable protocol behavior from Python into TypeScript schemas and domain
models.

**Python references**

- `task_protocol.py`;
- `models.py`;
- relevant Python protocol tests.

**Required behavior**

- typed task, attempt, command, and event identities;
- private delivery nonce support;
- validation of stale, duplicate, or mismatched messages;
- serialization compatibility defined by tests, not assumptions.

**Verification gates**

- TypeScript failing tests derived from Python behavior;
- behavior comparison fixtures;
- malformed and adversarial protocol inputs;
- full official suite remains green.

---

### ORCH-002 — Scheduler, Idempotency, Locks, and Verification

**Status:** `approved`  
**Safety class:** S2  
**Phase:** 3

**Goal**

Provide a transport-independent Scheduler that coordinates one Worker safely
before concurrency is enabled.

**Python references**

- `scheduler.py`;
- `workspace_lock.py`;
- `supervisor_bridge.py`;
- `runner.py`.

**Required behavior**

- fake `WorkerTransport` in core tests;
- workspace and checkout locks;
- idempotent commands;
- bounded rework attempts;
- user-decision relay;
- independent Git and test verification;
- fail-closed recovery.

**Dependencies**

- TASK-001;
- ORCH-001;
- relevant Git inspection support.

**Verification gates**

- one complete fake-transport workflow;
- restart and duplicate-delivery tests;
- lock contention;
- Worker false-success report;
- one controlled real single-Worker acceptance.

---

### BROWSER-001 — Browser Worker Integration Boundary

**Status:** `approved`  
**Safety class:** S2  
**Phase:** 4

**Goal**

Isolate Playwright and ChatGPT-specific behavior from the DevSpace core behind a
`WorkerTransport` implementation.

**Logical destination**

```text
integrations/chatgpt-browser-workers/
```

**Python references**

- `browser_runtime.py`;
- `browser_selectors.py`;
- `browser_worker_transport.py`.

**Required behavior**

- dedicated browser profile;
- semantic selectors;
- login-readiness checks without credential handling;
- redacted evidence;
- no direct browser import in core scheduling modules.

**Dependencies**

- ORCH-002;
- capability-probe design.

**Verification gates**

- fake-page tests;
- selector failure and UI drift tests;
- credential redaction audit;
- real capability probe authorization.

---

### BROWSER-002 — Browser Session Identity and Recovery

**Status:** `approved`  
**Safety class:** S2  
**Phase:** 4

**Goal**

Uniquely identify, persist, recover, and close Worker conversations without
cross-talk or wrong-page delivery.

**Python references**

- `browser_session_registry.py`;
- private marker and recovery behavior in `browser_worker_transport.py`.

**Required behavior**

- private-marker identity;
- durable session registry;
- page closure detection;
- restart recovery;
- ambiguous identity fails closed;
- no automatic replacement conversation after uncertain recovery.

**Dependencies**

- BROWSER-001;
- TASK-001;
- ORCH-001.

**Verification gates**

- two isolated pages;
- duplicate marker detection;
- wrong page selected;
- restart recovery;
- closed page;
- changed conversation title;
- redacted evidence only.

---

### CAP-001 — PoC A-D Capability Probes

**Status:** `partial`  
**Safety class:** S2  
**Phase:** 4

**Goal**

Measure actual ChatGPT browser capability and persist one supported scheduling
classification.

**Current evidence**

- PoC A: two isolated pages and restart recovery passed;
- PoC B: initialization failed with `SessionResolutionError`; this is unresolved
  and is not evidence that background generation is unsupported;
- PoC C: not run;
- PoC D: not run.

**Required classifications**

```text
parallel_capable
cooperative_only
unsupported
```

**Dependencies**

- BROWSER-001;
- BROWSER-002;
- explicit authorization for real browser tests.

**Verification gates**

- rerun A in the formal integration;
- isolate and resolve B initialization failure;
- run C and D;
- persist evidence and classification;
- ensure production scheduling enforces the classification.

---

### MULTI-001 — Capability-Gated Two-Worker Scheduling

**Status:** `blocked`  
**Safety class:** S2  
**Phase:** 5

**Goal**

Coordinate two browser Workers without shared writable state, duplicate commands,
or page cross-talk.

**Blocking dependencies**

- ORCH-002 must be verified;
- BROWSER-002 must be verified;
- CAP-001 must yield `parallel_capable` or an explicitly designed cooperative
  mode.

**Required behavior**

- distinct page identities;
- distinct writable worktrees or read-only assignments;
- workspace locks;
- no duplicate START;
- no silent redispatch;
- deterministic downgrade when capability is insufficient.

**Verification gates**

Two consecutive real acceptance cycles with no:

- cross-talk;
- wrong-page send;
- duplicate START;
- shared writable checkout;
- unverified Worker success;
- silent recovery substitution.

---

### PKG-001 — Fork Package Identity and Reproducible Artifact

**Status:** `approved`  
**Safety class:** S2  
**Phase:** 6

**Goal**

Produce an installable artifact clearly distinguishable from official DevSpace.

**Required behavior**

- distinct package or version identity;
- identity visible in `--version`, logs, and diagnostics;
- reproducible build and package contents;
- preserved configuration compatibility where safe;
- no accidental publication under the official package identity.

**Dependencies**

- selected release feature set verified;
- package naming decision;
- license and attribution review.

**Verification gates**

- clean-machine package install;
- CLI and server startup;
- MCP health check;
- package file manifest review;
- upgrade and uninstall tests.

---

### CUTOVER-001 — Install, Health Check, and Rollback

**Status:** `approved`  
**Safety class:** S3  
**Phase:** 6

**Goal**

Replace the local official runtime only after a verified fork artifact exists and
restore official `1.0.5` predictably if the cutover fails.

**Required behavior**

- backup record of package and launcher state;
- explicit user authorization immediately before cutover;
- production startup and MCP health check;
- workspace-open smoke test;
- rollback command and verification;
- no credential leakage in logs.

**Blocking dependencies**

- PKG-001 verified;
- selected core features verified;
- rollback rehearsal passed.

**Current state**

The global official package and port `7676` service remain unchanged.

---

### MIG-001 — Behavioral Migration from Python PoC

**Status:** `approved`  
**Safety class:** S2  
**Phase:** 3-5

**Goal**

Migrate proven behavior and invariants from the Python PoC into typed DevSpace
modules without importing the Python runtime as the permanent controller.

**Current state**

- migration mapping and target architecture are approved;
- no Python orchestration module has yet been replaced in the TypeScript runtime;
- the Python repository remains the reference and acceptance source;
- existing uncommitted browser transport changes in the Python PoC must be
  preserved and reviewed before migration.

**Migration rule**

For each unit:

1. read Python implementation and tests;
2. extract behavior and invariants;
3. write failing TypeScript tests;
4. implement through formal interfaces;
5. compare with retained evidence;
6. run official and new tests;
7. perform authorized real acceptance;
8. update this register.

**Dependencies**

Individual destination features listed above.

---

### POC-RETIRE-001 — Python PoC Retirement

**Status:** `blocked`  
**Safety class:** S2  
**Phase:** After 5 or 6

**Goal**

Stop using the Python repository as an active production runtime while retaining
useful historical and acceptance evidence.

**Retirement gates**

- protocol, task store, Scheduler, locks, and verification migrated;
- browser transport and session recovery migrated or extracted as a supported
  integration;
- PoC A-D completed in the formal implementation;
- one-Worker and permitted two-Worker acceptance passed;
- package and rollback tested;
- every retired behavior has replacement tests and evidence.

**Expected final state**

The repository is marked `reference_only` or archived. It is not deleted by
default.

## 6. Known Cross-Cutting Risks

### RISK-001 — Upstream Drift

The fork baseline is official `v1.0.5`, while upstream `main` may continue to
change. Upstream synchronization must be evaluated separately from feature work
and must not silently change the verified baseline.

### RISK-002 — Browser UI Instability

ChatGPT selectors, login state, page lifecycle, and background behavior may
change externally. Capability must be probed and enforced rather than assumed.

### RISK-003 — Permission Creep

Adding commit and Worker support could accidentally broaden shell or external
permissions. Structured policy, bounded approval, and negative tests are
mandatory.

### RISK-004 — Mixed Evidence and Product Claims

A fake transport, Python PoC, or Worker report may be mistaken for formal product
support. Every claim must identify its evidence layer.

### RISK-005 — Sensitive Data Exposure

Prompts, replies, browser state, command lines, environment variables, file
contents, and Git staging may contain sensitive information. Logs, notifications,
and evidence stores require redaction and minimum necessary data.

### RISK-006 — Dependency Vulnerabilities

The official `v1.0.5` baseline currently reports npm audit findings. Dependency
updates require a separate compatibility and security plan; automatic
`npm audit fix --force` is not permitted as an incidental change.

## 7. Immediate Priorities

The recommended sequence from the current state is:

1. design and implement SHELL-002 as the first public robustness improvement;
2. design POLICY-001, GIT-001, and GIT-002 together so commit support does not
   precede its authorization model;
3. establish TASK-001 before notification and Worker persistence;
4. migrate one-Worker orchestration before browser concurrency;
5. resolve capability probes before enabling MULTI-001;
6. package and cut over only after selected release gates are verified.

## 8. Update Checklist

When changing an entry:

- update its status;
- record exact scope completed;
- record exact remaining gaps;
- add commit, plan, baseline, Git Note, or acceptance references;
- distinguish automated tests from real environment tests;
- note whether the change is merged, pushed, installed, or deployed;
- update dependencies and blocking relationships;
- avoid replacing uncertainty with optimistic wording.
