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

1. State the done predicate and the artifact or report the swarm must return.
2. Choose the shape. Partition into slices, race N workers on identical briefs, or mix both. For a race or mixed shape, declare `first pass`, `rank all`, or `best-of` before spawning.
3. Set N from the user or derive it from the shape. N is total workers, not the host's concurrency limit.
4. Choose the configured `swarm workers` role when available and `auto` otherwise. For `auto` or `inherit-parent`, omit an explicit model identifier so the host uses the parent model. If a configured identifier is unavailable, report it and use `auto`. Never guess a replacement model identifier. For a model or role race, name every arm up front.
5. Give every writing worker a distinct worktree, branch, or temporary directory. When workers verify or measure commits, each brief names the exact SHAs. A measurement brief also names the method, including the sample count, what one sample is, and the order. The worker records both in its result.

## Fan out

Dispatch all workers concurrently through the host's subagent capability. Each brief stands alone and includes goal, scope, exact slice or arm, verification, output path, and report contract. Reports use `PASS`, `ISSUES`, or `BLOCKED` with evidence.

Do not assume workers can outlive the current session, that completion notifications are durable, or that dispatch accepts a branch base. On Kiro, use in-session subagents and wait. An explicitly operated top-level cloud session is a separate workflow and requires an operator request.

A worker that can prove a defect reports `ISSUES` and lists every issue it can prove, not only the first. If a worker drops out, continue only when remaining results still satisfy the declared coverage. Otherwise retry or report the gap.

## Aggregate

For partitioned coverage, require a result for every slice. For races, apply the selection rule declared before dispatch. Do not paste raw worker output. Produce a compact result table, one-line evidenced issues, and explicit gaps.

Read the terminal results. Drop a result that does not record the SHAs and method its brief names, and rerun that worker once. After a second miss, record a gap. A gap does not count as a pass.

## Report

Return one consolidated report with result table, issue one-liners, gaps or dropouts, and the race rule when used.
