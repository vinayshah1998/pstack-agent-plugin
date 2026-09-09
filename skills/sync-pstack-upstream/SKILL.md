---
name: sync-pstack-upstream
description: Check and port changes from cursor/plugins/pstack into the standalone Agent Plugins fork without overwriting portable or client adaptations. Use when checking upstream, syncing the pstack fork, or reviewing new parent changes.
---

# Sync pstack upstream

## Overview

Compare the fork's pinned parent commit with the current `cursor/plugins/pstack` source. Port intent file by file. Keep the Agent Plugins core portable and preserve client adapters.

## Usage

Use this skill when:

- Checking whether the parent pstack directory changed.
- Updating the standalone fork from a newer parent commit.
- Reviewing whether an upstream skill, agent, automation, document, or asset belongs in the portable fork.

## Core Concepts

The parent source and the portable fork have different package shapes. Sync them through semantic review instead of merging their trees.

The checker requires Git and Node.js. It uses no third-party packages.

The bundled checker emits an `UpstreamStatus` record:

```text
source       repository, source directory, pinned and latest commits, source versions
fork         current commit and clean-worktree state
changes      sorted Git changes with a review hint
fingerprint  SHA-256 of the complete status record
```

Review hints direct attention without deciding portability:

- `skill-path` identifies source under `skills/`.
- `client-path` identifies parent manifests, custom agents, and automations.
- `docs-path` identifies documentation, the license, and the parent README.
- `asset-path` identifies media.
- `unclassified-path` identifies anything else.

## Check the parent

1. Use a writable maintenance checkout of the fork. Treat an installed plugin as read-only.
2. Use an existing `cursor/plugins` checkout or clone it into a user-selected cache or temporary directory.
3. Run the bundled checker from the maintenance checkout:

```bash
node skills/sync-pstack-upstream/scripts/status.mjs \
  --fork <fork-checkout> \
  --upstream <cursor-plugins-checkout> \
  --refresh \
  --json
```

`--refresh` fetches only the parent checkout. Omit it for an offline comparison. Add `--fail-on-changes` when a CI check should return exit code 3 for an available update.

Stop when the state is `up-to-date`. If the checker fails, fix the reported repository, remote, commit, or history problem before reviewing content.

## Port every changed path

Review the patch for every path in `changes`. Map each parent path to its fork path with the Path mapping table in `docs/upstream.md` before reading or merging; a renamed skill keeps its parent content but carries the fork's directory and frontmatter `name`. Record one disposition for each path:

- `port` preserves host-neutral behavior.
- `adapt` preserves intent through a portable or client mechanism.
- `skip` excludes behavior that remains specific to the parent client.
- `block` marks a change that has no safe mapping yet.

Do not advance the provenance commit while any path is missing a disposition or has `block` status.

Apply these rules:

1. Normalize immediate skills to Agent Skills frontmatter. Keep `name` equal to the directory name. Use only fields accepted by `scripts/validate-plugin.mjs`.
2. Interpret parent model names as role hints. Validate exact model identifiers with the active host before updating role steering.
3. Keep custom agents, rules, hooks, and hosted automations outside the portable core. Extract reusable workflow behavior into a portable skill. Put retained client behavior under a reverse-domain extension.
4. Keep root `plugin.json` on the Agent Plugins 1.0 schema. Port only supported shared metadata. A parent-only manifest field does not belong in the portable manifest.
5. Audit changed scripts for dependencies, network access, writable paths, credentials, and host assumptions. Runtime state belongs outside the installed plugin root.
6. Apply deletions only when the parent intent and the fork's ownership agree. A missing parent file does not automatically delete a fork adaptation.

For host adapter validation commands, read [`references/client-validation.md`](references/client-validation.md).

## Update provenance

After all dispositions are complete, update `docs/upstream.md` with the accepted immutable parent commit and source plugin version. Change the portable plugin version only when the fork's release policy calls for it.

Run the checker again without `--refresh`. The new provenance commit must produce `up-to-date` against the accepted parent commit.

## Validate the fork

Run the portable checks:

```bash
node --test skills/sync-pstack-upstream/scripts/status.test.mjs
node scripts/validate-plugin.mjs
```

Run targeted tests and type checks for every changed executable asset. Run the validation branch for each retained client adapter.

## Report the result

Report the old and new parent commits, the status fingerprint, every path disposition, the fork files changed, validation commands with exit codes, and unresolved runtime gaps. Leave commits, pushes, pull requests, and publication to an explicit user request.

## Common mistakes

- Merging the parent subtree into the portable fork. This restores client-only package structure.
- Copying a known path without reading its patch. Existing fork files may contain client adaptations.
- Translating a parent model suffix into a guessed host model identifier. Use the host's detected model list.
- Advancing `docs/upstream.md` before every changed path is accounted for. The next check would hide unfinished work.
