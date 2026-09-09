# Upstream provenance

- Source repository: `https://github.com/cursor/plugins`
- Source directory: `pstack/`
- Source commit: `71ed0d1076fec562c1b74ee353121a8d00f75382`
- Source plugin version: `0.15.0`
- Standalone subtree head before port edits: `29bb0c786e8beaa603893a36584244d7e0143639`
- Portable plugin version: `0.15.0`
- License: MIT

The portable plugin version mirrors the source plugin version. It moves only when the parent's `.cursor-plugin/plugin.json` version moves, so port-only changes between parent releases do not bump it.

The standalone repository was created with `git subtree split --prefix=pstack`, retaining 77 commits that affected the source subtree. The portable port replaces the Cursor manifest and unnamespaced Cursor agents/automations with a root Agent Plugins 1.0 manifest, immediate Agent Skills, and a `dev.kiro` extension.

Future upstream updates should repeat the classification and validation steps in `agent-sops/port-cursor-plugin-to-agent-plugin.sop.md`; do not blindly merge the monorepo subtree because Cursor-only metadata and runtime assumptions must remain outside the portable core. Use the `sync-pstack-upstream` skill to compare the pinned commit with the current parent.

## Path mapping

Parent paths land at the same fork path except for these renames. Apply them before every merge, and rewrite skill-name references (`**tdd**`, `` `/tdd` ``, `skills/tdd/`) in ported prose to the fork name.

| Parent path | Fork path | Reason |
|---|---|---|
| `skills/tdd/` | `skills/pstack-tdd/` | Name collision with a differently scoped `tdd` skill users already install; the parent's is a bug-fix regression ritual, not a TDD methodology. |
| `skills/teach/` | `skills/pstack-teach/` | Name collision with a differently scoped `teach` skill (tutoring workspace); the parent's is a one-shot explanation over `how` and `why`. |

The frontmatter `name` in each renamed skill equals the fork directory, as Agent Skills requires.

## Sync log

### 23a56e2 (0.14.6), re-reviewed after the port

The fork was split at this commit, so its forge-neutral playbooks, watch stop conditions, GitHub merge completion, and TypeScript schema rule arrived verbatim. Its Fable 5.1 default bumps landed on skills the port had already converted to role dispatch. Remaining raw model slugs were then adapted:

- `playbooks/bug-fix.md`, `perf-issue.md`, `hillclimb.md`, `feature.md`, `refactoring.md`, `multi-phase-plan.md`, `scripts/check-plan.mjs`: adapt. Replaced Cursor model slugs with `setup-pstack` role names.
- `skills/setup-pstack/SKILL.md`: adapt. Added the parent's model-strength split as role guidance with Kiro IDs.
- `.cursor-plugin/plugin.json`, `typescript-best-practices` `paths` frontmatter: skip. Cursor-only fields.

### 23a56e2 to efa2a53 (0.14.6 to 0.14.7)

- `.cursor-plugin/plugin.json`: skip. Adds the Cursor-only `logo` field. The Agent Plugins 1.0 manifest schema has no logo field.
- `assets/logo.png`: skip. Referenced only by the Cursor `logo` field. No portable or Kiro consumer reads it.

### efa2a53 to 71ed0d1 (0.14.7 to 0.15.0)

Four parent commits: a logo shrink, a density and mannered-prose pass across every skill with two new principle leaves, a punctuation pass, and the 0.15.0 bump. 94 parent paths changed.

- 70 skill and guide paths: port. Three-way merge against the pinned commit applied cleanly. The fork's only adaptation in most of them was the removed `disable-model-invocation` frontmatter, which stays removed.
- 19 skill paths (`arena`, `automate-me`, `how`, `interrogate`, `no-comments`, `poteto-mode` and eight of its playbooks, `principle-subtract-before-you-add`, `reflect`, `setup-pstack`, `swarm`, `why`): adapt. Took the parent's prose; kept the fork's `setup-pstack` role names in place of Cursor model slugs, host-neutral subagent dispatch in place of `subagent_type`/`readonly` settings, and permission-enforced read-only behavior in place of prose labels.
- `skills/principle-attack-the-premise/SKILL.md`, `skills/principle-test-behavior-not-implementation/SKILL.md`: port. New leaves, added with the Cursor-only frontmatter field stripped. Indexed by `poteto-mode` and `docs/guide/08-principles.md` through the merged text.
- `skills/how/references/critic-prompt.md`, `skills/how/references/critique-rubric.md`: port (deletion). The parent removed critique mode from `how`; nothing in the fork references them after the merge.
- `README.md`: skip. The parent's edits are playbook and principle counts in tables the fork's portable README does not carry.
- `.cursor-plugin/plugin.json`, `assets/logo.png`: skip. Cursor-only manifest and logo.

Known gap carried forward, not introduced here: eight skill files still name `~/.cursor/` transcript and skill paths (`recall`, `show-me-your-work`, three `reflect` references, three `poteto-mode` playbooks). Present since the initial port; a Kiro transcript mapping is a follow-up adaptation.
