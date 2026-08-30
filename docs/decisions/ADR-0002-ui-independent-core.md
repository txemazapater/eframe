# ADR-0002: UI-independent decision engine

- Status: Accepted
- Date: 2026-08-30

## Context

eFrame is expected to begin with an interactive terminal experience similar to modern project generators, but future use cases may include non-interactive CLI execution, VS Code integration, CI automation or AI-agent orchestration.

Embedding decision logic directly in terminal prompts would make those future interfaces duplicate or bypass core behaviour.

## Decision

The decision engine will be independent of the CLI/TUI.

User interfaces collect and present information; they do not own project decision logic. The engine produces a normalized project specification that downstream renderers and adapters consume.

## Consequences

- Interactive and non-interactive workflows can share the same behaviour.
- Decision logic can be unit-tested without terminal rendering.
- The project specification becomes a stable architectural boundary.
- TUI technology can change without rewriting the core.
- The initial implementation requires slightly more structure than a prompt-driven script, but avoids substantial coupling later.
