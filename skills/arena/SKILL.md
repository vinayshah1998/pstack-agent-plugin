---
name: arena
description: Spawn independent candidates for the same task, select a base against a rubric, graft the strongest ideas, and verify the synthesized result.
---

# Arena

Open a host task list with one entry per phase before launching anything. If the host has no task-list capability, state the phases in the working plan.

## Phase A: Frame

Every candidate gets the same prompt, so the prompt is the contract.

1. State the artifact each candidate is producing.
2. Derive three to six concrete, gradeable criteria for what success looks like on this task. The rubric is the picker's tool in Phase D. Candidates only see the task.
3. Pick the runners. Use the configured `arena candidates and judge` role when present. If the role is missing, use `auto`. For `auto` or `inherit-parent`, omit explicit model or agent selection. If an entry is unavailable, use a confirmed available agent or `auto`, record the fallback, and update the role mapping separately. Missing model diversity reduces the panel to available agents. Spawn more candidates when the arena covers several design directions. Use independent contexts for repeated entries when the work is generation-bound rather than judgment-sensitive.
4. Give each candidate its own output location. Use a Git worktree where possible, or a host-managed directory under `$KIROCREW_SCRATCH`, per the **separate-before-serializing-shared-state** principle skill.

## Phase B: Fan out

Dispatch all candidates concurrently through the host's subagent capability. Each receives the same task, shared grounding by file path, a unique output path, and a requirement to produce both the artifact and a short rationale naming alternatives considered and rejected.

Do not require a client-specific background or cloud field. Kiro runs bounded candidates in the current session unless an external operator starts separate cloud sessions. Proceed with successful candidates and record dropouts.

## Phase C: Cross-judge

After the candidates finish, choose one judge from the configured `arena candidates and judge` role. If the role is missing, use `auto`. Apply the Frame phase's alias and unavailable-entry rules. Prefer a model family or named agent different from the parent when the host exposes that choice. Dispatch one read-only judge. Enforce no-write behavior through the judge's tools and permissions.

The judge sees only the rubric and labeled candidate paths, scores each criterion, and recommends a base with rationale. The judge may run while the parent reads candidates, but never while candidates are still writing.

## Phase D: Pick a base

Read every candidate end to end before picking. Score each against the rubric criterion by criterion and compare with the cross-judge. Agreement on the base confirms the pick. Disagreement means that one reviewer is biased or the rubric was ambiguous. Read both rationales before deciding.

Pick the base a future maintainer can extend most easily without breaking invariants. When two feel tied, prefer the cleaner boundary or smaller API, per the Laziness Protocol.

## Phase E: Graft

Walk each losing candidate once more for what is worth porting into the base, usually one or two things per candidate. Fold each graft in by hand, per the **redesign-from-first-principles** principle skill, so the result keeps one mental model. Do not paste mechanically.

If the candidates converge on one shape, record the agreement and use that shape. If they diverge widely, Phase A was under-specified. Reframe and rerun instead of averaging the results.

## Phase F: Verify

Verify the synthesized artifact, per the **prove-it-works** principle skill. If verification finds a problem the arena missed, either reframe Phase A or return to Phase E for a missed graft. Do not paper over it.

## Outputs

Return one synthesized artifact and a short note. Name the base, the cross-judge verdict, each graft and its source, rejected ideas, convergence or dropouts, and the verification result.
