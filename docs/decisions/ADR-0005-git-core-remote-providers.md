# ADR-0005: Git is core; remote repository services are optional providers

- Status: Accepted
- Date: 2026-08-30

## Context

A project repository may use Git without being hosted on GitHub. It may be local-only or use GitHub, GitLab, Gitea, Bitbucket, Azure DevOps, a generic SSH remote, or another service.

Treating GitHub as part of the repository model would couple eFrame's core workflow to one hosting platform and would incorrectly make remote-provider features a prerequisite for project creation.

## Decision

Git is a core version-control concern in eFrame.

Remote hosting, collaboration features and hosted CI systems are optional providers layered on top of Git.

The architecture must therefore distinguish at least:

```text
Version control
  -> Git

Remote / forge provider
  -> none | GitHub | GitLab | Gitea | Bitbucket | Azure DevOps | generic Git | ...
```

A project must be valid with `remote.provider: none`.

Provider-specific behaviour must be selected through declared capabilities rather than assumed globally.

Illustrative model:

```yaml
repository:
  vcs: git
  remote:
    provider: github

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

## Consequences

- eFrame can create and manage local Git projects without any hosted forge.
- GitHub-specific files and operations are generated only when the selected provider requires them.
- CI becomes provider-aware rather than synonymous with GitHub Actions.
- Remote-provider setup can occur after the local project has already been planned or created.
- Future providers can be added without changing the decision engine's core Git model.
- The project specification must avoid conflating repository, remote hosting, collaboration and CI.

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
  bitbucket/
  generic-git/
  none/
```

This is conceptual structure, not yet a mandatory source-tree layout.

## Revisit when

Revisit this decision only if eFrame later supports a non-Git VCS as a first-class concern. Even then, hosted collaboration providers should remain separate from the VCS abstraction.
