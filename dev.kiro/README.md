# Kiro integration

The Agent Plugins package exposes all root `skills/` through Kiro Powers. The files here add Kiro-specific behavior that Agent Plugins 1.0 does not standardize.

## Install the Power

In Kiro IDE, open **Powers**, choose **Add Custom Power**, and import this repository or its local root. Confirm that `/powers` in Kiro CLI v3 lists `pstack`.

## Install optional agent profiles

Copy the JSON files from `dev.kiro/agents/` into either:

- `.kiro/agents/` for one repository.
- `~/.kiro/agents/` for all repositories.

Validate each copied profile:

```bash
kiro-cli agent validate --path .kiro/agents/pstack-poteto.json
kiro-cli agent validate --path .kiro/agents/pstack-comment-sicko.json
```

Start the main profile with:

```bash
kiro-cli chat --v3 --agent pstack-poteto
```

The profiles use `includePowers: true`, so install the pstack Power before starting them.

## Model routing

Invoke the `setup-pstack` skill. On Kiro it lists entitled models and writes `.kiro/steering/pstack-models.md`. Model IDs are machine-specific and are not bundled.

## Benny automations

The portable `triage-issue-reports` and `reproduce-and-fix-issues` skills preserve Benny's workflow and safety contracts. Kiro does not provide a portable equivalent to Cursor's hosted Automations, Routine webhooks, or secret-request cards. To run Benny continuously, supply an external Slack event listener that starts a constrained Kiro session and owns Slack writes, credentials, scheduling, and retries. Workers must not receive Slack-write tools or credentials.

## Durable loops and cloud work

Kiro supports top-level cloud sessions, but Agent Plugins does not standardize durable schedulers or nested cloud workers. Use the mapping in `dev.kiro/steering/pstack-runtime.md`. Do not represent an in-session loop as a durable unattended service.
