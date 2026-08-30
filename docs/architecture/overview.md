# Architecture Overview

## Purpose

eFrame separates project creation into orthogonal layers so that project type, technology selection, environment requirements, version control, remote providers and repository generation can evolve independently.

## Layers

### 1. Project Intent

The initial human description of what is to be built, including goals, constraints and known requirements.

### 2. Archetype

Defines **what kind of project** is being created and therefore which decision path is relevant.

Initial archetype families may include:

- hardware
- firmware
- embedded system
- desktop application
- web application
- service / API
- cross-platform application
- data analysis
- data pipeline
- library / SDK
- integration bridge
- documentation / research
- hybrid product

The archetype should decide which questions exist. It must not force technology choices prematurely.

### 3. Profile

Represents a more specific engineering pattern within an archetype.

Examples:

- `web-app` -> `internal-business-spa`
- `desktop-app` -> `windows-native-business-app`
- `embedded-system` -> `mcu-connected-device`

Profiles may provide sensible defaults while remaining overridable.

### 4. Technology Packs

Describe concrete technologies and their engineering implications.

Examples: Vue, FastAPI, PostgreSQL, Delphi, Arduino, z88dk, Node.js.

A technology pack may declare capabilities, constraints, compatible profiles, required tooling, recommended repository structure and validation commands.

Technology packs must not determine the project archetype.

### 5. Environment / Toolchain

Describes what must actually exist on the development or target system: operating system, compiler, SDK, runtime, container engine, hardware programmer, external tooling and versions.

This layer supports future `eframe doctor` and validation capabilities.

### 6. Version Control

Git is a core concern independent of any hosting provider.

eFrame should support a valid local Git repository with no remote configured. Core Git responsibilities include repository initialization, status, branches, commits and remotes without assuming a collaboration platform.

### 7. Remote / Collaboration Providers

Remote hosting and forge-specific features are optional providers layered on top of Git.

Examples include GitHub, GitLab, Gitea, Bitbucket, Azure DevOps and generic Git remotes.

Providers should declare capabilities rather than forcing global assumptions. Relevant capabilities may include:

- repository creation;
- pull or merge requests;
- issues;
- releases;
- branch protection;
- hosted CI;
- artifact storage.

A provider may expose only a subset. The selected capabilities determine which later questions, files and operations are relevant.

CI must remain separable from repository hosting: a GitLab-hosted repository could use Jenkins, for example.

### 8. Project Specification

The normalized, serializable result of the decision process.

The specification is the contract between the decision engine and downstream repository generation. Interactive UI state must not be the source of truth.

Illustrative shape only:

```yaml
project:
  name: orion
  archetype: web-app
  profile: internal-business-spa

technologies:
  frontend: vue
  backend: fastapi
  database: postgresql

environment:
  runtime: docker
  target: linux

repository:
  vcs: git
  remote:
    provider: none
```

The definitive schema has not yet been designed.

### 9. Repository Generation

Consumes a project specification and produces or adapts a repository: documentation, project structure, configuration, CI, environment metadata and technology-specific assets.

Repository generation is downstream of decision making and must not contain hidden architectural decisions that are absent from the specification or documented defaults.

Provider-specific assets must be generated only when required by the selected provider. For example, `.github/workflows/` belongs to a GitHub Actions decision, not to Git itself.

## Interfaces

```text
             ┌──────────────┐
             │   CLI / TUI  │
             └──────┬───────┘
                    │
                    ▼
             ┌──────────────┐
             │Decision Engine│
             └──────┬───────┘
                    │
      ┌─────────────┼─────────────┐
      ▼             ▼             ▼
 Archetypes      Profiles     Technology Packs
      └─────────────┼─────────────┘
                    ▼
            Environment Model
                    │
                    ▼
                 Git Core
                    │
                    ▼
          Optional Providers
                    │
                    ▼
          Project Specification
                    │
                    ▼
        Renderers / Adapters
                    │
                    ▼
               Repository
```

Future interfaces may include non-interactive CLI operation, VS Code integration, CI automation or AI-agent integration. These must reuse the same core engine rather than duplicate decision logic.
