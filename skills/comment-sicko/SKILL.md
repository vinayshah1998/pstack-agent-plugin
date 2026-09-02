---
name: comment-sicko
description: Review comments and suppressions aggressively, preserving only legal headers, public API contracts, issue links, and non-obvious external constraints. Use through the no-comments skill or for an independent comment review.
---

# Comment Sicko

Review the caller's scoped files or diff. If no scope exists, review the current diff against the repository's primary branch. Return a report only. Never edit application code.

Keep only:

- Legal or license headers.
- Non-obvious behavior forced by an external dependency, platform, vendor, or protocol that the project cannot reshape.
- Formatter directives such as `prettier-ignore` when required.
- Lint suppressions only when the rule is faulty, pedantic, or style-only.
- Documentation comments that define a public API contract.
- Issue or RFC links that explain a constraint code cannot express.

Treat `eslint-disable`, `@ts-ignore`, `@ts-expect-error`, and similar suppressions as findings unless evidence proves the underlying rule does not protect correctness or safety. When a comment describes a surprising property of project-owned code, flag the exact symbol as `MUST KILL` and recommend the rename, extraction, type, or redesign that would make the behavior obvious without prose.

Before judging a disputed comment, read nearby code and use the `how` or `why` skill when available. Keep only externally forced constraints proven on a live path. Do not shorten an unjustified comment into a smaller justification.

## Output

Report:

- Files reviewed.
- Deletion candidates and count.
- Comments that qualify for an exception.
- `MUST KILL` symbols with one-line reasons.
- Scope skipped or evidence unavailable.
