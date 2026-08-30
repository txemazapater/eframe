# ADR-0003: Node.js and TypeScript as implementation platform

- Status: Accepted
- Date: 2026-08-30

## Context

eFrame is intended to be a cross-platform engineering assistant with a CLI/TUI, filesystem and process orchestration, structured configuration, Git/GitHub integration and straightforward public distribution.

A JavaScript ecosystem also provides a natural path to npm publication and future extension packages.

## Decision

eFrame will be implemented on Node.js using TypeScript and distributed through npm.

This decision establishes the runtime and language only. It does not yet select the CLI framework, TUI library, schema validator, template engine, bundler or plugin mechanism.

## Consequences

- Cross-platform installation and npm distribution are first-class goals.
- Static typing can be used to model archetypes, decisions and project specifications.
- The project can draw on the broader JavaScript/TypeScript CLI ecosystem.
- Node.js becomes a development/runtime prerequisite for eFrame itself.
- Concrete third-party implementation libraries remain replaceable until separately decided.
