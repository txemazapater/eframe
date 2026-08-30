# Roadmap

## Phase 0 — Definition and architecture

Goal: establish the conceptual model before implementation choices harden it accidentally.

- [x] Define eFrame purpose.
- [x] Establish archetype-first project classification.
- [x] Separate profiles, technology packs and environments.
- [x] Separate decision engine from user interface.
- [x] Define project specification as the boundary to repository generation.
- [ ] Refine archetype taxonomy.
- [ ] Define question/decision model.
- [ ] Define project-specification schema.
- [ ] Define extension model for archetypes and technology packs.
- [ ] Define repository-generation responsibilities.

## Phase 1 — Minimal executable core

Goal: prove the architecture with the smallest useful vertical slice.

Planned direction:

- Node.js + TypeScript project foundation.
- Core domain model.
- Declarative archetype loading.
- One initial archetype path.
- Interactive terminal flow.
- Project specification output to disk.
- Unit tests for decision logic independent of the TUI.

No repository generation is required to prove Phase 1.

## Phase 2 — Repository bootstrap

Goal: consume a project specification and produce a useful project repository.

- Core documentation generation.
- Git initialization / existing-repository adaptation.
- GitHub adapter where available.
- Initial technology packs.
- Initial environment definitions.

## Phase 3 — Environment intelligence

Goal: make environment and toolchain requirements verifiable.

- `eframe doctor`
- tool/version discovery
- compatibility checks
- project validation
- actionable diagnostics

## Phase 4 — Extensibility and distribution

Goal: make eFrame practical beyond its built-in knowledge.

- npm distribution
- stable extension/plugin contracts
- external technology packs or archetypes
- non-interactive execution from specification
- CI and automation integration

## Guiding rule

Each phase must validate the previous abstraction before adding another layer of automation.
