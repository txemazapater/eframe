# ADR-0008: eFrame runtime setup and project environment setup are separate lifecycle concerns

- Status: Accepted
- Date: 2026-08-31

## Context

eFrame has two different setup problems that must not be conflated:

1. preparing a machine so that eFrame itself can run;
2. preparing a machine so that a specific project can be developed, built, tested or deployed.

These concerns have different lifecycles, ownership, dependencies and failure modes.

For example, eFrame may require only Node.js, npm and Git, while a project may require Docker, Python, Delphi, Arduino CLI, z88dk, CMake, Java, database clients or hardware-specific tooling.

If both concerns are merged, eFrame would become unnecessarily coupled to project technologies and toolchains.

## Decision

eFrame will model **eFrame Runtime Setup** and **Project Environment Setup** as separate concerns.

The conceptual separation is:

```text
Machine
  |
  +--> eFrame Runtime Setup
  |      |
  |      +--> Node.js
  |      +--> npm
  |      +--> Git
  |      +--> eFrame CLI
  |      +--> eFrame config/cache/provider credentials
  |
  +--> Project Environment Setup
         |
         +--> project-specific runtimes
         +--> compilers / SDKs
         +--> container tooling
         +--> database clients
         +--> hardware tools
         +--> project validation commands
```

A valid eFrame installation must be able to exist independently of any project.

A valid project specification must declare its own environment requirements independently of the requirements needed to run eFrame.

## Host capabilities

The project environment model requires an explicit concept of **Host Capabilities**.

A host is the concrete machine or execution environment on which eFrame is running or against which a project environment is being evaluated.

Illustrative host capability data may include:

```yaml
host:
  os: windows
  tools:
    git: 2.52
    node: 24.4
    docker: 28
```

The project declares requirements separately:

```yaml
environment:
  development:
    requires:
      - node: ">=22"
      - docker: ">=27"
      - arduino-cli: ">=1.3"
```

The environment-resolution problem is therefore:

```text
Project Requirements
        |
        v
Host Capabilities
        |
        v
Environment Gap
        |
        v
Provisioning / Validation Plan
```

## Multiple environment roles

A project may require more than one environment role.

Examples include:

- developer workstation;
- CI runner;
- build server;
- deployment host;
- test rig;
- embedded target;
- production server.

These roles may have different requirements and must not be collapsed into a single global machine definition.

Illustrative shape:

```yaml
environments:
  development:
    requires:
      - node
      - vscode
      - docker

  ci:
    requires:
      - node
      - docker

  target:
    type: linux-server
```

The definitive schema is deferred.

## Detection before provisioning

eFrame should first detect what is already available on the host before proposing changes.

Technology packs and environment definitions may therefore provide detection strategies such as:

- executable version commands;
- filesystem checks;
- registry checks;
- package-manager queries;
- environment variables;
- platform-specific discovery logic.

Illustrative example:

```yaml
requires:
  - id: arduino-cli
    version: ">=1.3"
    detect:
      command: arduino-cli version
```

## Provisioning is optional

eFrame is not required to install every dependency automatically.

Some toolchains may support automated provisioning through package managers or scripts. Others may require manual installation, licensing, hardware access or privileged configuration.

Technology packs may therefore describe provisioning capability explicitly.

Illustrative model:

```yaml
install:
  automated: false
```

or:

```yaml
install:
  windows:
    winget: <package-id>
  linux:
    apt: <package-name>
  macos:
    brew: <formula>
```

The exact schema is deferred.

When automated provisioning is unavailable, eFrame should report the unmet requirement and provide actionable guidance rather than pretending the environment can be completed automatically.

## Plan and inspection requirements

Consistent with ADR-0004, environment provisioning is a side effect and must be inspectable before execution.

The expected lifecycle is:

```text
DECLARE
   |
   v
DETECT
   |
   v
RESOLVE GAP
   |
   v
PLAN
   |
   v
INSPECT
   |
   v
OPTIONALLY APPLY
   |
   v
VALIDATE
```

A provisioning plan should expose at least:

- missing or incompatible requirements;
- detected host state;
- commands that would run;
- package managers or installers involved;
- files or configuration that would change;
- privilege requirements;
- operations that cannot be automated;
- validation checks to run afterwards.

No installation or environment mutation should occur silently.

## CLI implications

The final CLI vocabulary is not fixed by this ADR, but the architecture should support distinct operations for eFrame health and project-environment health.

Illustrative commands may include:

```text
eframe setup

eframe doctor

eframe doctor --project
```

or equivalent context-aware behaviour where `eframe doctor` detects whether it is being run globally or inside an eFrame-managed project.

The important requirement is conceptual separation, not these exact command names.

## Consequences

- eFrame remains lightweight and independent from project toolchains.
- Project dependencies can vary freely by archetype, profile and technology pack.
- `doctor` can become a comparison between declared requirements and actual host capabilities.
- Multiple environment roles can be supported without assuming a single workstation model.
- Automated provisioning can be added incrementally without becoming mandatory.
- Commercial, licensed or hardware-specific toolchains can be represented honestly as manual requirements.
- Environment setup inherits the same inspect-before-apply trust model as repository and publication operations.

## Non-goals

This ADR does not define:

- the final installation method for eFrame;
- the stable Host schema;
- the stable Environment schema;
- mandatory use of any package manager;
- automatic installation of all supported technologies;
- configuration management for arbitrary operating-system state;
- container orchestration beyond project-specific technology packs.

## Revisit when

Revisit this decision when the Host, Environment and Technology Pack schemas are formalized and when the stable `doctor` and provisioning commands are designed.
