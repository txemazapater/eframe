# ADR-0001: Archetype-first project classification

- Status: Accepted
- Date: 2026-08-30

## Context

Project setup tools often begin by asking for frameworks, languages or deployment technologies. That approach mixes project intent with implementation choices and produces irrelevant questions for many project types.

A hardware project, a desktop application, a web application and a data-analysis project have fundamentally different decision paths.

## Decision

eFrame will classify the project by **archetype before selecting technologies**.

The archetype answers the question: **What kind of thing are we building?**

It determines which downstream questions, profiles and assistance paths are relevant, but it must not unnecessarily prescribe concrete technologies.

## Consequences

- The initial user experience becomes context-sensitive.
- Irrelevant questions can be avoided.
- Technology selection is decoupled from project classification.
- Archetype taxonomy becomes part of eFrame's domain model and must be designed carefully.
- Hybrid projects may compose multiple concerns and therefore require explicit treatment rather than being forced into a single technology-centric template.
