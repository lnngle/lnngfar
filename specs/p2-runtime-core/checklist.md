# Checklist: Runtime Core

## Implementation Coverage

- [x] FR-001 boot/shutdown → `Runtime.boot()` + `Runtime.shutdown()`
- [x] FR-002 module hooks → init/shutdown hooks in `boot()`/`shutdown()`
- [x] FR-003 register/unregister → `registerModule()` + `unregisterModule()`
- [x] FR-004 events → `EventBus.on()/off()/emit()`
- [x] FR-005 context → `ContextStore.load()/get()`
- [x] FR-006 state → `Runtime.state` getter
- [x] FR-007 module interface → `LnngfarModule` type

## Test Coverage

16 tests: lifecycle(4) + modules(2) + events(4) + context(3) + edge(3)

## Regression

- [x] P0: .lnngfar/ + .codebuddy/commands/
- [x] P1: 4 packages + dependency direction
- [x] pnpm test → all pass

## Gate Decision

✅ **PASS** — Ready for P3 CLI System.
