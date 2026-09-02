# Verify an existing fix

Use this mode for a concrete open pull request, merged pull request, or merged commit that plausibly addresses the symptom. A claim, branch name, or hypothesis is not a fix artifact.

Protect user work with an isolated worktree or clean checkout. Record baseline revision, patched revision, artifact URL, and shared environment inputs.

1. Run the baseline through the configured control adapter. Reproduce twice and capture the discriminating state.
2. Run the patched build with the same environment and data. Repeat the path twice and capture equivalent after evidence.
3. Return one outcome:
   - **Confirmed.** Baseline reproduces twice and patched resolves twice.
   - **Insufficient fix.** Symptom appears on both.
   - **Inconclusive.** Either side cannot be measured.
4. Do not edit the existing fix or open a competing pull request.
5. Clean up both builds and restore the prior repository state without discarding user work.
