---
name: setup-pstack
description: Configure the available models or named agents pstack uses per role. On Kiro, detect entitled models and write project or user steering. Use for setup-pstack, configuring pstack models, or changing role assignments.
---

# Setup pstack

Write an always-applied, host-specific role map without copying model identifiers from another client.

## 1. Detect the host and available models

On Kiro CLI v3, run:

```bash
kiro-cli chat --v3 --list-models --format json-pretty
```

This is the dependable source for models pstack roles can use. If the host also exposes named-agent discovery, use it for completeness. If no models or agents can be detected, ask the user to provide identifiers they can verify. `inherit-parent` and `auto` are always valid role values even when discovery does not list them.

Treat that output as authoritative for the current account. Other clients must use their supported model or agent discovery mechanism. If the host cannot enumerate models, ask the user to choose only from identifiers they can verify.

## 2. Load current state

On Kiro, prefer project configuration at `.kiro/steering/pstack-models.md`. Use `~/.kiro/steering/pstack-models.md` only when the user explicitly requests a global mapping. Read the existing file when present.

## 3. Map roles

Show every role with its current model or named agent, marking any explicit identifier outside the applicable detected set as needing a choice. Ask whether to accept it as-is or change specific roles, offering detected models or agents plus `inherit-parent` and `auto` as options. Both aliases inherit the parent chat model when the host supports that behavior. Prefer structured input over free text when available. For panel roles (`adversarial reviewers`, `arena candidates and judge`, and `architecture candidates`), use a list only when the host can dispatch its entries independently: one subagent runs per entry, so the list length sets fan-out. `swarm workers` is the default role assignment for every worker unless a race assigns another role per arm.

Map these roles to an available model or named agent:

- feature and refactoring
- bug fix
- performance investigation
- judgment and prose
- code exploration
- explanation and synthesis
- adversarial reviewers
- arena candidates and judge
- swarm workers
- architecture candidates

Every explicit model or named-agent identifier written must occur in the applicable detected set. `inherit-parent` and `auto` always pass. If a chosen explicit identifier is unavailable, stop and ask again.

Use multiple entries only when the host can dispatch them independently. Keep `auto` as a valid fallback meaning the active host chooses. Do not translate Cursor suffixes such as `-thinking-max`, `-fast-xhigh`, or `-sol-max` into Kiro IDs.

The parent pstack splits work by model strength. Follow the same shape through role assignments:

- Judgment, prose, and explanation go to the strongest reasoning model available.
- Feature and refactoring code, bug fix, performance investigation, code exploration, and swarm workers go to a fast code model.
- Adversarial, arena, and architecture panels take one entry per distinct model family.

Read each model's description in the list output before assigning it. Some experimental models carry traffic-retention or human-review notes. Assign such a model only when the user accepts that handling for the role's inputs.

## 4. Validate

Every explicit model must occur in the detected Kiro model list. Every named agent must validate with `kiro-cli agent validate`. Replace unavailable entries with `auto` or another confirmed identifier.

## 5. Write Kiro steering

Write `.kiro/steering/pstack-models.md` with:

```markdown
---
inclusion: always
---
# pstack role mapping. One line per role. Delete a line to fall back to the skill default.
# `inherit-parent` or `auto`: use the parent chat model. Entries in a panel list each count toward its fan-out.

- feature and refactoring: auto
- bug fix: auto
- performance investigation: auto
- judgment and prose: auto
- code exploration: auto
- explanation and synthesis: auto
- adversarial reviewers: auto
- arena candidates and judge: auto
- swarm workers: auto
- architecture candidates: auto
```

Replace `auto` only with validated model or agent identifiers. Overwrite this generated file as one unit so reruns are idempotent. Tell the user that new sessions load the updated mapping.

## 6. Offer project verification

Check whether the project has a way to drive the real app for proof, such as a `verify-*` skill or an existing harness. If neither exists, offer once: "Want a project-local verification skill so agents can drive the app the way a user does and prove changes work?" On Kiro, generated project skills belong under `.kiro/skills/`; invoke the available `create-verification-skill` mechanism only after the user agrees. On no, move on without pushing.
