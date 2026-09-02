# Compatibility

| Capability | Agent Plugins 1.0 | Kiro | Notes |
|---|---|---|---|
| Skills and references | Supported | Supported through Powers | All root skills use portable Agent Skills frontmatter. |
| MCP servers | Supported | Supported | pstack ships no MCP server. Host MCPs remain available according to the active agent. |
| Custom agents | Not standardized | Supported by templates in `dev.kiro/agents/` | Profiles are optional and must be copied to a Kiro agent directory. |
| Model routing | Not standardized | Supported through Kiro model IDs and steering | Run `setup-pstack`; never reuse Cursor model suffixes. |
| Parallel subagents | Host capability | Supported when the active Kiro agent exposes subagents | Read-only guarantees come from agent permissions. |
| Background and nested cloud workers | Not standardized | No equivalent guaranteed for nested dispatch | Use bounded in-session work or a separately operated top-level cloud session. |
| Transcripts | Not standardized | Explicit path, export, or digest required | pstack does not inspect undocumented Kiro session storage. |
| Cursor Routines and Automations | Not standardized | Not bundled | Use an external event listener or scheduler. |
| Benny workflows | Portable skills | Usable with configured Slack, tracker, repository, and UI-control capabilities | The coordinator alone may hold Slack-write access. |
| Bundled scripts | Skill-local assets | Usable when required runtimes and CLIs exist | Bun-based tools require Bun; GitHub operations require authenticated `gh`; worktree audits require `jq` and use `rg` only when transcript correlation is requested. |

## Graceful degradation

A skill must report an unavailable host capability rather than fabricate success. Missing model diversity reduces a panel to available agents. Missing transcript access uses a user-provided digest. Missing durable scheduling turns an unattended workflow into a bounded current-session run. Missing app control blocks live-verification claims.
