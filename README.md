# eFrame

**Engineering Framework for structured project creation and development.**

eFrame is an engineering assistant and framework for turning an initial project idea into a structured, documented and reproducible repository.

Its purpose is not merely to scaffold source files. eFrame guides the decisions that come before implementation: what kind of project is being built, which engineering path applies, which technologies and toolchains are appropriate, how the development environment is validated, and how project knowledge is preserved for humans and interchangeable AI agents.

## Core idea

A project should not begin with a framework or programming language. It should begin by identifying **what is being built**.

```text
Project intent
     ↓
Archetype
     ↓
Profile
     ↓
Technology Packs
     ↓
Environment / Toolchain
     ↓
Project Specification
     ↓
Repository Generation
     ↓
Development / Validation
```

The **Archetype** is the first structural decision. A hardware project, desktop application, web application, embedded system or data-analysis project should not travel through the same questionnaire or receive the same assistance.

## Design principles

1. **Archetype first** — determine what is being built before choosing technologies.
2. **Orthogonal layers** — project type, technology, environment and repository generation are independent concerns.
3. **Declarative knowledge** — archetypes, profiles and technology capabilities should be data-driven whenever practical rather than hard-coded into the UI.
4. **UI-independent core** — the decision engine must not depend on the terminal interface.
5. **Tool-agnostic projects** — generated repositories must not depend on a particular AI coding assistant.
6. **Repository as source of truth** — durable project knowledge belongs in version control, not in private agent context.
7. **Reality wins** — compilers, tests, CI and physical validation are authoritative over generated assumptions.
8. **Progressive complexity** — eFrame should ask only questions relevant to the chosen project path.

## Intended interfaces

The first interface is expected to be an interactive CLI/TUI:

```text
eframe new
eframe init
eframe doctor
eframe validate
eframe explain
```

The engine must also support non-interactive operation from a project specification so that future integrations with VS Code, CI systems, automation or AI agents do not depend on terminal prompts.

## Technology direction

eFrame is intended to be implemented as a cross-platform Node.js application written in TypeScript and distributed through npm.

The exact libraries used for CLI/TUI, schema validation, rendering and packaging remain implementation decisions and should be selected after the core model is stable.

## Current status

**Phase 0 — Definition and architecture.**

The repository intentionally starts with documentation before implementation. The immediate goal is to define the project model, archetype system, decision engine boundaries and project-specification format.

See [`docs/roadmap.md`](docs/roadmap.md) and [`docs/architecture/overview.md`](docs/architecture/overview.md).

## License

MIT.
