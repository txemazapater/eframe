# ADR-0006: Source repositories and distribution repositories are separate concerns

- Status: Accepted
- Date: 2026-08-30

## Context

Some projects, especially firmware and product software, require the engineering repository to remain private while validated releases must be publicly accessible to deployed products.

A representative case is a private firmware project whose devices need to discover and download the latest approved firmware without receiving access to the source repository.

Mirroring the private repository to a public remote is not appropriate for this use case. The public system needs the validated product artifact, not the engineering history, source code, internal documentation, toolchain configuration or development branches.

This reveals an important distinction: the repository that contains the source of a product does not have to be the repository or service from which the product is distributed.

## Decision

eFrame will treat **source management** and **artifact distribution** as separate architectural concerns.

A project may therefore use one repository for private engineering work and another repository or service as a public distribution target.

Illustrative flow:

```text
PRIVATE ENGINEERING DOMAIN

Source repository
      |
      v
    Build
      |
      v
    Test
      |
      v
  Validate
      |
      v
    Sign
      |
      v
   Promote
      |
      v
PUBLIC DISTRIBUTION DOMAIN

Distribution target
      |
      v
Release artifacts
      |
      v
Products / devices / consumers
```

The operation crossing the boundary is **artifact promotion**, not repository mirroring.

## Repository and target roles

ADR-0005 introduced multiple Git remotes and roles such as `primary`, `mirror`, `backup` and `publish`.

This decision extends that model by distinguishing an engineering/source role from a distribution role.

Illustrative specification:

```yaml
repositories:
  - id: firmware-source
    role: source
    visibility: private
    provider: forgejo

  - id: firmware-distribution
    role: distribution
    visibility: public
    provider: github

release:
  source: firmware-source
  target: firmware-distribution
```

The definitive schema is intentionally deferred. The architectural distinction is the accepted decision.

A distribution target does not necessarily have to be a Git repository. Future targets may include package registries, object storage, container registries, web endpoints or vendor-specific distribution systems.

## Artifact distribution

The release pipeline should operate on explicit build artifacts rather than implicitly exposing repository contents.

For firmware, an illustrative distribution set may contain:

```text
firmware-v1.4.2.bin
firmware-v1.4.2.sha256
firmware-v1.4.2.sig
manifest.json
release-notes.md
```

A minimal manifest might expose information such as:

```json
{
  "product": "machine-controller-x",
  "channel": "stable",
  "version": "1.4.2",
  "file": "firmware-v1.4.2.bin",
  "sha256": "...",
  "published": "2026-08-30T00:00:00Z"
}
```

A deployed product can then implement a deliberately small update mechanism:

```text
fetch manifest
      |
      v
compare version
      |
      v
download artifact
      |
      v
verify integrity and authenticity
      |
      v
apply update
```

This supports a simplified OTA-style workflow without requiring the device to understand Git or authenticate against the private engineering repository.

## Integrity and authenticity

A checksum alone verifies integrity but does not establish who authorized an artifact.

For product firmware, eFrame should be capable of modelling cryptographic signing as part of the release policy. Devices or consumers may verify artifacts using an embedded or otherwise trusted public key while the corresponding private signing key remains protected within the release process.

The exact signing technology and key-management mechanism are technology- and environment-specific decisions and are not fixed by this ADR.

## Release channels

Artifact distribution may expose independent release channels such as:

- `dev`
- `beta`
- `stable`
- `lts`

Channels belong to release/distribution policy rather than source-control topology.

Different deployed products may therefore follow different channels without requiring separate source repositories.

## Publish versus mirror

This ADR reinforces the distinction introduced in ADR-0005:

- **Mirror** reproduces Git state at another Git location.
- **Publish** exposes an authorized representation of a project.
- **Distribute** makes approved product artifacts available to their intended consumers.

For a firmware product, publishing or distributing a `.bin` file and its metadata does not imply publishing the source repository.

The same abstraction applies beyond firmware:

```text
firmware       -> .bin / .hex
Windows app    -> .msi / .exe
library        -> npm / NuGet / other package
container      -> OCI image
mobile app     -> application package / store artifact
documentation  -> generated site or document bundle
```

## Architectural consequence

Artifact distribution becomes a first-class cross-cutting concept in eFrame:

```text
Project
   |
   v
Build Artifact
   |
   v
Release Policy
   |
   v
Distribution Target
```

This model must remain independent from the Git provider model.

A source repository provider may be Forgejo while the distribution target is GitHub Releases, an HTTP server, S3-compatible storage, a package registry or another system entirely.

Providers and adapters should expose capabilities so eFrame can determine which release and distribution operations are available without hard-coding a particular platform.

## Plan and inspection requirements

Consistent with ADR-0004, release and distribution operations are side effects and must be inspectable before execution.

A future eFrame plan should be able to show at least:

- artifact(s) selected for release;
- source build/version identity;
- destination target;
- release channel;
- generated manifest and metadata;
- checksums and signatures to be produced;
- remote operations that will occur;
- validation gates required before promotion.

Promotion to a public distribution target must be an explicit operation.

## Consequences

- Private source code can remain private while product releases remain publicly consumable.
- Deployed products do not need Git access or credentials to the engineering repository.
- Public distribution does not require exposing private Git history.
- Release security can be based on signed artifacts rather than trust in the hosting provider alone.
- Git hosting and artifact hosting can evolve independently.
- The same release model can support firmware, desktop applications, packages, containers and other project archetypes.
- eFrame gains a reusable abstraction for release promotion and artifact distribution instead of implementing firmware-specific OTA logic in the core.

## Non-goals

This ADR does not define:

- an OTA protocol;
- a firmware bootloader;
- a specific signing algorithm;
- key storage or PKI;
- a stable project-specification schema;
- a mandatory public hosting provider;
- automatic publication without an explicit release policy.

Those decisions belong to later technology packs, environments, providers and project-specific policies.

## Revisit when

Revisit this decision when the Project Specification and Plan schemas are formalized, because artifact identity, release channels, promotion gates and distribution targets will need explicit representations in those contracts.
