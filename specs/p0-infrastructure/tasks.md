# Tasks: P0 Infrastructure

**Created**: 2026-05-10  
**Input**: [plan.md](plan.md)

## Phase 1: Environment Verification

- [x] **T001** Verify Node.js ≥ 20
  - `node --version` → v24.15.0 ✅

- [x] **T002** Install pnpm ≥ 8
  - `npm install -g pnpm` → v11.0.9 ✅

- [x] **T003** Verify speckit commands (14 files)
  - `ls .codebuddy/commands/speckit.*.md` → 14 files ✅

## Phase 2: Directory Setup

- [x] **T004** [P] Create `specs/` directory
- [x] **T005** [P] Create `.lnngfar/ai/` directory
- [x] **T006** [P] Create `.lnngfar/runtime/` directory

## Phase 3: Hook Configuration

- [x] **T007** Disable auto-commit hooks in `.specify/extensions.yml`
  - 14 hooks → `enabled: false`
  - Keep: `before_constitution` + `before_specify` enabled ✅

## Phase 4: Documentation

- [x] **T008** Create spec-kit standard documents
  - `spec.md`, `plan.md`, `tasks.md`

## Phase 5: Verify

- [x] **T009** `node --version` → v24.15.0
- [x] **T010** `pnpm --version` → 11.0.9
- [x] **T011** 14 speckit commands present
- [x] **T012** Directory structure verified
