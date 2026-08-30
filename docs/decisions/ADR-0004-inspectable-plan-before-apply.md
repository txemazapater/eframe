# ADR-0004: Inspectable plan before apply

- Status: Accepted
- Date: 2026-08-30

## Context

eFrame may eventually generate configuration files, source files, scripts, CI workflows and repository metadata, and may also propose commands or remote operations such as package installation, Git initialization or GitHub changes.

A simple scaffold-and-execute model makes those actions difficult to review and mixes planning with side effects. This is especially undesirable for generated executable content such as shell scripts, PowerShell, batch files, YAML workflows or commands invoking external tooling.

## Decision

eFrame will separate project planning from execution.

The intended lifecycle is:

```text
DISCOVER -> RESOLVE -> PLAN -> PREVIEW / INSPECT -> APPLY -> VALIDATE
```

`PLAN` produces a complete representation of the intended project changes before those changes are applied.

The plan should distinguish at least:

- files to create, modify or remove;
- generated file contents;
- executable scripts;
- external commands;
- local Git operations;
- remote operations such as GitHub changes;
- validation steps.

`PREVIEW / INSPECT` must be side-effect free. Users must be able to inspect both the list of outputs and the actual generated content before execution.

`APPLY` is an explicit transition. Generating a file and executing a command are separate classes of action and should remain separately controllable.

## Rationale

This model improves transparency, auditability and safety while preserving automation.

It also allows plans to be reviewed by humans, CI systems or AI agents before application and supports non-interactive workflows without sacrificing visibility.

The design follows a simple trust principle:

> eFrame should not execute an operation that the user could not inspect first.

## Consequences

Positive consequences:

- generated scripts and configuration can be reviewed before use;
- dry-run becomes a first-class capability rather than a debugging feature;
- repository generation is decoupled from command execution;
- plans can potentially be exported, diffed, reviewed and replayed;
- local and remote side effects can be controlled independently.

Costs and constraints:

- the plan requires a stable internal data model;
- renderers must produce content before apply;
- the UI must support useful inspection without becoming cumbersome;
- secret or environment-dependent values will require careful treatment in previews.

## Future considerations

Possible command shapes include:

```text
eframe plan
eframe inspect
eframe diff
eframe apply
eframe apply --files
eframe apply --commands
eframe apply --remote
```

These command names are illustrative and are not yet a stable CLI contract.
