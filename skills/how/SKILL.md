---
name: how
description: Explain how a subsystem works, including ownership, layering, runtime flow, and placement questions. Use before changing unfamiliar code or when asked where behavior belongs.
---

# How

Explore the codebase and produce a senior-engineer onboarding explanation. Build a working mental model rather than annotated source code.

## 1. Scope and complexity

Infer the narrowest useful interpretation from the request and state it so the user can redirect. Classify the question:

- **Simple.** One module, utility, or narrow call path. Explore and explain directly.
- **Complex.** Multiple files, services, or a cross-cutting flow. Partition into two to four independent exploration angles.

When uncertain, start simple and add explorers only if the direct path hits a gap.

## 2. Explore

For a complex question, dispatch all read-only explorers concurrently through the host's subagent capability. Give each a distinct angle and the base prompt in `references/explorer-prompt.md`. Read-only must be enforced by the target agent's tools and permissions.

Each explorer must:

- Search broadly for types, interfaces, entry points, and ownership boundaries.
- Trace callers, callees, data flow, state, and side effects through actual code.
- Stop only when it can explain the complete path without guessing.
- Return components, flow, files read, and non-obvious behavior.

For a simple question, one read-only explorer may perform the exploration and explanation using `references/explainer-prompt.md`.

## 3. Synthesize

For complex work, give all explorer results to one synthesis agent using `references/explainer-prompt.md`. Use the host-selected explanation role from pstack configuration when available; otherwise use any capable available agent. The synthesizer reconciles overlap and contradictions and cites concrete files and symbols.

## 4. Present

Return the synthesized explanation with only light edits. Use the sections that help:

- **Overview.** What it is, what it does, and why it exists.
- **Key concepts.** The types, services, and abstractions required for the mental model.
- **How it works.** Trigger, step-by-step flow, data movement, decisions, and effects.
- **Where things live.** The smallest useful file and directory map.
- **Gotchas.** Surprises, sharp edges, and missing evidence.

## Critique mode

When the user asks for architectural issues, run the explanation first. Then dispatch independent read-only critics using `references/critic-prompt.md` and `references/critique-rubric.md`. Model diversity is optional; independent contexts are required.

Lead the judgment. Categorize findings as **Act on**, **Consider**, **Noted**, or **Dismissed**, and explain disagreements. Do not apply changes automatically.
