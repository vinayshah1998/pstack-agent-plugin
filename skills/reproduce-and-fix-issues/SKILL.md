---
name: reproduce-and-fix-issues
description: Reproduce triaged bugs through a configured app-control adapter, verify existing fixes, and open a bounded draft pull request only after before-and-after proof.
compatibility: Requires configured thread messaging, repository, tracker, and real app-control capabilities. Durable triggers require an external scheduler.
---

# Reproduce and fix issues

Wait for a trusted triage marker, reproduce the exact symptom through the real user surface, verify an existing fix when present, and attempt a bounded fix only after confirmed evidence.

Fail closed when configuration, required tools, control adapter, or feature map is missing.

## Safety contract

- Freeze source channel and root thread coordinates. Never post a root message there.
- The coordinator alone holds messaging-write tools and credentials.
- Analysis workers are read-only. A code worker may edit only when its environment provably excludes every messaging-write capability and credential.
- The symptom must appear twice through real user interaction. State inspection may confirm but never create it.
- No confirmed reproduction means no authored fix.
- Existing pull requests or commits switch the run to verification mode. Never race an existing owner.
- Open draft pull requests only. Never merge or deploy.
- Keep captures, tokens, and logs out of source control.

## Workflow

1. **Freeze source coordinates.** Verify the trigger and source parent and retain immutable channel, root timestamp, and permalink values.
2. **Accept triage.** Proceed only for one trusted bug or performance marker under the frozen thread. Stop for conflicting, untrusted, missing, or timed-out markers.
3. **Apply ownership gates.** Stop when a person owns the fix. When an open pull request or merged commit plausibly fixes it, follow `references/verify-existing-fix.md`.
4. **Load control contract.** Read `references/control-adapter.md` and the configured feature map. Require bring-up, real interaction, read-only inspection, screenshots, recording, reset, and cleanup.
5. **Study the report.** Read the full thread and tracker item. Use `how` and `why` to form competing root-cause hypotheses. Delegate only narrow read-only questions.
6. **Reproduce twice.** Drive the mapped user path, observe the discriminating broken state, reset independently, and reproduce again. Capture a read-only state cross-check when possible.
7. **Review evidence.** Record the complete path, broken-state screenshot, recording, and exact steps. A read-only media reviewer must confirm that the artifact visibly shows the discriminating state.
8. **Report the outcome.** Keep blocked or not-reproduced detail in operations output. For confirmed reproduction, post at most one concise source-thread reply after preflight.
9. **Qualify a bounded fix.** Require confirmed media, no owner or existing artifact, runtime root-cause evidence, a bounded change, and an adapter that can run baseline and patched builds.
10. **Implement the root cause.** Use TDD only when a cheap local target exists. Keep unrelated cleanup out and stop if scope or risk exceeds the configured budget.
11. **Prove the fix.** Repeat the same real path twice on the patched build, capture equivalent after evidence, run focused checks, and smoke the blast radius.
12. **Open a draft pull request.** Only after before-and-after proof and required repository checks. Include evidence and never merge or deploy.
13. **Clean up.** Stop created processes and sessions and remove temporary state without deleting user work or retained evidence.

## Output contract

Record the trusted marker, ownership decision, baseline and patched revisions, reproduction attempts, evidence locations, root cause, checks, draft pull request URL when created, and cleanup result.
