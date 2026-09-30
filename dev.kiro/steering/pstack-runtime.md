---
inclusion: always
---

# pstack runtime mapping for Kiro

Use this mapping whenever a pstack skill describes a host capability rather than a portable Agent Skills primitive.

- Interpret `Task`, `subagent_type`, and `generalPurpose` as Kiro subagent dispatch. Use a named Kiro agent when one exists; otherwise use an available general-purpose subagent.
- Enforce read-only work with the target agent's tools and permissions. A prose `readonly` label is not a security boundary.
- Treat model names in pstack skills as role hints. Prefer the role mapping in `.kiro/steering/pstack-models.md`, then an available Kiro model. Never send Cursor model suffixes to Kiro.
- Nested `run_in_background`, `environment`, and `cloud_base_branch` fields have no guaranteed Kiro equivalent. Run bounded work in the current session and wait for it. Use a separately operated top-level `kiro-cli chat --v3 --cloud --repo <owner/repo>` session only when the user requests durable cloud execution.
- Interpret `AskQuestion` as Kiro structured input when available, otherwise ask one concise chat question.
- Store project skills under `.kiro/skills/` and user skills under `~/.kiro/skills/`.
- Store project steering under `.kiro/steering/` and user steering under `~/.kiro/steering/`.
- Do not inspect undocumented Kiro transcript storage. Transcript-dependent skills require an explicit transcript path, supported session export, or a user-provided digest.
- Treat Cursor Routines, Automations, `/loop`, `/goal`, and `cursor-team-kit` as optional capabilities. Use a bounded current-session loop or an available project verification skill. Report unsupported durable scheduling rather than claiming it exists.
- External writes such as Slack messages, tickets, pull requests, deployments, and repository publication require the user's request and the normal Kiro safety controls. Never infer authorization from pstack prose.
