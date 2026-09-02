---
name: reflect
description: Review the active conversation or supplied transcript for durable lessons, separate structural enforcement from prose guidance, and propose concrete skill edits for approval.
---

# Reflect

Mine a supplied transcript or current-session digest for durable lessons and route them into explicit skill or tooling changes.

## 1. Acquire the record

Use an explicit transcript path, a host-supported export, or a concise digest prepared from the current conversation. Do not scan undocumented client session directories or unrelated projects. If no record is available, ask for a path or operate on the visible conversation only.

## 2. Dispatch independent reviewers

Run three read-only reviewers concurrently through the host's subagent capability:

- Judgment using `references/judgment-reviewer.md`.
- Tooling using `references/tooling-reviewer.md`.
- Divergent analysis using `references/divergent-reviewer.md`.

Reviewers may use read-only MCP evidence when their agent permissions allow it. They return findings only and never edit files.

## 3. Synthesize

Use one synthesis agent with `references/synthesizer.md`. It receives the three reports and returns **Accepted**, **Rejected**, and **Backlog**. Use the configured judgment role when available and `auto` otherwise.

## 4. Prefer structural enforcement

Move any lesson that is more reliable as a lint, script, metadata flag, runtime check, or validator from **Accepted** to **Backlog**. Follow `principle-encode-lessons-in-structure`.

## 5. Get approval and apply

Present the complete synthesis and wait for explicit approval before changing skills. Skill changes affect future sessions. Apply only the approved subset:

- Make trivial existing-skill edits directly.
- For substantive edits or new skills, follow the portable Agent Skills authoring workflow and run the repository's skill validator.
- File structural improvements to the configured backlog only when the user authorized that external write.

## 6. Report

List edits applied, new skills, structural backlog items, and rejected findings with reasons.
