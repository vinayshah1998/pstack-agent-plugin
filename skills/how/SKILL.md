---
name: how
description: "Use for \"how does X work\", code walkthroughs before changing something, and placement / ownership / layering questions (\"where should this live\", \"which package owns this\", \"is this the right layer\"). Explains subsystem architecture, runtime flow, and onboarding mental models. Use why for motivation."
---

# How

Explore the codebase to answer "how does X work?" questions. Produce architectural explanations at the level of a senior engineer onboarding onto a subsystem, enough to build a working mental model, not so much that it reads like annotated source code.

## Step 1. Assess Complexity

If the scope is ambiguous, state your interpretation and explore. The user can redirect.

- **Simple**: a single module, a small utility, or a narrow question such as "how does function X work." Do not fan out. One explainer explores and explains in a single pass. Go to Step 2b.
- **Complex**: a subsystem spanning multiple files or services, a cross-cutting feature, or a full architectural overview. Spawn parallel explorers first, then hand off to the explainer. Go to Step 2a.

When in doubt, take the simple path.

## Step 2a. Explore (complex questions only)

Decompose the question into two to four exploration angles, each a distinct slice of the subsystem. Dispatch all explorers concurrently through the host's subagent capability. Give each a distinct angle and `references/explorer-prompt.md` with that angle filled in.

Use the configured `code exploration` role when available and `auto` otherwise. Enforce no-write behavior through the target agent's tools and permissions, not a prose label.

Each explorer must:

- Search broadly for types, interfaces, entry points, and ownership boundaries.
- Trace callers, callees, data flow, state, and side effects through actual code.
- Stop only when it can explain the complete path without guessing.
- Return components, flow, files read, and non-obvious behavior.

Then go to Step 3.

## Step 2b. Direct Explain (simple questions)

Dispatch one host subagent that explores and explains in one pass. Use the configured `explanation and synthesis` role when available and `auto` otherwise. Build its prompt from `references/explainer-prompt.md` without the explorer-findings section. Enforce no-write behavior through its tools and permissions. Then go to Step 4.

## Step 3. Synthesize (complex questions only)

Once all explorers return, dispatch one host subagent to synthesize their findings into one explanation. Use the configured `explanation and synthesis` role when available and `auto` otherwise. Build its prompt from `references/explainer-prompt.md` with every explorer's findings filled in. The synthesizer reconciles overlap and contradictions and cites concrete files and symbols.

## Step 4. Present

Present the explainer's output to the user. Light edits for clarity or context from the conversation are fine. Do not substantially rewrite it.

## Output Format

The explanation uses the sections defined in `references/explainer-prompt.md`, dropping any that do not apply: Overview, Key Concepts, How It Works, Where Things Live, Gotchas.
