# Architecture Overview

## Purpose

eFrame separates project creation into orthogonal layers so that project type, technology selection, environment requirements and repository generation can evolve independently.

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

### 6. Project Specification

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
```

The definitive schema has not yet been designed.

### 7. Repository Generation

Consumes a project specification and produces or adapts a repository: documentation, project structure, configuration, CI, environment metadata and technology-specific assets.

Repository generation is downstream of decision making and must not contain hidden architectural decisions that are absent from the specification or documented defaults.

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
          Project Specification
                    │
                    ▼
        Renderers / Adapters
                    │
                    ▼
               Repository
```

Future interfaces may include non-interactive CLI operation, VS Code integration, CI automation or AI-agent integration. These must reuse the same core engine rather than duplicate decision logic.
