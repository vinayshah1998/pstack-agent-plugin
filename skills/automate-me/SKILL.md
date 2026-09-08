---
name: automate-me
description: Draft or revise a personal mode skill from explicit preferences and optional evidence from a user-supplied transcript or current-session digest.
---

# Automate me

Turn the user's working conventions into one concise `<handle>-mode` Agent Skill.

This skill sequences an inline mining pass, the portable Agent Skills authoring workflow, and the `unslop` skill. It does not replace them.

## 1. Find existing mode skills

Search the active client's project and user skill roots. On Kiro use `.kiro/skills/**/*-mode/SKILL.md` and `~/.kiro/skills/*-mode/SKILL.md`. Preserve an existing category and update in place unless the user explicitly asks to start over.

## 2. Acquire evidence safely

Use only an explicit transcript path, supported export, or digest from the visible conversation. Never scan undocumented client storage or unrelated workspaces. If a transcript is available, partition it into independent time slices and look for repeated evidence about response style, autonomy, delegation, verification, code discipline, and process.

For repeat runs, update the existing skill by default. Start fresh only when the user explicitly asks, after asking why. In update mode, mine evidence since the skill's last edit when source control can establish it, ask what changed or is missing rather than recreating the skill from zero, and preserve sections the user has not contradicted. Revise sections with new evidence and add sections only for genuinely new rules.

Require corroboration before elevating a mined preference. A one-off correction is weak evidence.

## 3. Ask focused questions

Use structured input when available, otherwise ask one concise question at a time. Cover only gaps that evidence cannot answer. Two short rounds plus one open question are usually enough.

## 4. Draft a portable skill

Write the new skill under the active client's project or user skill root. On Kiro, default to `.kiro/skills/<handle>-mode/SKILL.md` unless the user chooses a global install.

Cluster corroborated signals into only the sections that apply:

- **Response style**: length, tone, format.
- **Autonomy and delegation**: how much to do without asking, subagents, model-to-task choices, specialized workflows, and parallelism.
- **Understand first**: skills to reach for when scoping or investigating a change.
- **Prose and code discipline**: principles, lint tools, style guides.
- **Review and verify**: repro posture, verification skills, live-testing tools.
- **Process**: worktrees, commits, reviews, and merge tooling.
- **Skills**: authoring habits, fixing a skill mid-task, and proposing new skills.

Cross-check across slices before elevating a signal. Patterns seen in two or more slices are high-confidence. Lone signals are weak and usually get dropped.

The frontmatter must contain a lowercase hyphenated `name` matching its directory and a `description` that names the handle and explicit trigger. Do not emit client-only frontmatter such as `disable-model-invocation`, `mode`, `paths`, icons, or colors.

Reference other installed skills by skill name, not filesystem paths or copied prose. Apply the `unslop` skill and the Agent Skills specification. Validate the result before presenting it.

## 5. Review and land

Show the draft and incorporate feedback. Expect multiple iterations and cut ruthlessly. Keep only non-default, evidenced preferences. Do not push, publish, or open a review unless the user requested that external action.

## Guardrails

- Do not overfit one conversation. A preference stated once and contradicted later is noise.
- Do not read unrelated private transcripts.
- Keep the skill operational; do not restate another skill's full content, invent metaphors, or write prose for its own sake.
- Reference other skills by name rather than copying their prose.
- Add a section only for a specific non-default rule. Do not invent symmetric sections when the user has no rule there.
- Keep generic instructions about "the user" or "the human" rather than embedding personal data unnecessarily.

## Evaluation

A `-mode` skill is subjective output. Ask the user whether it reads like them and whether it missed anything. Run a description-optimization loop only when trigger accuracy proves to be a problem in practice.

## When not to use

- The user wants a task-specific skill: use the portable Agent Skills authoring workflow without mining preferences.
- The user wants one narrow workflow, such as how they write commit messages: create a regular skill, not a mode skill.
