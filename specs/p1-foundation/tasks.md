# Tasks: lnngfar Foundation

**Created**: 2026-05-10  
**Input**: [plan.md](plan.md)

## Phase 1: Setup (Project Scaffold)

- [x] **T001** [P] Root configuration files
  - `package.json`, `pnpm-workspace.yaml`, `tsconfig.base.json`
  - **Path**: `{root}`

- [x] **T002** [P] Lint, format, test configuration
  - `.eslintrc.json`, `.prettierrc`, `vitest.workspace.ts`, `.gitignore`
  - **Path**: `{root}`

- [x] **T003** [P] CI pipeline
  - `.github/workflows/ci.yml`
  - **Path**: `{root}`

---

## Phase 2: Foundational (Core Types)

- [x] **T004** @lnngfar/types package
  - Create `packages/types/package.json` + `src/index.ts`
  - Define `LnngfarConfig`, `Workspace`, `Project`, `Logger`, `LogLevel`
  - **Completion**: All downstream packages can import from `@lnngfar/types`

---

## Phase 3: User Story 3 — Logger System (Priority: P2)

- [x] **T005** [US3] Logger package scaffold
  - `packages/logger/package.json`, `vitest.config.ts`
  - **Path**: `packages/logger/`

- [x] **T006** [US3] `createLogger()` implementation
  - `src/index.ts`: format message with timestamp, level, name
  - LogLevel control: DEBUG/INFO/WARN/ERROR/SILENT
  - **Acceptance**: `logger.info('test')` outputs `[INFO] [test] test`

- [x] **T007** [US3] Logger tests
  - `src/__tests__/index.test.ts`: 4 tests
  - Test: level filtering, format validation, silent mode
  - **Acceptance**: All 4 tests pass

---

## Phase 4: User Story 4 — Config Loader (Priority: P2)

- [x] **T008** [US4] Config loader package scaffold
  - `packages/config-loader/package.json`, `vitest.config.ts`
  - **Path**: `packages/config-loader/`

- [x] **T009** [US4] `loadConfig()` + `validateConfig()` implementation
  - `src/index.ts`: JSON parser, simple YAML parser, validation
  - **Acceptance**: Loads both `lnngfar.config.json` and `.lnngfar/project.yml`

- [x] **T010** [US4] Config loader tests
  - `src/__tests__/index.test.ts`: 7 tests
  - Test: valid config load, missing fields, invalid json, no file
  - **Acceptance**: All 7 tests pass

---

## Phase 5: User Story 5 — Workspace Manager (Priority: P3)

- [x] **T011** [US5] Workspace manager package scaffold
  - `packages/workspace-manager/package.json`, `vitest.config.ts`
  - Depends on: `@lnngfar/types`, `@lnngfar/logger`, `@lnngfar/config-loader`
  - **Path**: `packages/workspace-manager/`

- [x] **T012** [US5] `loadWorkspace()` + `createProject()` implementation
  - `src/index.ts`: scan packages, create project dirs
  - **Acceptance**: `loadWorkspace()` returns list of 4 packages; `createProject()` creates dir structure

- [x] **T013** [US5] Workspace manager tests
  - `src/__tests__/index.test.ts`: 4 tests
  - Test: workspace scan, project creation, duplicate detection
  - **Acceptance**: All 4 tests pass

---

## Phase 6: Polish & Cross-Cutting

- [x] **T014** Spec documentation
  - Create spec-kit standard docs: `spec.md`, `plan.md`, `data-model.md`, `research.md`, `quickstart.md`, `contracts/`, `checklist.md`
  - **Acceptance**: All 8 files present and complete

- [x] **T015** Regression verification
  - `pnpm install` → clean
  - `pnpm test` → 15/15 pass
  - `pnpm lint` → 0 errors
  - Verify P0 outputs: `.codebuddy/commands/`, `.lnngfar/`, `.specify/extensions.yml`

---

## Task Dependency Graph

```
Phase 1 (Setup)        Phase 2 (Foundational)
  T001 ─┐                 T004 (types)
  T002 ─┤                   │
  T003 ─┘                   ▼
                      Phase 3 (US3 Logger)
                           T005 → T006 → T007
                            │
                      Phase 4 (US4 Config)    
                           T008 → T009 → T010  (parallel with US3)
                            │
                      Phase 5 (US5 Workspace)
                           T011 → T012 → T013  (after US3 + US4)
                            │
                      Phase 6 (Polish)
                           T014 → T015
```

---

## Implementation Strategy

**MVP**: Phase 1 + Phase 2 → Verify → Done  
**Full Delivery**: All phases complete, 15 tests pass, CI green
