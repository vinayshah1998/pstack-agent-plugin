---
name: triage-issue-reports
description: Triage issue reports with one thread-only verdict, evidence review, cause-aware routing, tracker deduplication, and fail-closed ticket creation. Use only with configured messaging and tracker capabilities.
compatibility: Requires thread read/reply capabilities and an issue-tracker adapter. The coordinator alone may write externally.
---

# Triage issue reports

Classify one report and post one useful verdict in its source thread. Create a tracker issue only for a clear, net-new bug. Do not reproduce or fix it here.

Load external Benny configuration. If configuration or required capabilities are missing, malformed, or uncertain, stop without posting or writing to the tracker.

## Safety contract

- Freeze the source channel and root thread coordinates before any work.
- Never post a root message, replacement thread, broadcast reply, direct message, or cross-channel copy.
- Preflight the source parent before any tracker write and immediately before the verdict.
- The coordinator is the only messaging writer. Workers receive no messaging credentials or write tools.
- Never create an issue without a stable source permalink and a compensation operation.
- Prefer no ticket over a guessed or duplicate ticket.
- Emit one substantive verdict and one configured marker. Do not narrate progress.

## Workflow

1. **Freeze coordinates.** Derive the root thread timestamp from the trigger, verify it belongs to the configured source channel, and store both values as immutable data.
2. **Read evidence.** Read the entire thread and all relevant attachments. Separate observed facts from hypotheses. Say when an attachment cannot be inspected.
3. **Trace likely cause.** Use the `how` skill for the likely code path and `why` for regression or defensive-code history. A bounded trace is enough; never invent an owner when source access is unavailable.
4. **Classify.** Choose bug, performance, feature request, question or feedback, or reroute. When bug versus feature is unclear, ask one focused question and create nothing.
5. **Route.** Apply a configured routing map only when product area, code path, or error signature supports the route. A keyword alone is insufficient. See `references/routing.example.md`.
6. **Deduplicate.** Search by source URL, signature, area, trigger, symptom, version window, and suspected regression. Distinguish confident duplicate, possible relation, weak resemblance, and no match.
7. **Write tracker state.** Create only for a live, clear bug or performance issue with no plausible match and a verified compensation operation. Update a confident duplicate only with the new source and recurrence note.
8. **Post one verdict.** Re-preflight the parent, post only as a reply to the frozen thread, and end with exactly one configured marker such as `[benny:bug]`, `[benny:performance]`, or `[benny:other]`. Verify the reply landed under the same root.
9. **Compensate on handoff failure.** If this run created an issue but the verdict did not land, cancel, close, or delete that issue and verify compensation.
10. **Bound follow-up.** Watch one configured follow-up window, answer direct questions only, and never emit a second marker.

## Output contract

The run output records classification, evidence gaps, routing, deduplication, tracker action, verdict permalink, and compensation result. Public messaging remains the single concise thread reply.
