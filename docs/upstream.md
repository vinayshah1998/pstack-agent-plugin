# Upstream provenance

- Source repository: `https://github.com/cursor/plugins`
- Source directory: `pstack/`
- Source commit: `23a56e2dac2efd54788056db8eced26e371d7b5e`
- Source plugin version: `0.14.6`
- Standalone subtree head before port edits: `29bb0c786e8beaa603893a36584244d7e0143639`
- Portable plugin version: `0.15.0`
- License: MIT

The standalone repository was created with `git subtree split --prefix=pstack`, retaining 77 commits that affected the source subtree. The portable port replaces the Cursor manifest and unnamespaced Cursor agents/automations with a root Agent Plugins 1.0 manifest, immediate Agent Skills, and a `dev.kiro` extension.

Future upstream updates should repeat the classification and validation steps in `agent-sops/port-cursor-plugin-to-agent-plugin.sop.md`; do not blindly merge the monorepo subtree because Cursor-only metadata and runtime assumptions must remain outside the portable core.
