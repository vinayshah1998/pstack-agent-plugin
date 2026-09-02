---
name: interrogate
description: Run independent adversarial reviewers over a change, synthesize consensus and disagreements, and make a pragmatic lead judgment without auto-applying changes.
---

# Interrogate

Run independent reviewers against the same code, intent, and rubric. Diversity may come from models or isolated reviewer contexts. Agreement is high-signal; lone findings still require lead review.

## 1. Determine scope

Use caller-supplied files or diff. Otherwise review the current branch against its appropriate base, including the working tree. Gather only the surrounding files required to understand the change.

## 2. State intent

Write one paragraph describing what the change is trying to accomplish. Derive it from the request, commits, review description, and code. Ask only when no evidence can resolve a genuine product decision.

## 3. Dispatch reviewers

Use the host's parallel subagent capability. Select the configured `adversarial reviewers` role when present and available, otherwise use independent available reviewers. Enforce read-only access through agent tools and permissions.

Give every reviewer the same filled template from `references/reviewer-prompt.md`, including:

1. Stated intent.
2. Diff or scoped files.
3. `references/rubric.md`.
4. `references/code-quality-review.md`.

Record the actual reviewer or model used. An unavailable configured model falls back to an available reviewer; never pass another client's model identifier to the host.

## 4. Synthesize

Parse all findings, identify consensus, retain useful lone findings, deduplicate equivalent issues, and preserve explicit disagreements.

## 5. Lead judgment

Apply `references/lead-judgment.md`. Categorize every finding:

- **Act on.** Correctness, security, or maintainability issue that should block.
- **Consider.** Legitimate concern with uncertain cost-benefit.
- **Noted.** Valid but low-priority observation.
- **Dismissed.** Incorrect, context-free, or merely stylistic.

For each finding, name reviewers, category, and one-line rationale.

## Output

Return **Intent**, **Reviewers**, **Act on**, **Consider**, **Noted**, **Dismissed**, and **Agreement map**. Do not modify the reviewed code automatically.
