---
name: how
description: 'Use for "how does X work", code walkthroughs before changing something, and placement / ownership / layering questions ("where should this live", "which package owns this", "is this the right layer"). Explains subsystem architecture, runtime flow, and onboarding mental models. Use why for motivation.'
---

# How

Explore the codebase to answer "how does X work?" questions. Produce an architectural explanation for a senior engineer who is onboarding to the subsystem. Build a working mental model instead of annotating the source.

Resolve each dispatch through `setup-pstack`. Use the configured `code exploration` role for explorers and the `explanation and synthesis` role for explainers. Use `auto` when a role is missing. For `auto` or `inherit-parent`, omit explicit model or agent selection. If a configured entry is unavailable, use a confirmed available agent or `auto` and record the fallback. Enforce no-write behavior through the agent's tools and permissions.

## 1. Assess complexity

If the scope is ambiguous, state your interpretation and explore. The user can redirect.

- **Simple.** A single module, a small utility, or a narrow question. Dispatch one explainer that explores and explains in one pass. Build its prompt from `references/explainer-prompt.md` without the explorer-findings section. Go to Step 4.
- **Complex.** A subsystem that spans several files or services, a cross-cutting feature, or a full architectural overview. Go to Step 2.

When in doubt, take the simple path.

## 2. Explore complex questions

Decompose the question into two to four distinct angles. Dispatch all explorers concurrently through the host's subagent capability. Give each explorer `references/explorer-prompt.md` with its angle filled in.

## 3. Synthesize complex questions

After all explorers return, dispatch one explainer. Give it `references/explainer-prompt.md` with every explorer's findings filled in. The explainer reconciles overlap and contradictions and cites concrete files and symbols.

## 4. Present

Present the explainer's output. Light edits for clarity or conversation context are fine. Do not substantially rewrite it.

## Output format

Use the sections from `references/explainer-prompt.md` that apply: Overview, Key Concepts, How It Works, Where Things Live, and Gotchas.
