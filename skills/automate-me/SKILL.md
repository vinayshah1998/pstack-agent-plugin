---
name: automate-me
description: Draft or revise a personal mode skill from explicit preferences and optional evidence from a user-supplied transcript or current-session digest.
---

# Automate me

Turn the user's working conventions into one concise `<handle>-mode` Agent Skill.

## 1. Find existing mode skills

Search the active client's project and user skill roots. On Kiro use `.kiro/skills/**/*-mode/SKILL.md` and `~/.kiro/skills/*-mode/SKILL.md`. Preserve an existing category and update in place unless the user explicitly asks to start over.

## 2. Acquire evidence safely

Use only an explicit transcript path, supported export, or digest from the visible conversation. Never scan undocumented client storage or unrelated workspaces. If a transcript is available, partition it into independent time slices and look for repeated evidence about response style, autonomy, delegation, verification, code discipline, and process.

Require corroboration before elevating a mined preference. A one-off correction is weak evidence.

## 3. Ask focused questions

Use structured input when available, otherwise ask one concise question at a time. Cover only gaps that evidence cannot answer. Two short rounds plus one open question are usually enough.

## 4. Draft a portable skill

Write the new skill under the active client's project or user skill root. On Kiro, default to `.kiro/skills/<handle>-mode/SKILL.md` unless the user chooses a global install.

The frontmatter must contain a lowercase hyphenated `name` matching its directory and a `description` that names the handle and explicit trigger. Do not emit client-only frontmatter such as `disable-model-invocation`, `mode`, `paths`, icons, or colors.

Reference other installed skills by skill name, not filesystem paths or copied prose. Apply the `unslop` skill and the Agent Skills specification. Validate the result before presenting it.

## 5. Review and land

Show the draft and incorporate feedback. Keep only non-default, evidenced preferences. Do not push, publish, or open a review unless the user requested that external action.

## Guardrails

- Do not overfit one conversation.
- Do not read unrelated private transcripts.
- Do not restate another skill's full content.
- Do not invent symmetric sections when the user has no rule there.
- Keep generic instructions about "the user" rather than embedding personal data unnecessarily.
