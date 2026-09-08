---
name: no-comments
description: Run an independent comment-sicko review, verify its findings, fix accepted root causes, and offer structural encodings for claimed constraints.
---

# No comments

Defer to Comment Sicko's fresh perspective.

## Scope

Use the caller's files or diff. Otherwise use the current diff against the appropriate base branch, including the working tree.

## Steps

1. Dispatch a read-only reviewer that follows the `comment-sicko` skill. On Kiro, prefer the optional `pstack-comment-sicko` agent profile. Pass the scope, not a duplicate rule set. Read-only behavior must be enforced by the reviewer agent's tools and permissions, not by the prompt alone.
2. Inspect its report and diff. Reject application-code edits, scope escapes, exception-protected deletions, invented facts, misstated or unsupported `MUST KILL` claims, and flags that treat intentional kept code as guilty. Reshape flags triggered by surprises in our code stay actionable. Audit missed in-scope lint and TypeScript suppressions; correctness or safety suppressions remain actionable `MUST KILL`s. A keep survives only with proof that it covers something the requested scope cannot change. Restore a deletion only with an exact exception and scoped proof. Before accepting a thin `IMPORTANT` or `do not remove` kill or keep, use `how` or `why` on its symbol. If a kill is ambiguous, do not restore it; if a keep is refuted or remains ambiguous, delete it. Re-run one rejected review with the failure named. Reject a second report, leave it open, and report that `/no-comments` failed.
3. Fix trivial accepted findings directly by deleting a dead path, dropping a parameter, or using the real API. If any fix needs a new shape, invoke `architect` once for the accepted set and surrounding code. Stop at the sketch; Step 4 implements.
4. Implement the smallest root-cause correction in scope. Remove every named workaround. If the root cause is out of scope, land the smallest in-scope fix and report the rest open. `principle-fix-root-causes` and `principle-redesign-from-first-principles` guide intent only; neither authorizes widening the fence or fixing instances outside it. Never bolt on symptom guards.
5. For comments that claim an invariant, such as `do not remove`, `do not change wording`, or `talk to X before changing`, leave keeps about things the requested scope cannot change. Offer the cheapest in-scope type, runtime check, test, or CI lint. Wait for approval before adding new enforcement beyond the requested scope. If approved, encode then delete; otherwise delete, report the constraint open, and sketch out-of-scope work.
6. Report the deletion count, restored comments, reruns, architect sketch, root-cause fixes, encoding offers and encodings, unenforced constraints, rejected findings, and other open work.
