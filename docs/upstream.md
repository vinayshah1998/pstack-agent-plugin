# Upstream provenance

- Source repository: `https://github.com/cursor/plugins`
- Source directory: `pstack/`
- Source commit: `efa2a531985e0a8084d36ff3cf87233be8a9f34b`
- Source plugin version: `0.14.7`
- Standalone subtree head before port edits: `29bb0c786e8beaa603893a36584244d7e0143639`
- Portable plugin version: `0.15.0`
- License: MIT

The standalone repository was created with `git subtree split --prefix=pstack`, retaining 77 commits that affected the source subtree. The portable port replaces the Cursor manifest and unnamespaced Cursor agents/automations with a root Agent Plugins 1.0 manifest, immediate Agent Skills, and a `dev.kiro` extension.

Future upstream updates should repeat the classification and validation steps in `agent-sops/port-cursor-plugin-to-agent-plugin.sop.md`; do not blindly merge the monorepo subtree because Cursor-only metadata and runtime assumptions must remain outside the portable core. Use the `sync-pstack-upstream` skill to compare the pinned commit with the current parent.

## Sync log

### 23a56e2 (0.14.6), re-reviewed after the port

The fork was split at this commit, so its forge-neutral playbooks, watch stop conditions, GitHub merge completion, and TypeScript schema rule arrived verbatim. Its Fable 5.1 default bumps landed on skills the port had already converted to role dispatch. Remaining raw model slugs were then adapted:

- `playbooks/bug-fix.md`, `perf-issue.md`, `hillclimb.md`, `feature.md`, `refactoring.md`, `multi-phase-plan.md`, `scripts/check-plan.mjs`: adapt. Replaced Cursor model slugs with `setup-pstack` role names.
- `skills/setup-pstack/SKILL.md`: adapt. Added the parent's model-strength split as role guidance with Kiro IDs.
- `.cursor-plugin/plugin.json`, `typescript-best-practices` `paths` frontmatter: skip. Cursor-only fields.

### 23a56e2 to efa2a53 (0.14.6 to 0.14.7)

- `.cursor-plugin/plugin.json`: skip. Adds the Cursor-only `logo` field. The Agent Plugins 1.0 manifest schema has no logo field.
- `assets/logo.png`: skip. Referenced only by the Cursor `logo` field. No portable or Kiro consumer reads it.
