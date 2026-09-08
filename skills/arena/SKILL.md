---
name: arena
description: Spawn independent candidates for the same task, select a base against a rubric, graft the strongest ideas, and verify the synthesized result.
---

# Arena

Fan out independent attempts at the same task. Read every candidate, pick the strongest base, graft only coherent improvements, and verify the result.

## Start

Open a host task list with one entry per phase before launching anything. If the host has no task-list capability, state the phases in the working plan.

## Phases

1. Frame
2. Fan out
3. Cross-judge
4. Pick
5. Graft
6. Verify

## Frame

The N candidates will receive the same prompt, so the prompt is the contract.

1. State the artifact each candidate is producing.
2. Derive the rubric. State what success looks like for this task, then turn it into three to six concrete, gradeable criteria. The rubric is the picker's tool in Phase D. Candidates only see the task.
3. Pick the runners. Use the configured `arena candidates and judge` role when present and available, otherwise `auto`. Spawn more candidates when the arena covers multiple design directions. Use independent contexts for repeated entries when the work is generation-bound rather than judgment-sensitive.
4. Assign output paths. Each candidate writes to its own location: a Git worktree where possible, otherwise a host-managed writable scratch directory, per the **separate-before-serializing-shared-state** principle skill.

## Fan out

Dispatch all candidates concurrently through the host's subagent capability. Each receives the same task, shared grounding by file path, unique output path, and a requirement to produce both the artifact and a short rationale naming alternatives considered and rejected.

Do not require a client-specific background or cloud field. Kiro runs bounded candidates in the current session unless an external operator explicitly starts separate cloud sessions. Proceed with successful candidates and record dropouts.

## Cross-judge

After candidate outputs are complete, dispatch one read-only judge. Prefer an independent model or agent when available. The judge sees only the rubric and labeled candidate paths, scores each criterion, and recommends a base with rationale. Enforce no-write behavior through the judge's tools and permissions. The judge may run while the parent reads candidates, but never while candidates are still writing.

## Pick

Read every candidate end to end and score it criterion by criterion. Compare with the judge. Resolve disagreement by revisiting the rubric and rationales. Pick the base on which candidate a future maintainer can extend most easily without breaking invariants. Prefer the cleaner boundary or smaller API when two feel tied, per the Laziness Protocol.

## Graft

Inspect losing candidates once more. Fold only ideas that improve the base without creating a mixed mental model. Record each graft, rejection, convergence, and dropout. If candidates diverge because the prompt was underspecified, reframe instead of averaging them.

Record what was grafted, from which candidate, and what was rejected and why.

## Verify

The synthesized artifact has to hold up under the same scrutiny as any other output, per the **prove-it-works** principle skill.

Run the synthesized artifact's real validation. A candidate panel does not substitute for proof. If verification fails, determine whether the rubric was wrong or a candidate contained a missed solution, then rerun the relevant phase.

Return one artifact and one synthesis note naming the base, grafts, rejections, dropouts, and verification result.
