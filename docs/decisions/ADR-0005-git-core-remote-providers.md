# ADR-0005: Git is core; remote repository services are optional providers

- Status: Accepted
- Date: 2026-08-30

## Context

A project repository may use Git without being hosted on GitHub. It may be local-only or use GitHub, GitLab, Gitea, Bitbucket, Azure DevOps, a generic SSH remote, or another service.

Treating GitHub as part of the repository model would couple eFrame's core workflow to one hosting platform and would incorrectly make remote-provider features a prerequisite for project creation.

A project may also have more than one remote repository. For example, an on-premises Forgejo or Gitea instance may be the primary engineering repository while GitHub is used as a mirror, backup target or publication destination.

Therefore the repository model must not assume that `origin`, GitHub, the primary source of truth and the public collaboration endpoint are the same thing.

## Decision

Git is a core version-control concern in eFrame.

Remote hosting, collaboration features and hosted CI systems are optional providers layered on top of Git.

The architecture must therefore distinguish at least:

```text
Version control
  -> Git

Remote / forge provider
  -> none | GitHub | GitLab | Gitea | Forgejo | Bitbucket | Azure DevOps | generic Git | ...
```

A project must be valid with no configured remote.

A project may have zero, one or multiple remotes. Each remote may declare a semantic role independently of its provider.

Initial role vocabulary is intentionally small and extensible:

- `primary` — normal authoritative engineering remote;
- `mirror` — replicated copy of another repository;
- `backup` — resilience or archival destination;
- `publish` — external/public distribution target.

These roles describe intent. They do not imply that every provider supports every synchronization or publication workflow.

Provider-specific behaviour must be selected through declared capabilities rather than assumed globally.

Illustrative model:

```yaml
repository:
  vcs: git

  remotes:
    - name: origin
      provider: forgejo
      role: primary
      host: git.internal.local

    - name: github
      provider: github
      role: mirror
      repository: organization/project
      sync: push

providers:
  github:
    capabilities:
      repositories: true
      issues: true
      pull_requests: true
      ci: github-actions
      releases: true
      branch_protection: true
```

A generic Git remote may expose only transport/repository capabilities and no issue tracker, pull-request model or hosted CI.

## Mirror versus publish

A mirror and a publication target are not necessarily equivalent.

`mirror` means maintaining another Git copy of the repository or selected refs.

`publish` means producing an externally distributable representation of the project. Publication may require policy checks, generated artifacts or even a derived repository rather than blindly pushing the complete internal Git history.

This distinction is important when an internal repository contains branches, files, history or metadata that must never become externally reachable.

Therefore eFrame must not implement publication by assuming that excluding a branch or file from a push is sufficient to remove sensitive history.

## Consequences

- eFrame can create and manage local Git projects without any hosted forge.
- GitHub-specific files and operations are generated only when the selected provider requires them.
- CI becomes provider-aware rather than synonymous with GitHub Actions.
- Remote-provider setup can occur after the local project has already been planned or created.
- Future providers can be added without changing the decision engine's core Git model.
- The project specification must avoid conflating repository, remote hosting, collaboration and CI.
- An on-premises Git forge can be the primary project authority while external providers remain optional.
- Multiple remote roles can be represented without relying on conventional remote names such as `origin`.
- Mirror, backup and publication workflows can evolve independently.

## Architectural guidance

The implementation should evolve toward boundaries similar to:

```text
core/
  vcs/
    git/

providers/
  github/
  gitlab/
  gitea/
  forgejo/
  bitbucket/
  generic-git/
  none/
```

Remote-provider selection should be based on capabilities and role, not on hard-coded assumptions about a single host.

This is conceptual structure, not yet a mandatory source-tree layout.

## Revisit when

Revisit this decision only if eFrame later supports a non-Git VCS as a first-class concern. Even then, hosted collaboration providers and remote roles should remain separate from the VCS abstraction.
