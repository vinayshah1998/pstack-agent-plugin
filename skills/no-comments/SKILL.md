---
name: no-comments
description: Run an independent comment-sicko review, verify its findings, fix accepted root causes, and offer structural encodings for claimed constraints.
---

# No comments

Use the caller's files or diff. Otherwise use the current diff against the appropriate base branch, including the working tree.

1. Dispatch a read-only reviewer that follows the `comment-sicko` skill. On Kiro, prefer the optional `pstack-comment-sicko` agent profile. Pass the scope, not a duplicate rule set.
2. Inspect the report. Reject scope escapes, application-code edits, exception-protected deletions, invented facts, and unsupported `MUST KILL` claims. Use `how` or `why` when a constraint is ambiguous.
3. Fix trivial accepted findings directly. If a fix needs a new shape, invoke `architect` once for the accepted set before implementation.
4. Implement the smallest root-cause correction in scope. Remove named workarounds rather than adding symptom guards.
5. For comments that claim an invariant, offer the cheapest in-scope type, runtime check, test, or CI lint. Wait for approval before adding new enforcement beyond the requested scope.
6. Report deletion candidates, retained exceptions, rejected findings, root-cause fixes, encoding offers, and remaining work.

Read-only behavior must be enforced by the reviewer agent's tools and permissions, not by the prompt alone.
