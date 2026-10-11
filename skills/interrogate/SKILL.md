---
name: interrogate
description: Run independent adversarial reviewers over a change, synthesize consensus and disagreements, and make a pragmatic lead judgment without auto-applying changes.
---

# Interrogate

Run one reviewer per configured `adversarial reviewers` role entry against the same code, intent, and rubric. Model or isolated-context diversity is the adversarial signal. The deliverable is a synthesized verdict. Do not apply changes automatically.

## Step 1. Scope

Identify what to review from context:

- If the user points at files or a diff, use that scope.
- On a feature branch, review the full changeset against the appropriate base branch.
- If the request refers to recent work, gather the relevant files.

Include only the surrounding files required to understand the change.

## Step 2. Intent

Before dispatching reviewers, state the intent in one clear paragraph. Derive it from the user's message, commit messages, the review description when one exists, and the code. Ask only when the evidence cannot resolve a genuine product decision.

## Step 3. Dispatch reviewers

Use the host's parallel subagent capability. Run one reviewer per configured `adversarial reviewers` role entry. If the role is missing, use independent available reviewers. Missing model diversity reduces the panel to available agents.

For `inherit-parent` or `auto`, omit explicit model or agent selection. If a configured entry is unavailable, use a confirmed suitable reviewer, record the fallback, and update the role mapping separately. Never pass another client's model identifier to the host.

Enforce read-only access through each reviewer's tools and permissions. Give every reviewer the same filled template from `references/reviewer-prompt.md`, including the intent, diff or scoped files, `references/rubric.md`, and `references/code-quality-review.md`.

## Step 4. Synthesize

Parse every finding. Merge findings that describe the same issue, and name the reviewers who raised each one. Findings raised independently by two or more reviewers are the highest signal. Read lone findings, but weight them accordingly. Record explicit disagreements.

## Step 5. Lead judgment

Read `references/lead-judgment.md`. Put every finding in one bucket, with the reviewers who raised it and a one-line rationale.

- **Act on.** A real correctness, security, or maintainability issue that would block a review.
- **Consider.** A legitimate issue whose benefit may not outweigh the cost now.
- **Noted.** A valid but non-actionable point for the current scope.
- **Dismissed.** A wrong, low-value, or context-free finding, with a brief reason.

## Output format

### Intent
> [The intent from Step 2]

### Reviewers
- Reviewer [label]: [actual reviewer or model], [N findings]

### Act on
[Each finding, its reviewers, and why it matters.]

### Consider
[Each finding, its reviewers, and the tradeoff.]

### Noted
[Brief list.]

### Dismissed
[Each with a brief rationale.]

### Agreement map
[Where reviewers agreed or diverged, and what the pattern means.]
