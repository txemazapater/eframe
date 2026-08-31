# eFrame TUI Lab — Clack

This folder is intentionally experimental and isolated from eFrame's stable functional design.

Its purpose is to answer practical interface questions early:

- How does the assistant feel in a real terminal?
- Are the questions understandable without documentation?
- Is the amount of context before each decision appropriate?
- How should validation errors, cancellation and summaries be shown?
- Does the assistant feel like a guided engineering conversation rather than a generic installer?
- Can the user understand exactly what eFrame intends to do before anything is generated?
- Can generated scripts, configuration and commands be inspected comfortably before execution?

Nothing in this experiment should be treated as a committed eFrame API or decision model.

## Run as `eframe`

The experimental package exposes a real Node CLI entry point named `eframe`.

After pulling the latest changes:

```bash
cd experiments/tui-clack
npm install
npm link
```

Then launch it from a terminal with:

```bash
eframe
```

The CLI entry point starts with `#!/usr/bin/env node`. This is important on Windows because npm uses that shebang when it creates the `.cmd` and PowerShell shims that invoke the JavaScript file through Node.

If an older global link persists, recreate it:

```bash
npm unlink -g @eframe/tui-clack-lab
npm link
```

`npm start` remains available as a development fallback.

Requires Node.js 20 or newer.

## Current command surface

The lab now uses Commander as the CLI dispatcher.

```text
eframe                interactive assistant
eframe new            interactive project discovery
eframe init           adopt eFrame in an existing project
eframe doctor         inspect runtime / host / project environment
eframe plan           resolve an inspectable plan
eframe inspect        inspect planned outputs and operations
eframe diff           compare current and planned state
eframe apply          explicitly apply an inspected plan
eframe validate       validate project/environment state
eframe explain        explain resolved decisions
eframe publish        publication / projection / distribution entry point
```

At this stage, only the interactive assistant (`eframe` and `eframe new`) is functional. The other commands are intentionally registered but return an explicit "not implemented yet" message. This lets the command grammar evolve independently from implementation and prevents experimental stubs from pretending to perform real work.

Useful examples:

```bash
eframe --help
eframe new --dry-run
eframe doctor --help
eframe apply --help
```

The intended command grammar is:

```text
eframe <verb> [target] [options]
```

Commands express intent; flags refine execution.

## Visual identity experiment

The current prototype starts with the eFRAME terminal logo: lowercase blue `e`, uppercase white `FRAME`.

No extra dependency is used for the logo.

## Current discovery flow

The first prototype deliberately asks only five substantive questions:

1. Project name.
2. One-sentence purpose.
3. Primary project archetype.
4. Starting maturity/state.
5. Areas where eFrame should provide assistance.

It then builds an in-memory project preview containing:

- the normalized project specification;
- the files eFrame would generate;
- the actions eFrame would perform;
- the next archetype-specific decision path.

The prototype is a strict dry-run: it does not create files, initialize Git or access GitHub.

## Preview as a first-class interaction

Preview is not merely a debugging convenience. It is intended to become part of the eFrame trust model.

The intended lifecycle is:

```text
DISCOVER -> RESOLVE -> PLAN -> PREVIEW / INSPECT -> APPLY -> VALIDATE
```

`PLAN` should eventually contain not only filenames but the rendered output itself. The inspection UI must therefore be able to present generated Markdown, JSON, YAML, PowerShell, shell/batch scripts and other text artifacts before they are written or executed.

The plan should also distinguish between:

- passive files;
- configuration files;
- executable scripts;
- external commands;
- local Git operations;
- remote operations;
- validation operations.

`PREVIEW / INSPECT` must be side-effect free. `APPLY` must be an explicit user decision.

## Why these questions?

The purpose question is intentionally placed before the archetype selector. This lets us test whether a short human description provides useful context before forcing the project into a category.

The archetype is the first structural decision because it should determine the later decision path.

Starting state is orthogonal to archetype: a web application can be new, existing or exploratory, and eFrame should behave differently in each case.

The assistance selection is currently experimental. It lets us test whether users want explicit control over eFrame's scope or whether this should eventually be inferred from the archetype/profile.

## Things to observe while testing

Do not judge only whether the prompts technically work. Pay attention to terminal density, wording length, hints, keyboard navigation, context visibility, preview clarity, cancellation behaviour and whether eFrame feels deterministic and trustworthy.

## Next experiments

A near-term experiment should add an interactive inspector capable of selecting a planned file and viewing its rendered content without writing it to disk.
