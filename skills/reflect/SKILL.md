---
name: reflect
description: Review the active conversation or supplied transcript for durable lessons, separate structural enforcement from prose guidance, and propose concrete skill edits for approval.
---

# Reflect

Mine a supplied transcript or current-session digest for durable lessons and route them into explicit skill or tooling changes.

Invoke when the user says "reflect" or "/reflect". Skip when the conversation is trivial, off-topic, or already covered by an existing skill the parent followed correctly. One-offs are not learnings.

## 1. Acquire the record

Use an explicit transcript path, a host-supported export, or a concise digest prepared from the current conversation. Do not scan undocumented client session directories or unrelated projects. If no record is available, ask for a path or operate on the visible conversation only.

## 2. Dispatch independent reviewers

Run three read-only reviewers concurrently through the host's subagent capability:

- Judgment using `references/judgment-reviewer.md`.
- Tooling using `references/tooling-reviewer.md`.
- Divergent analysis using `references/divergent-reviewer.md`.

Dispatch the three reviewer contexts in one concurrent batch. Use the configured `judgment and prose` role when available and `auto` otherwise. Reviewers may use read-only MCP evidence when their agent permissions allow it. Configure actual tools and permissions to retain needed evidence access while withholding file-write tools; a prose `readonly` label is not a security boundary. They return findings only and never edit files.

The parent supplies the record acquired above. Do not discover client-private transcript directories or scan unrelated workspaces.

## 3. Synthesize

Use one synthesis agent with `references/synthesizer.md`. It receives the three reports and returns **Accepted**, **Rejected**, and **Backlog**. Use the configured `judgment and prose` role when available and `auto` otherwise. Its quality check spot-verifies citations when evidence access permits.

## 4. Prefer structural enforcement

Move any lesson that is more reliable as a lint, script, metadata flag, runtime check, or validator from **Accepted** to **Backlog**. Follow `principle-encode-lessons-in-structure`.

## 5. Get approval and apply

Present the complete synthesis and wait for explicit approval before changing skills. Skill changes affect future sessions. Apply only the approved subset:

- Make trivial existing-skill edits directly.
- For substantive edits, description tuning, or new skills, follow the portable Agent Skills authoring workflow rather than inventing the shape ad hoc, and run the repository's skill validator.
- File structural improvements to the configured backlog only when the user authorized that external write.

## 6. Report

List edits applied, new skills, structural backlog items, rejected findings with reasons, routing and validation for every applied edit, and any citation spot checks or evidence gaps.
