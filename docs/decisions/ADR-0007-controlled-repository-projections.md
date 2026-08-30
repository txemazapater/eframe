# ADR-0007: Controlled repository projections preserve Git semantics

- Status: Accepted
- Date: 2026-08-30

## Context

ADR-0005 separates Git from remote providers and permits multiple remotes with different roles. ADR-0006 separates private source repositories from artifact distribution targets.

A further requirement exists between those two cases: a project may need to expose or replicate only an authorized subset of its primary repository into another repository or storage domain.

Examples include:

- publishing only public documentation and examples from a private engineering repository;
- maintaining a partner-facing repository containing an approved subset of a larger project;
- exporting SDK headers, schemas or integration material while retaining implementation details privately;
- producing a public repository from a private source repository without exposing the private Git history;
- maintaining several derived repositories for different audiences or purposes.

This operation is neither a complete Git mirror nor merely artifact distribution.

## Decision

eFrame will model this operation as a **controlled repository projection**.

A projection is an explicit, reproducible policy that derives an authorized repository view from a source repository and sends that derived state to another destination.

The conceptual flow is:

```text
Source Repository
       |
       v
Projection Policy
       |
       +-- include
       +-- exclude
       +-- transform
       +-- rename
       +-- sanitize
       |
       v
Derived Git Tree
       |
       v
Destination Repository
```

The resulting destination is a derived repository, not implicitly a mirror of the source.

## Git semantics remain fundamental

Although eFrame introduces higher-level concepts such as projection, publication and promotion, repository operations must continue to be expressed through **Git semantics and Git verbs wherever the operation is fundamentally a Git operation**.

The abstraction must not replace Git with an unrelated synchronization vocabulary.

Conceptually, a projection ultimately produces Git-native state:

```text
source ref
   -> select / derive tree
   -> inspect diff
   -> create commit
   -> update branch/ref
   -> push to remote
```

The exact Git implementation may evolve, but eFrame should preserve recognizable concepts such as:

- repository;
- working tree / derived tree;
- branch;
- ref;
- commit;
- tag;
- remote;
- fetch;
- diff;
- merge where applicable;
- push.

Higher-level eFrame verbs may orchestrate these operations, but they must map clearly to Git operations rather than hide or redefine Git behaviour.

For example, an eventual command such as:

```text
eframe project <projection>
```

would be orchestration terminology only. Its plan should still reveal that the result will create a derived tree, commit it and push a ref to a configured Git remote.

The final CLI vocabulary is intentionally not fixed by this ADR.

## Illustrative specification

A future Project Specification may express a projection approximately as:

```yaml
projections:
  - id: public-docs
    source:
      repository: primary
      ref: main

    target:
      repository: github-public
      branch: main

    include:
      - README.md
      - LICENSE
      - docs/public/**
      - examples/**

    exclude:
      - docs/internal/**
      - tooling/private/**

    mode: derived
```

This schema is illustrative. The accepted decision is the existence and semantics of the projection concept, not these exact field names.

## Projection is not sparse checkout

A projection must not be confused with a developer convenience such as Git sparse checkout.

Sparse checkout controls which paths appear in a working tree. It does not establish a security boundary and does not guarantee that excluded information is absent from reachable Git history or objects.

A public or lower-trust projection must therefore produce a destination whose reachable Git state contains only information authorized for that destination.

Implementation techniques such as `git subtree`, filtered history, temporary trees, synthetic commits or `git filter-repo` may eventually be useful, but none of them defines the architectural model.

The policy and resulting authorized Git state are the abstraction; the implementation mechanism is replaceable.

## Relationship to mirror, publish and distribute

The following concepts are distinct:

```text
mirror
  -> reproduce Git repository state

projection
  -> derive an authorized Git repository view

publish
  -> expose an authorized representation of a project

distribute
  -> make approved product artifacts available to consumers
```

A single primary repository may participate in several flows simultaneously:

```text
                    PRIMARY
                       |
        +--------------+---------------+
        |              |               |
        v              v               v
      mirror       projection       artifact
        |              |               |
        v              v               v
     backup        public repo      distribution
```

## Projection policy

A projection policy may eventually support operations such as:

- include paths;
- exclude paths;
- rename paths;
- generate files;
- transform content;
- sanitize content;
- select branches or refs;
- define destination branches;
- attach generated metadata;
- apply validation rules before the derived commit is created or pushed.

Transform and sanitize operations are intentionally left open because they can introduce significant security and reproducibility concerns.

For the first implementation, simple deterministic path selection may be preferable.

## Provenance

A derived repository should retain enough provenance to identify the source state from which it was produced without exposing private source history.

Possible metadata may include:

```json
{
  "sourceCommit": "abc123...",
  "projection": "public-docs",
  "generatedAt": "...",
  "eframeVersion": "..."
}
```

The exact representation is deferred.

Provenance enables auditing, reproducibility and answering a fundamental question:

> Which authoritative source revision produced this derived repository state?

## Plan and inspection requirements

Consistent with ADR-0004, projection must be inspectable before it causes side effects.

A future eFrame plan should expose at least:

- source repository and source ref;
- projection policy;
- destination repository and destination ref;
- files included;
- files excluded;
- generated or transformed files;
- resulting Git diff;
- commits or refs that will be created or updated;
- push operations that will occur;
- validation or sanitization checks.

The user should be able to inspect the exact derived tree or diff before eFrame commits or pushes it.

## Security boundary

A projection to a public or less-trusted destination must be treated as a security boundary.

It is not sufficient to omit sensitive files from the visible tree if they remain reachable through the history that is pushed.

Therefore, eFrame must reason about the Git state that becomes reachable at the destination, not only about filesystem paths.

No projection should be considered safe merely because an include/exclude pattern appears correct.

## Consequences

- One authoritative repository can produce several audience-specific Git repositories.
- Private engineering history does not need to be exposed to public or partner repositories.
- eFrame can support public documentation, SDK, examples and partner views without duplicating their authoritative source manually.
- Projection policies can be versioned and reviewed alongside the project.
- Git remains the underlying repository model rather than being replaced by a generic file-sync abstraction.
- Plans can describe high-level intent while still exposing the concrete Git operations that will occur.
- Mirror, projection and artifact distribution remain distinct operations with different security properties.

## Non-goals

This ADR does not yet define:

- the final CLI command names;
- the stable Project Specification schema;
- the Git history strategy for derived repositories;
- bidirectional synchronization between source and derived repositories;
- automatic merging of changes made directly in a derived repository;
- a specific filtering implementation;
- a complete content-sanitization engine.

Unless a later ADR explicitly establishes otherwise, projections should initially be considered **source-to-destination and authoritative from the source side**.

## Revisit when

Revisit this decision when the Project Specification, Git adapter and Plan schemas are formalized. At that point eFrame must define how projection policies map to inspectable Git-native actions and how destination history is maintained over successive projections.
