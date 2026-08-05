# DevSpace Enhanced Product and Architecture Design

**Date:** 2026-08-05
**Status:** Approved and maintained
**Repository:** `AuRevior-ai/devspace`
**Primary development branch:** `enhanced/main`
**Official baseline:** `@waishnav/devspace@1.0.5`, upstream commit `dca3b6a345a9285e63446d72376afdafe8c72af4`

## 1. Document Purpose and Authority

This document is the authoritative product and architecture specification for the
DevSpace Enhanced fork. It defines what the fork intends to add to official
DevSpace, where each capability belongs, which safety boundaries are mandatory,
and what evidence is required before a capability may be treated as complete.

The live implementation status is maintained separately in:

```text
docs/superpowers/roadmaps/2026-08-05-devspace-enhanced-feature-register.md
```

Implementation plans and verification records are not substitutes for this
specification:

- `specs/` defines the intended product and architecture;
- `roadmaps/` records feature status, dependencies, and remaining gaps;
- `plans/` describes how a bounded phase will be implemented;
- `baselines/` records observed results and reproducibility evidence;
- Git Notes may attach review reminders to specific commits without placing them
  in the main documentation tree.

This document supersedes the earlier design retained in the Python proof-of-
concept repository:

```text
D:\use_as_desktop\devspace_mock_subagent\
chatgpt-desktop-automation-poc\docs\superpowers\specs\
2026-08-05-devspace-enhanced-fork-migration-design.md
```

The older document remains historical design evidence. New architectural
changes must be reflected here and in the feature register.

## 2. Product Vision

DevSpace Enhanced extends official DevSpace so an MCP-capable ChatGPT
conversation can perform longer, safer, and more coordinated local development
work while remaining auditable and recoverable.

The target experience approximates selected properties of agentic coding modes:

1. explicit and inspectable local file, Git, and shell operations;
2. safe support for authorized Git staging, commits, branches, and worktrees;
3. durable task state and local attention notifications;
4. optional Supervisor/Worker orchestration across multiple ChatGPT browser
   conversations;
5. independent verification of Worker output before success is reported;
6. reproducible installation, upgrade, and rollback to official DevSpace.

The project does not claim full parity with any OpenAI-hosted Work mode or Codex
runtime. Browser behavior, product UI, quotas, and account capabilities remain
external dependencies and must be treated as measured capabilities rather than
assumed guarantees.

## 3. Current Product State

As of 2026-08-05:

- the fork preserves official Git history;
- `origin` points to `AuRevior-ai/devspace`;
- `upstream` points to `Waishnav/devspace`;
- `enhanced/main` is based on the exact source associated with official version
  `1.0.5`;
- the official typecheck, test, build, package, CLI, and isolated startup
  baselines have been recorded;
- the fork honors `DEVSPACE_SHELL_PATH` consistently in both `doctor` and real
  workspace shell execution;
- the currently installed global official package and the production listener on
  port `7676` have not been replaced by the fork;
- the Python browser-worker proof of concept has not yet been migrated into the
  TypeScript product.

A listed future capability must not be interpreted as implemented unless the
feature register marks it complete and links fresh verification evidence.

## 4. Goals

The fork will:

- retain a clean and reviewable relationship with official DevSpace history;
- keep upstream synchronization practical;
- preserve official workspace, MCP, and security behavior unless an enhancement
  is explicitly designed and tested;
- support nonstandard but explicitly configured Bash installations on Windows;
- evolve shell discovery into a robust cross-machine resolver;
- replace coarse Git restrictions with structured, operation-aware policy;
- support authorized Git commits without implying push permission;
- persist task lifecycle and recovery state;
- emit redacted completion, failure, and attention notifications;
- support one verified Worker before permitting concurrent Workers;
- isolate browser automation from the DevSpace core;
- migrate proven behavior from the Python PoC through interfaces and tests rather
  than copying the implementation wholesale;
- fail closed when identity, delivery, workspace, capability, or authorization is
  ambiguous;
- provide reproducible install, upgrade, uninstall, and rollback procedures.

## 5. Non-Goals

The first public enhanced release will not:

- grant unrestricted shell execution by default;
- treat arbitrary command strings as safe because they contain a known command;
- implicitly stage unrelated files;
- implicitly push, deploy, publish, rewrite history, delete work, or modify
  accounts;
- inspect, store, or expose browser credentials, cookies, session tokens, or MFA
  secrets;
- trust a Worker report as proof that files, tests, or Git state are correct;
- silently create replacement ChatGPT conversations after ambiguous recovery;
- depend permanently on a fixed ChatGPT DOM without capability probes and safe
  degradation;
- delete the Python PoC before each migrated behavior has replacement tests and
  acceptance evidence;
- replace the official global installation before packaging and rollback gates
  pass;
- claim automatic support for every possible Bash installation path without
  discovery and execution probes.

## 6. Repository and Package Topology

The approved local layout is:

```text
D:\use_as_desktop\
├─ devspace-enhanced\
│  ├─ official DevSpace source and Git history
│  ├─ core enhancements
│  ├─ browser-worker integration
│  ├─ tests and capability probes
│  └─ specifications, plans, baselines, and roadmaps
│
└─ devspace_mock_subagent\
   └─ chatgpt-desktop-automation-poc\
      ├─ retained Python reference implementation
      ├─ historical PoC evidence
      └─ black-box acceptance tooling
```

Git remotes are:

```text
origin   -> https://github.com/AuRevior-ai/devspace.git
upstream -> https://github.com/Waishnav/devspace.git
```

The enhanced package must eventually use a distinguishable package name or
version identity so logs and bug reports cannot confuse it with official
`@waishnav/devspace`.

## 7. Architectural Principles

### 7.1 Core and Integration Separation

The DevSpace core owns:

- MCP transport and tool registration;
- workspace identity and allowed-root enforcement;
- file operations;
- shell and Git policy;
- task and event persistence;
- local notification dispatch;
- Worker scheduling and workspace locks;
- capability-state enforcement;
- independent verification and audit-safe reporting.

The core must not depend directly on Playwright, ChatGPT selectors, or browser
profiles. Browser control is accessed through a transport interface.

### 7.2 Explicit Intent Over Command Text

Mutating operations should be represented as structured intent whenever
possible. Authorization must bind to the operation, workspace, paths, and impact
rather than to a reusable permission for an arbitrary shell string.

### 7.3 Evidence Before Success

A completion state requires evidence from the relevant layer:

- a file change requires actual filesystem or Git inspection;
- a test claim requires a fresh test result;
- a build claim requires a fresh build result;
- a browser capability claim requires a real capability probe;
- a Worker completion report remains advisory until independently verified.

### 7.4 Fail Closed

Uncertain identity, workspace, delivery, permission, or recovery state must stop
execution. The system must not broaden permission or invent replacement state to
keep a task moving.

### 7.5 Reversible Deployment

Development must not overwrite the official installation. Cutover requires a
versioned artifact, health check, preserved configuration, and a tested rollback
path.

## 8. Shell Resolution and Execution

### 8.1 Current Implemented Behavior

Commit `a4089ad2d0ca7d563be251bae836437eb3bac727` introduced a shared
`DEVSPACE_SHELL_PATH` source for:

- `devspace doctor` shell reporting;
- real MCP workspace shell execution.

This fixes the prior inconsistency where the launcher hotfix supplied a custom
Windows Git Bash path but the CLI diagnostic and tool construction ignored it.
The behavior has been verified with a nonstandard `D:` drive path containing
Chinese characters.

### 8.2 Required Public Resolver

The final resolver should evaluate candidates in this order:

1. persisted DevSpace `shellPath` configuration;
2. `DEVSPACE_SHELL_PATH`;
3. Git for Windows registry installation metadata;
4. Git root derived from `git.exe` found on `PATH`;
5. standard `Program Files` Git Bash locations;
6. `bash.exe` found on `PATH`;
7. a diagnostic failure listing safe, redacted candidate attempts.

Candidate normalization must:

- trim whitespace;
- handle accidental matching outer quotes;
- reject unstable relative paths;
- preserve Unicode and spaces;
- distinguish legacy WSL `bash.exe` transport behavior where necessary.

A candidate is usable only after an execution probe succeeds, such as:

```text
bash.exe --version
bash.exe -c "printf DEVSPACE_SHELL_PROBE"
```

The resolver must never recursively scan whole disks by default.

### 8.3 Shell Safety Boundary

Resolving a shell executable does not grant unrestricted shell permission. Shell
availability and command authorization remain separate concerns.

## 9. Git and Shell Policy

Operations are divided into three impact classes.

### 9.1 Read-Only Operations

Examples:

- `git status`, `git diff`, `git log`, and branch inspection;
- targeted code and file discovery;
- environment diagnostics;
- test and build command discovery.

These remain workspace-bound and auditable even when they do not require an
additional approval.

### 9.2 Workspace-Mutating Operations

Examples:

- builds or tests that create local artifacts;
- targeted staging;
- commits;
- branch creation;
- managed worktree creation;
- bounded source edits through explicit DevSpace tools.

These require operation-specific authorization or an approved workflow policy,
plus exact workspace binding.

Git commit support must provide:

- staged-path visibility;
- commit-message visibility;
- unrelated-file exclusion;
- sensitive-file and secret checks;
- no implicit push;
- auditable command and result records.

### 9.3 High-Impact Operations

Examples:

- push and force-push;
- history rewriting;
- destructive checkout or reset;
- deployment and package publication;
- credential and account changes;
- system service changes;
- deletion outside narrowly approved cleanup;
- commands outside the opened workspace.

These remain blocked or require a separate explicit approval flow with clear
consequences.

## 10. Task Lifecycle and Persistence

The core task lifecycle is:

```text
queued -> running -> waiting_for_user | failed | completed
```

Recovery may use additional internal states, but external status must remain
clear and finite.

The durable task model should retain, where applicable:

- `task_id`;
- `attempt_id`;
- `command_id`;
- `event_id`;
- private delivery nonce;
- Supervisor identity;
- Worker/session identity;
- workspace identity;
- capability classification;
- authorization references;
- verification evidence references.

Commands and externally visible events must be idempotent. Stale attempts and
duplicate commands must not silently execute twice.

## 11. Local Notifications

Notifications are emitted for:

- completion;
- failure;
- authorization required;
- user decision required;
- recovery failure;
- Worker capability downgrade.

The first target is a Windows notification containing only:

- a safe task title;
- a workspace label;
- a status summary;
- a local destination for task details.

Notifications must not contain full prompts, model replies, secrets, cookies,
tokens, or unrelated file contents.

Clicking a notification should open a local DevSpace status surface. Direct
navigation to a ChatGPT conversation is optional until a stable and verified URL
or session mapping exists.

## 12. Supervisor and Worker Orchestration

The orchestration architecture contains:

- one user-facing Supervisor conversation;
- zero or more Worker conversations;
- one persistent local Scheduler;
- a durable task store and append-only event log;
- workspace and checkout locks;
- Worker session records;
- idempotent commands;
- independent Supervisor or local verification.

A Worker receives a bounded task and may prepare or implement work only within
its assigned workspace and authorization scope. The Worker cannot expand its own
scope, create additional Workers, or declare final success without verification.

The Scheduler must prevent two writable Workers from sharing the same checkout.
Parallel work should use distinct managed worktrees or an explicitly read-only
mode.

## 13. Worker Transport Boundary

The core Scheduler depends on a transport interface equivalent to:

```ts
interface WorkerTransport {
  createWorker(task: WorkerTask): Promise<WorkerSession>;
  sendCommand(sessionId: string, command: WorkerCommand): Promise<void>;
  pollEvents(sessionId: string): Promise<WorkerEvent[]>;
  recoverWorker(sessionId: string): Promise<WorkerSession>;
  closeWorker(sessionId: string): Promise<void>;
}
```

Core tests must use a fake conforming transport. The Scheduler must not import
browser or desktop automation modules.

## 14. ChatGPT Browser Worker Integration

The Playwright-based integration is logically isolated under:

```text
integrations/chatgpt-browser-workers/
├─ runtime
├─ selectors
├─ session-registry
├─ worker-transport
├─ capability-probes
└─ redacted-evidence-store
```

The integration owns:

- a dedicated browser profile;
- login-readiness checks without handling credentials;
- conversation creation and recovery;
- semantic selectors;
- private-marker page identity;
- cross-talk detection;
- foreground and background capability probes;
- safe redacted evidence.

It must never request, store, paste, inspect, or log passwords, cookies, session
tokens, or MFA secrets.

Browser support is classified as one of:

```text
parallel_capable
cooperative_only
unsupported
```

The Scheduler must enforce the persisted classification rather than infer
capability from a single successful interaction.

## 15. Migration from the Python PoC

Migration is behavioral and interface-driven.

| Python reference | Formal fork destination |
|---|---|
| `task_protocol.py` | typed protocol and validation module |
| `models.py` | TypeScript domain models and schemas |
| `task_store.py` | durable task and event persistence |
| `scheduler.py` | core Scheduler with transport abstraction |
| `runner.py` | DevSpace CLI or service task entry points |
| `workspace_lock.py` | workspace and checkout locking service |
| `supervisor_bridge.py` | MCP-facing Supervisor task API |
| `browser_runtime.py` | Playwright runtime integration |
| `browser_session_registry.py` | durable Worker session registry |
| `browser_selectors.py` | semantic selector adapter |
| `browser_worker_transport.py` | ChatGPT browser Worker transport |
| PoC A-D probes | capability probes and real acceptance matrix |
| Python tests | observable behavior rewritten in the official test stack |

Each migration unit follows this order:

1. extract observable behavior and invariants from Python code and tests;
2. define a TypeScript interface and failing tests;
3. implement against fake dependencies;
4. compare behavior with retained Python evidence;
5. run official baseline tests plus new tests;
6. perform only the explicitly authorized real-world acceptance step;
7. retain the Python implementation until the replacement passes its full gate.

The Python repository is not copied wholesale into the official fork. It remains
useful as a reference implementation, regression oracle, capability-probe
runner, and historical evidence store until retirement criteria are met.

## 16. Delivery Phases

### Phase 0: Official Fork Baseline — Complete

- establish official Git history and remotes;
- pin the `1.0.5` source baseline;
- run official dependency, typecheck, test, build, package, CLI, and startup
  validation;
- record results without replacing production.

### Phase 1: Shell and Git Policy

- complete the public Shell Resolver;
- map existing shell and Git trust boundaries;
- introduce structured operation classification;
- add safe Git inspection;
- add explicitly authorized staging and commit operations;
- preserve blocking for push, destructive history operations, and unrelated
  workspaces.

### Phase 2: Task Lifecycle and Windows Notifications

- add durable lifecycle events;
- add a notification adapter;
- implement Windows completion, failure, and attention notifications;
- add a local task-status destination;
- verify redaction and click behavior.

### Phase 3: Single-Worker Orchestration Core

- port protocol, task state, event log, locks, idempotency, and verification;
- test through a fake Worker transport;
- complete one controlled end-to-end Worker task before concurrency.

### Phase 4: Browser Worker Integration

- port session registry, runtime, selectors, recovery, and evidence handling;
- rerun PoC A;
- resolve and rerun PoC B;
- complete PoC C and PoC D;
- persist and enforce the resulting capability classification.

### Phase 5: Multi-Worker Scheduling

- permit two Workers only when capability evidence allows it;
- otherwise enforce cooperative foreground scheduling or disable browser Workers;
- require workspace locks and distinct page identities;
- run two consecutive real acceptance cycles without cross-talk, wrong-page
  sends, duplicate START, or silent redispatch.

### Phase 6: Packaging, Installation, and Cutover

- establish a distinguishable fork package/version identity;
- produce reproducible artifacts;
- document install, upgrade, uninstall, and rollback;
- switch the launcher only after acceptance;
- retain a tested rollback to `@waishnav/devspace@1.0.5`.

## 17. Failure Handling

The system fails closed when:

- a workspace root is missing or mismatched;
- a shell candidate is missing, relative, invalid, or fails its probe;
- multiple writable Workers target the same checkout;
- a browser session cannot be uniquely identified;
- command delivery is uncertain;
- a stale attempt sends a command;
- an operation exceeds its approved impact class;
- a sensitive file may be included in a commit;
- a required capability probe has not passed;
- persisted capability is `unsupported` or missing for a required browser mode;
- official baseline tests regress.

No automatic fallback may silently broaden permissions or create a replacement
conversation after ambiguous recovery.

## 18. Testing Strategy

Testing is layered:

1. official upstream tests;
2. Shell Resolver and execution tests;
3. policy-engine and Git-operation tests;
4. task lifecycle and persistence tests;
5. notification adapter tests;
6. Scheduler tests with a fake Worker transport;
7. browser integration tests with fake pages;
8. retained Python behavior comparisons;
9. real PoC A-D capability gates;
10. full single-Worker acceptance;
11. two consecutive dual-Worker acceptance cycles;
12. package installation and rollback tests.

Path and shell coverage should include:

- standard Git Bash installation;
- explicit nonstandard drive path;
- Unicode path;
- path containing spaces;
- accidentally quoted environment value;
- missing executable;
- existing non-Bash executable;
- Git registry discovery;
- `git.exe`-derived discovery;
- Cygwin or MSYS2 Bash;
- legacy WSL Bash behavior.

Fake-browser success is not evidence of real ChatGPT capability, and Worker
self-report is not evidence of correct workspace output.

## 19. Release and Rollback

Cutover requires:

- a versioned and distinguishable fork artifact;
- a record of the current official package and launcher configuration;
- a verified fork startup command;
- an MCP health check and workspace-open check;
- a rollback command restoring official version `1.0.5`;
- preservation of user configuration and logs without credential leakage;
- package identity visible in `--version`, logs, and diagnostics.

The global official package remains the production fallback throughout feature
development.

## 20. Acceptance Criteria

The enhanced design is implemented only when all applicable criteria are
proven:

1. official Git history and upstream synchronization remain intact;
2. official baseline tests continue to pass;
3. shell discovery works across the declared public test matrix;
4. explicitly authorized commits work without implicit push or unrelated
   staging;
5. completion, failure, and attention states produce redacted notifications;
6. one Worker completes an end-to-end task with independent verification;
7. browser capability state is measured, persisted, and enforced;
8. two Workers run only in a proven supported mode;
9. acceptance detects no cross-talk, wrong-page send, duplicate START, or shared
   writable checkout;
10. install, upgrade, uninstall, and rollback are reproducible;
11. the official installation remains recoverable;
12. each retired Python behavior has a TypeScript replacement test and acceptance
    result.

## 21. Change Governance

A proposed feature must first receive a feature-register entry. The entry must
identify:

- scope and intended behavior;
- current official behavior;
- safety class;
- dependencies;
- implementation and verification state;
- public-release gaps;
- related plans, commits, Git Notes, and evidence.

Architectural changes update this specification before implementation. Bounded
implementation work receives a separate plan. Completion claims require fresh
verification and a feature-register status update.
