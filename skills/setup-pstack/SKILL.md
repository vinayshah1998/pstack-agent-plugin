---
name: setup-pstack
description: Configure the available models or named agents pstack uses per role. On Kiro, detect entitled models and write project or user steering. Use for setup-pstack, configuring pstack models, or changing role assignments.
---

# Setup pstack

Create a host-specific role map without copying model identifiers from another client.

## 1. Detect the host and available models

On Kiro CLI v3, run:

```bash
kiro-cli chat --v3 --list-models --format json-pretty
```

Treat that output as authoritative for the current account. Other clients must use their supported model or agent discovery mechanism. If the host cannot enumerate models, ask the user to choose only from identifiers they can verify.

## 2. Load current state

On Kiro, prefer project configuration at `.kiro/steering/pstack-models.md`. Use `~/.kiro/steering/pstack-models.md` only when the user explicitly requests a global mapping. Read the existing file when present.

## 3. Map roles

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

## 4. Validate

Every explicit model must occur in the detected Kiro model list. Every named agent must validate with `kiro-cli agent validate`. Replace unavailable entries with `auto` or another confirmed identifier.

## 5. Write Kiro steering

Write `.kiro/steering/pstack-models.md` with:

```markdown
---
inclusion: always
---

# pstack role mapping

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

If the project has no skill that drives the real app, offer the `create-verification-skill` skill once. On Kiro, generated project skills belong under `.kiro/skills/`.
