---
name: setup-pstack
description: Configure the available models or named agents pstack uses per role and choose their reasoning budget. On Kiro, detect entitled models and write project or user steering. Use for setup-pstack, configuring pstack models, changing the pstack budget, or changing role assignments.
---

# Setup pstack

Write an always-applied, host-specific role map and reasoning budget without copying model identifiers from another client.

## 1. Detect the host and available models

On Kiro CLI v3, run:

```bash
kiro-cli chat --v3 --list-models --format json-pretty
```

This is the dependable source for models pstack roles can use. If the host also exposes named-agent discovery, use it for completeness. If no models or agents can be detected, ask the user to provide identifiers they can verify. `inherit-parent` and `auto` are always valid role values even when discovery does not list them.

Treat that output as authoritative for the current account. Other clients must use their supported model or agent discovery mechanism. If the host cannot enumerate models, ask the user to choose only from identifiers they can verify.

## 2. Load current state

On Kiro, prefer project configuration at `.kiro/steering/pstack-models.md`. Use `~/.kiro/steering/pstack-models.md` only when the user explicitly requests a global mapping. Read the existing file when present. Treat its `reasoning budget` and `reasoning effort` lines as the current choice. If they are absent, start with the `unlimited` budget and `max` effort.

## 3. Choose a reasoning budget

Prefer structured input over free text. Offer these choices and show the current choice when one exists:

- `unlimited` uses `max` reasoning effort.
- `large` uses `xhigh` reasoning effort.
- `medium` uses `high` reasoning effort.
- `small` uses `medium` reasoning effort.

On Kiro, apply the selected effort through the independent `reasoning_effort` dispatch field for every pstack subagent. Keep each model identifier unchanged. If another host has no independent effort control, use only that host's documented mechanism and report the limitation. Never infer effort from a model identifier.

## 4. Map roles

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

Use multiple entries only when the host can dispatch them independently. Keep `auto` as a valid fallback meaning the active host chooses. Do not translate Cursor suffixes such as `-thinking-max`, `-fast-xhigh`, or `-sol-max` into Kiro IDs.

The parent pstack splits work by model strength. Follow the same shape through role assignments:

- Judgment, prose, and explanation go to the strongest reasoning model available.
- Feature and refactoring code, bug fix, performance investigation, code exploration, and swarm workers go to a fast code model.
- Adversarial, arena, and architecture panels take one entry per distinct model family.

Read each model's description in the list output before assigning it. Some experimental models carry traffic-retention or human-review notes. Assign such a model only when the user accepts that handling for the role's inputs.

## 5. Validate

Every explicit model must occur in the detected Kiro model list. Every named agent must validate with `kiro-cli agent validate`. The reasoning effort must be `medium`, `high`, `xhigh`, or `max`, as selected by the budget table. Replace unavailable role entries with `auto` or another confirmed identifier.

## 6. Write Kiro steering

Write `.kiro/steering/pstack-models.md` with:

```markdown
---
inclusion: always
---
# pstack role mapping. One line per role. Delete a line to fall back to the skill default.
# `inherit-parent` or `auto`: use the parent chat model. Entries in a panel list each count toward its fan-out.
# Apply `reasoning effort` through the host dispatch control. Do not add it to model identifiers.

- reasoning budget: unlimited
- reasoning effort: max
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

Replace `auto` only with validated model or agent identifiers. Replace the budget and effort lines with the selected pair. Overwrite this generated file as one unit so reruns are idempotent. Tell the user that new sessions load the updated mapping and budget.

## 7. Offer project verification

Check whether the project has a way to drive the real app for proof, such as a `verify-*` skill or an existing harness. If neither exists, offer once: "Want a project-local verification skill so agents can drive the app the way a user does and prove changes work?" On Kiro, generated project skills belong under `.kiro/skills/`; invoke the available `create-verification-skill` mechanism only after the user agrees. On no, move on without pushing.
