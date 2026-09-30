### Worktree and simulator cleanup

**You own the disk and the safety gate.** Prune merged or abandoned git worktrees and stale iOS simulators to reclaim space. Deletion is irreversible, so every step guards against deleting something in use or holding uncommitted work.

1. Snapshot and audit. Record `df -h /`, then run `scripts/worktree-audit.sh` (principle-build-the-lever). It reads paths from `git worktree list`, including worktrees outside the usual parent directory (principle-encode-lessons-in-structure). It classifies size, age, merge state, edits, and PR state. Optional chat correlation reads only an explicitly supplied export directory through `PSTACK_TRANSCRIPTS_DIR`. Missing correlation means unknown usage, not an unused worktree.
2. The bucket is advice, not permission. The pinned and active chats are the real artifact (principle-prove-it-works). Get that set from the user or a supported host session listing and cross-check every candidate. The lever has marked `safe` a worktree the user had pinned, so the pinned set wins.
3. Verify usage before deleting. For each uncertain candidate, use supported session tools or supplied transcripts to check active work, including sibling worktrees used by subagents (principle-guard-the-context-window). Pinned or running status must come from current host state or the user, not transcript age. If usage cannot be established, keep the worktree.
4. Pause on irreversible loss. `wip:N` is N tracked uncommitted edits. Show the diff and get a decision first, since removing a clean worktree is recoverable from its branch but uncommitted work is gone. `scratch:N` is untracked throwaway, safe to drop, but name the files. Per Autonomy, clean and merged and not-in-use proceeds. `wip` and in-use pause.
5. Prune the confirmed set. Per path, `git worktree remove --force <path>`. If the dir survives on ignored build artifacts, `rm -rf` it, then `git worktree prune`. Branch refs survive, so no commits are lost. Confirm with `df -h /` and re-list.
6. Simulators and other reclaimers. On macOS, inspect simulator and Xcode cache usage with the platform's documented tools. On other systems, inspect relevant build and package caches. Identify exact paths, owners, and active users before proposing removal. Treat IDE session databases and snapshots as user state, not disposable caches. Delete only the approved set and preserve anything the user asked to keep.

This is the one playbook that deletes user state with no code review to catch a slip, so the gates above are the review.

**Reply:** `df -h /` before and after with space reclaimed, the worktrees pruned, and a one-line reason for each held back (in-use by which chat, or uncommitted work).
