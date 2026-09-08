---
name: interrogate
description: Run independent adversarial reviewers over a change, synthesize consensus and disagreements, and make a pragmatic lead judgment without auto-applying changes.
---

# Interrogate

Run one reviewer per configured `adversarial reviewers` role entry against the same code, intent, and rubric. Model or isolated-context diversity is the adversarial signal; agreement is high-signal, but lone findings still require lead review.

## 1. Determine scope

Use caller-supplied files or diff. Otherwise review the current branch against its appropriate base, including the working tree. Gather only the surrounding files required to understand the change.

## 2. State intent

Write one paragraph describing what the change is trying to accomplish. Derive it from the request, commits, review description, and code. Ask only when no evidence can resolve a genuine product decision.

## 3. Dispatch reviewers

Use the host's parallel subagent capability. Select the configured `adversarial reviewers` role when present and available, otherwise use independent available reviewers. Enforce read-only access through agent tools and permissions.

Before dispatching reviewers, state the intent explicitly. Derive this from:

1. Stated intent.
2. Diff or scoped files.
3. `references/rubric.md`.
4. `references/code-quality-review.md`.

Write one clear paragraph. If you're unsure about the intent, ask the user before proceeding.

Give every reviewer the same filled template from `references/reviewer-prompt.md`, including the intent, diff or scoped files, rubric, and code-quality lens.

Launch all selected reviewers in one concurrent host dispatch when supported, one reviewer per configured role entry. When no configured panel is available, use independent available reviewer contexts.

If a configured role entry cannot be dispatched, check the host's reported available models or agents, use a confirmed suitable reviewer, record the fallback, and separately update the role mapping. Do not block the review on one unavailable entry. For `inherit-parent` or `auto`, omit an explicit model or agent selection instead of treating the alias as invalid.

Record the actual reviewer or model used. An unavailable configured model falls back to an available reviewer; never pass another client's model identifier to the host.

## 4. Synthesize

As results come back, build a unified picture:

1. **Parse all findings** from the reviewers.
2. **Identify consensus**. Findings raised independently by two or more reviewers are highest signal.
3. **Identify lone-reviewer findings**. Still worth reading, but weight accordingly.
4. **Deduplicate**. Different reviewers may describe the same issue differently. Merge these and note which reviewers raised them.
5. **Note disagreements**. If one reviewer flags something and another explicitly says the opposite, that is useful context for the verdict.

## 5. Lead judgment

You are the lead reviewer, a pragmatic senior engineer, not a neutral aggregator.

Read `references/lead-judgment.md` for the full framework.

Categorize every finding using these buckets:

- **Act on.** Real issues affecting correctness, security, or maintainability given the actual goals. These would block a real PR.
- **Consider.** Legitimate points, but uncertain whether they outweigh the cost of addressing them now. Worth the user's attention.
- **Noted.** Technically valid but not actionable: context-dependent, premature optimization, or low-impact for the current stage.
- **Dismissed.** Wrong, nitpicky, or missing context. Briefly explain why.

For each finding, include the reviewers that raised it, the category, and a one-line rationale.

## Output

Present the verdict in this structure:

### Intent
> [The stated intent paragraph from Step 2]

### Reviewers
- Reviewer [label]: [actual reviewer or model], [N findings] (one bullet per reviewer)

### Act On
[Findings that should be addressed. For each: description, which reviewers raised it, why it matters.]

### Consider
[Findings worth thinking about. For each: description, which reviewers raised it, tradeoff involved.]

### Noted
[Valid but low-priority. Brief list.]

### Dismissed
[Rejected findings with brief rationale.]

### Agreement Map
[Where reviewers agreed, where they diverged, and what the pattern of agreement or disagreement tells us.]

Do not modify the reviewed code automatically.
