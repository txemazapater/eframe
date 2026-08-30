# eFrame TUI Lab — Clack

This folder is intentionally experimental and isolated from eFrame's stable functional design.

Its purpose is to answer practical interface questions early:

- How does the assistant feel in a real terminal?
- Are the questions understandable without documentation?
- Is the amount of context before each decision appropriate?
- How should validation errors, cancellation and summaries be shown?
- Does the assistant feel like a guided engineering conversation rather than a generic installer?

Nothing in this experiment should be treated as a committed eFrame API or decision model.

## Run

```bash
cd experiments/tui-clack
npm install
npm start
```

Requires Node.js 20 or newer.

## Current discovery flow

The first prototype deliberately asks only five substantive questions:

1. Project name.
2. One-sentence purpose.
3. Primary project archetype.
4. Starting maturity/state.
5. Areas where eFrame should provide assistance.

It then shows a summary and asks for confirmation. It does not create files, initialize Git or access GitHub.

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
- cancellation behaviour;
- whether eFrame explains enough without becoming verbose;
- whether the interaction feels deterministic and trustworthy.

## Next experiments

This lab can contain alternate entry points rather than changing one prototype endlessly. For example:

```text
src/
  index.js          # current compact flow
  minimal.js        # fewer questions
  conversational.js # more explanatory feedback
  panels.js         # richer visual grouping
```

That will let us compare interaction styles side by side before selecting a direction for the real CLI.
