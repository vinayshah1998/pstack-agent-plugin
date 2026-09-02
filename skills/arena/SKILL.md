---
name: arena
description: Spawn independent candidates for the same task, select a base against a rubric, graft the strongest ideas, and verify the synthesized result.
---

# Arena

Fan out independent attempts at the same task. Read every candidate, pick the strongest base, graft only coherent improvements, and verify the result.

## Phases

1. Frame
2. Fan out
3. Cross-judge
4. Pick
5. Graft
6. Verify

## Frame

State the artifact and derive three to six concrete, gradeable criteria. Choose the number of candidates and available model or agent diversity. Use pstack's host role mapping when present and `auto` otherwise. Assign every candidate its own worktree or writable directory.

## Fan out

Dispatch all candidates concurrently through the host's subagent capability. Each receives the same task, shared grounding by file path, unique output path, and a requirement to produce both the artifact and a short rationale naming alternatives considered and rejected.

Do not require a client-specific background or cloud field. Kiro runs bounded candidates in the current session unless an external operator explicitly starts separate cloud sessions. Proceed with successful candidates and record dropouts.

## Cross-judge

After candidate outputs are complete, dispatch one read-only judge. Prefer an independent model or agent when available. The judge sees only the rubric and labeled candidate paths, scores each criterion, and recommends a base with rationale.

## Pick

Read every candidate end to end and score it criterion by criterion. Compare with the judge. Resolve disagreement by revisiting the rubric and rationales. Prefer the smallest coherent surface that a future maintainer can extend safely.

## Graft

Inspect losing candidates once more. Fold only ideas that improve the base without creating a mixed mental model. Record each graft, rejection, convergence, and dropout. If candidates diverge because the prompt was underspecified, reframe instead of averaging them.

## Verify

Run the synthesized artifact's real validation. A candidate panel does not substitute for proof. If verification fails, determine whether the rubric was wrong or a candidate contained a missed solution, then rerun the relevant phase.

Return one artifact and one synthesis note naming the base, grafts, rejections, dropouts, and verification result.
