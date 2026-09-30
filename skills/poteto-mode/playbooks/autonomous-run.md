### Autonomous run

**You own the exit condition. Define done, then drive to it within the agreed budget.**

1. State the exit condition as a checkable predicate before the first iteration (tests green, repro fixed, all N PRs merged, pixel-diff zero). Set a finite runtime or iteration budget and preserve the user's publication and approval boundaries.
2. Select an available host watcher or scheduler only when durable execution is requested and supported. Confirm it is armed before claiming future wakeups. Otherwise run bounded iterations in the current session and report that work stops when the session ends. Use event-driven checks when available; otherwise choose an interval appropriate to the expected change. Keep one driver per task.
3. Each iteration makes the smallest change the evidence justifies and verifies it against the predicate. Commit progress only when authorized. Revert only this iteration's unsuccessful edits, preserving unrelated work.
   Sequence the work via the **sequence-verifiable-units** principle skill, verifying each unit before the next instead of batching checks at the end.
4. Address reversible problems within the agreed scope. Record unrelated discoveries separately. Surface irreversible actions, genuine product or preference calls no experiment can settle, or a real dead end. Keep the predicate as the main drive.
5. Checkpoint every iteration via the **show-me-your-work** skill, a row for what changed and whether the predicate moved.
6. Stop when the predicate is met, the user stops the run, the budget expires, or a blocker needs a human decision. A plateau calls for a different approach within the budget. Never relax the predicate to declare victory. Stop any watcher you armed and leave a concrete resume point when incomplete.

**Reply:** the exit condition, iterations run, what landed, what was discarded, final predicate state, and any remaining work or scheduling limitation.
