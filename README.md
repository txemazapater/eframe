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
Plan
     ↓
Preview / Inspect
     ↓
Apply
     ↓
Development / Validation
```

The **Archetype** is the first structural decision. A hardware project, desktop application, web application, embedded system or data-analysis project should not travel through the same questionnaire or receive the same assistance.

The **Plan** is the boundary between decision-making and side effects. eFrame should resolve what it intends to create or execute, render that intent for inspection, and only then allow an explicit apply step.

## Design principles

1. **Archetype first** — determine what is being built before choosing technologies.
2. **Orthogonal layers** — project type, technology, environment, version control, remote providers and repository generation are independent concerns.
3. **Declarative knowledge** — archetypes, profiles, technologies and provider capabilities should be data-driven whenever practical rather than hard-coded into the UI.
4. **UI-independent core** — the decision engine must not depend on the terminal interface.
5. **Tool-agnostic projects** — generated repositories must not depend on a particular AI coding assistant.
6. **Repository as source of truth** — durable project knowledge belongs in version control, not in private agent context.
7. **Git is core; hosted forges are optional** — GitHub, GitLab, Gitea and similar services are providers, not prerequisites.
8. **Reality wins** — compilers, tests, CI and physical validation are authoritative over generated assumptions.
9. **Progressive complexity** — eFrame should ask only questions relevant to the chosen project path and selected provider capabilities.
10. **Inspectable before executable** — generated files, scripts, commands and remote operations must be visible before they can be applied.

## Repository and provider model

eFrame treats Git separately from remote hosting and collaboration services.

A project may be:

```text
Git only
Git + GitHub
Git + GitLab
Git + Gitea
Git + Bitbucket
Git + Azure DevOps
Git + generic SSH remote
```

or use no remote at all.

Remote providers expose capabilities such as repository creation, pull/merge requests, issues, releases, branch protection and hosted CI. eFrame should only offer or generate provider-specific features when those capabilities exist.

CI is therefore not synonymous with GitHub Actions. The selected repository and CI providers determine the appropriate assets and operations.

## Intended interfaces

The first interface is expected to be an interactive CLI/TUI:

```text
eframe new
eframe init
eframe plan
eframe inspect
eframe doctor
eframe validate
eframe explain
```

The engine must also support non-interactive operation from a project specification so that future integrations with VS Code, CI systems, automation or AI agents do not depend on terminal prompts.

## Technology direction

eFrame is intended to be implemented as a cross-platform Node.js application written in TypeScript and distributed through npm.

The exact libraries used for CLI/TUI, schema validation, rendering and packaging remain implementation decisions and should be selected after the core model is stable.

## Current status

**Phase 0 — Definition, architecture and interaction experiments.**

The repository intentionally starts with documentation before implementation. A TUI laboratory under `experiments/` is used to test prompts, feedback, preview and inspection behaviour without committing those experiments to the stable core model.

See [`docs/roadmap.md`](docs/roadmap.md), [`docs/architecture/overview.md`](docs/architecture/overview.md), [`docs/decisions/ADR-0004-inspectable-plan-before-apply.md`](docs/decisions/ADR-0004-inspectable-plan-before-apply.md) and [`docs/decisions/ADR-0005-git-core-remote-providers.md`](docs/decisions/ADR-0005-git-core-remote-providers.md).

## License

MIT.
