# pstack Agent Plugin

pstack is Lauren Tan's collection of rigorous engineering workflows for writing less, higher-quality code and parallelizing work with verifiable boundaries. This repository is a standalone Agent Plugins 1.0 port of the original [`cursor/plugins/pstack`](https://github.com/cursor/plugins/tree/main/pstack) package, with a Kiro runtime adapter.

## What is portable

The root package follows [Agent Plugins 1.0](https://agent-plugins.org/):

```text
pstack-agent-plugin/
├── plugin.json
├── skills/
├── dev.kiro/
├── agent-sops/
└── docs/
```

Agent Plugins standardizes the manifest, Agent Skills, and optional MCP configuration. pstack ships skills and skill-local scripts; it does not ship an MCP server.

## Install in Kiro

1. In Kiro IDE, open **Powers** and choose **Add Custom Power**.
2. Import this repository from GitHub or select the local repository root.
3. Start Kiro CLI v3 and run `/powers` to confirm `pstack` is installed.
4. Ask Kiro to use `poteto-mode`, or install the optional `pstack-poteto` agent profile from [`dev.kiro/README.md`](./dev.kiro/README.md).
5. Run the `setup-pstack` skill if you want explicit Kiro model or named-agent routing.

Kiro agent profile installation, validation commands, runtime mappings, and unsupported hosted automation behavior are documented in [`dev.kiro/README.md`](./dev.kiro/README.md).

## Main workflow

Use the `poteto-mode` skill for non-trivial engineering work. It selects a playbook, applies the relevant principle skills, delegates bounded work when useful, and verifies the real artifact before reporting completion.

Representative skills include:

- `how` for code and architecture walkthroughs.
- `why` for evidence-backed design history.
- `architect` and `arena` for competing designs.
- `swarm` for partitioned parallel work.
- `interrogate` for adversarial review.
- `tdd`, `blast-radius`, and `no-comments` for implementation quality.
- `technical-writing` and `unslop` for prose.
- `comment-sicko` for independent comment review.
- `triage-issue-reports` and `reproduce-and-fix-issues` for the portable Benny workflow contracts.
- `sync-pstack-upstream` for reviewing and porting parent changes without overwriting portable or Kiro adaptations.

The full guide remains under [`docs/guide/`](./docs/guide/). Client-specific examples in the upstream guide should be interpreted through the Kiro runtime mapping. The pinned source and extraction history are recorded in [`docs/upstream.md`](./docs/upstream.md).

## Compatibility boundaries

Agent Plugins 1.0 does not standardize custom agents, model routing, transcript storage, hooks, hosted automations, or durable schedulers. The Kiro adapter provides optional custom-agent templates and explicit fallback rules. See [`docs/compatibility.md`](./docs/compatibility.md).

Cursor Routines, Cursor Automations, `/loop`, `/goal`, nested cloud workers, and `cursor-team-kit` are not represented as portable capabilities. pstack reports those capabilities as unavailable or uses a bounded Kiro fallback instead of claiming parity.

## Porting workflow

[`agent-sops/port-cursor-plugin-to-agent-plugin.sop.md`](./agent-sops/port-cursor-plugin-to-agent-plugin.sop.md) defines the repeatable workflow used for this port. It covers history extraction, manifest conversion, skill normalization, client-extension isolation, Kiro adaptation, and validation.

## Development and validation

Run:

```bash
node scripts/validate-plugin.mjs
kiro-cli agent validate --path dev.kiro/agents/pstack-poteto.json
kiro-cli agent validate --path dev.kiro/agents/pstack-comment-sicko.json
```

The Bun tools under `skills/poteto-mode/scripts/` retain their existing tests and typecheck commands.

## Attribution and license

The original pstack content is by [Lauren Tan](https://github.com/poteto) and is distributed under the MIT license in [`LICENSE`](./LICENSE). This standalone port preserves the extracted pstack git history.
