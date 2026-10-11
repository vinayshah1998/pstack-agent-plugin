---
name: reflect
description: Review the active conversation or supplied transcript for durable lessons, separate structural enforcement from prose guidance, and propose concrete skill edits for approval.
---

# Reflect

Mine a supplied transcript or current-session digest for durable lessons and route them into explicit skill or tooling changes.

Invoke when the user says "reflect" or "/reflect". Skip trivial conversations, one-offs, and behavior already covered by a skill the parent followed correctly.

## 1. Acquire the record

Use an explicit transcript path, a host-supported export, or a concise digest from the current conversation. Do not scan undocumented client session directories or unrelated projects. If no full record is available, operate on the visible conversation and name the evidence gap.

## 2. Dispatch independent reviewers

Run three reviewers concurrently through the host's subagent capability:

| Lens | `setup-pstack` role | Prompt template |
|---|---|---|
| Judgment | `judgment and prose` | `references/judgment-reviewer.md` |
| Tooling | `code exploration` | `references/tooling-reviewer.md` |
| Divergent analysis | `judgment and prose` | `references/divergent-reviewer.md` |

Resolve each role through `setup-pstack`. Use `auto` when a mapping is absent. For `auto` or `inherit-parent`, omit explicit model selection. If the host rejects a configured identifier, report the unavailable mapping and use `auto`. Never guess a replacement identifier.

Configure tools and permissions to retain needed read-only evidence access and withhold file-write and external-write tools. A prose-only read-only label is not a security boundary. Reviewers return findings and never edit files.

## 3. Synthesize

Dispatch one synthesis agent with `references/synthesizer.md`. Use the configured `judgment and prose` role or `auto`. Give it the three reports and read-only evidence access for citation spot checks. It returns Accepted, Rejected, and Backlog lists.

## 4. Check structural enforcement

Move an Accepted item to Backlog when a lint rule, script, metadata flag, runtime check, or validator would enforce it more reliably. Follow the **encode-lessons-in-structure** principle skill.

## 5. Apply approved changes

Present the full synthesis and wait for explicit approval before changing skills. Skill changes affect future sessions. Apply only the approved subset:

- Make a trivial existing-skill edit directly.
- For a substantive edit, a description change, or a new skill, follow the portable Agent Skills authoring workflow and run the repository's validator.
- File structural changes only when the user authorizes the external write.

## 6. Report

List applied edits, new skills, structural backlog items, rejected findings with reasons, routing and validation for each edit, citation spot checks, and evidence gaps.
