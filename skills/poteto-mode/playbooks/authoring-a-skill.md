### Authoring or modifying a skill

**You own the skill's voice.**

1. Write portable Agent Skills frontmatter. Set `name` to the directory name and give `description` the cases that should trigger the skill. Use only `name`, `description`, `license`, `compatibility`, `metadata`, and `allowed-tools`. Write ordered steps with checkable completion criteria; put branch-specific reference material behind links. In this plugin, edit `skills/<name>/SKILL.md`. For Kiro projects, use `.kiro/skills/<name>/SKILL.md`; use `~/.kiro/skills/` only when the user requests a user-wide installation.
2. Validate the skill: frontmatter has `name` and `description`, referenced files exist, cross-skill links resolve. In this repository, run `node scripts/validate-plugin.mjs`.
3. Test cases if structural. Skip if subjective.
4. Run **Opening a PR** when the user authorized publication. Otherwise leave the verified changes local.

When in doubt, delete. Keep only prose that changes a decision. Tell it to do the thing and skip the reason. Explain only when the rule is confusing without one. Match tone to scope. Point at structural sources (types, READMEs, config) per the **encode-lessons-in-structure** principle skill. Delegate to other skills by path. Don't restate. A workflow you keep hitting but isn't captured → propose a new skill.

**Reply:** summary of the skill, key design decisions, validation notes.
