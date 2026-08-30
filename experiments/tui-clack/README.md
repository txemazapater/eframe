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

## Run

```bash
cd experiments/tui-clack
npm install
npm start
```

Requires Node.js 20 or newer.

## Visual identity experiment

The current prototype starts with a deliberately small text logo. This is cosmetic and has no architectural significance; it exists so that terminal identity, vertical space and visual tone can be evaluated alongside the prompts.

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

This creates a natural future command model:

```text
eframe new                 # interactive discovery + preview
eframe new --dry-run       # never apply changes
eframe plan project.yaml   # resolve and render a plan
eframe inspect             # inspect planned outputs and operations
eframe diff                # compare plan with current workspace
eframe apply               # explicit execution
```

The exact command names are still experimental.

## Why these questions?

The purpose question is intentionally placed before the archetype selector. This lets us test whether a short human description provides useful context before forcing the project into a category.

The archetype is the first structural decision because it should determine the later decision path.

Starting state is orthogonal to archetype: a web application can be new, existing or exploratory, and eFrame should behave differently in each case.

The assistance selection is currently experimental. It lets us test whether users want explicit control over eFrame's scope or whether this should eventually be inferred from the archetype/profile.

## Things to observe while testing

Do not judge only whether the prompts technically work. Pay attention to:

- terminal density;
- wording length;
- whether hints help or distract;
- keyboard navigation;
- visibility of the current context;
- usefulness of the summary;
- whether the preview makes side effects understandable;
- whether generated file contents are comfortable to inspect in-terminal;
- cancellation behaviour;
- whether eFrame explains enough without becoming verbose;
- whether the interaction feels deterministic and trustworthy;
- whether the logo adds identity without wasting too much space.

## Next experiments

This lab can contain alternate entry points rather than changing one prototype endlessly. For example:

```text
src/
  index.js          # current compact flow + dry-run preview
  minimal.js        # fewer questions
  conversational.js # more explanatory feedback
  panels.js         # richer visual grouping
```

A near-term experiment should add an interactive inspector capable of selecting a planned file and viewing its rendered content without writing it to disk.

That will let us compare interaction styles side by side before selecting a direction for the real CLI.
