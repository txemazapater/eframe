# AGENTS.md

This repository is currently in **definition and architecture phase**.

## Source of truth

Read these files before proposing or implementing changes:

1. `README.md`
2. `docs/roadmap.md`
3. `docs/architecture/overview.md`
4. relevant ADRs under `docs/decisions/`

Do not infer project intent from previous chat history when repository documentation says otherwise.

## Current working rule

Do **not** rush into implementation.

Before adding application code, dependencies or framework-specific structure, verify that the change is compatible with the documented architecture and current roadmap phase.

## Architectural constraints

- The decision engine must remain independent from the CLI/TUI.
- Archetypes, profiles, technologies and environments are separate concerns.
- The archetype determines which questions and assistance paths are relevant.
- Technology-specific knowledge must not leak into the core model unnecessarily.
- Project generation consumes a project specification; it should not depend directly on interactive UI state.
- Generated projects must remain usable without eFrame being their runtime dependency unless a future feature explicitly requires otherwise.
- AI agents are interchangeable engineering tools, not holders of authoritative project knowledge.

## Implementation direction

The intended implementation platform is Node.js with TypeScript and npm distribution. Specific third-party libraries are not yet architectural commitments unless recorded by ADR.

## Validation

Until implementation begins, validation means:

- documentation is internally consistent;
- terminology is used consistently;
- new architectural decisions are recorded when they materially constrain future implementation;
- no undocumented dependency on a specific UI, AI provider or project technology is introduced.

Once code exists, build, test, lint and packaging commands must be documented here.

## Definition of done

For the current phase, a change is complete when it clarifies the model without prematurely coupling eFrame to an implementation detail, and all affected documentation remains synchronized.
