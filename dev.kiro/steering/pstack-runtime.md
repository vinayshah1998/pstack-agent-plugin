---
inclusion: always
---

# pstack runtime mapping for Kiro

Use this mapping whenever a pstack skill describes a host capability rather than a portable Agent Skills primitive.

- Use the active runtime's supported subagent dispatch. Select a named agent when available; otherwise use an available general-purpose worker. Respect its concurrency, continuation, and turn-yield rules.
- Enforce read-only work with the target agent's tools and permissions. A prose label is not a security boundary.
- Resolve role assignments from `.kiro/steering/pstack-models.md`, then the user's documented global mapping when present. Use only available model or agent identifiers, unchanged, and pass reasoning effort separately only when the runtime supports it.
- Use bounded in-session workers by default. Nested delegation, remote execution, and persistence across restarts require explicit host support. A separately operated top-level `kiro-cli chat --v3 --cloud --repo <owner/repo>` session requires the user's request and CLI support. It does not imply nested cloud dispatch.
- Interpret `AskQuestion` as Kiro structured input when available, otherwise ask one concise chat question.
- Store project skills under `.kiro/skills/` and user skills under `~/.kiro/skills/`.
- Store project steering under `.kiro/steering/` and user steering under `~/.kiro/steering/`.
- Use supported history tools or exports, an explicit transcript path, or a user-provided digest. Do not inspect undocumented Kiro transcript storage or unrelated workspaces. Missing tool traces limit what an audit can prove.
- Discover monitoring and scheduling tools in the active runtime. Use one finite monitor per task when requested and supported; verify its state before claiming it is armed. Otherwise use a bounded current-session loop and report that it cannot continue after the session ends. App verification uses a project verification skill or existing test driver.
- External writes such as Slack messages, tickets, pull requests, deployments, and repository publication require the user's request and the normal Kiro safety controls. Never infer authorization from pstack prose.
