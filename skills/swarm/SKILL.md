---
name: swarm
description: Fan out independent workers across slices or race arms, wait for completion, aggregate evidence, and return one report.
---

# Swarm

Fan out bounded parallel workers. They may cover separate slices, race the same brief, or mix both. The parent waits, aggregates, and returns one report.

## Start

Create one task-list entry per phase:

1. Frame
2. Fan out
3. Aggregate
4. Report

## Frame

State the done predicate and output. Choose partition, race, or mixed shape. For a race, declare `first pass`, `rank all`, or `best-of` before dispatch. Derive the worker count from the requested coverage and choose an available role agent or model from pstack configuration. Give every writing worker a distinct worktree, branch, or temporary directory.

## Fan out

Dispatch all workers concurrently through the host's subagent capability. Each brief stands alone and includes goal, scope, exact slice or arm, verification, output path, and report contract. Reports use `PASS`, `ISSUES`, or `BLOCKED` with evidence.

Do not assume nested cloud workers, background notifications, or a branch-base field. On Kiro, use in-session subagents and wait. An explicitly operated top-level cloud session is a separate workflow, not an implicit worker option.

If a worker drops out, continue only when remaining results still satisfy the declared coverage; otherwise retry or report the gap.

## Aggregate

For partitioned coverage, require a result for every slice. For races, apply the selection rule declared before dispatch. Do not paste raw worker output. Produce a compact result table, one-line evidenced issues, and explicit gaps.

## Report

Return one consolidated report with result table, issue one-liners, gaps or dropouts, and the race rule when used.
