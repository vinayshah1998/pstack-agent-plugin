# Validate the Kiro adapter

Read this branch when the fork retains or changes Kiro behavior.

1. Detect the account's model IDs:

```bash
kiro-cli chat --v3 --list-models --format json-pretty
```

2. Use `setup-pstack` to update `.kiro/steering/pstack-models.md`. Treat parent model names as role hints. Do not copy parent-client suffixes into Kiro steering.
3. Keep Kiro-only profiles, steering, and documentation under `dev.kiro` or `.kiro` as appropriate. Keep the portable skill frontmatter free of Kiro-only fields.
4. Validate every bundled agent profile:

```bash
kiro-cli agent validate --path dev.kiro/agents/pstack-poteto.json
kiro-cli agent validate --path dev.kiro/agents/pstack-comment-sicko.json
```

5. If a local Kiro installation is available, load the maintenance checkout as a custom Power. Confirm that Kiro discovers the updated skills. Report an unavailable live smoke test instead of inferring success from schema validation.
