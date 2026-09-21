# Agent profile compatibility

Retain explicit `allowedTools: []` in `dev.kiro/agents/pstack-poteto.json` for kiro-cli 2.22.1 discovery compatibility, even though v3 uses `permissions.rules`. Omission and an empty array are not interchangeable for this observed CLI. The empty array adds no preapproved tools; preserve existing tools visibility and permissions. Do not remove it during cleanup or migration until this compatibility requirement is intentionally dropped and discovery is re-tested.
