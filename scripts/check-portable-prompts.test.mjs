import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const checker = fileURLToPath(new URL("./check-portable-prompts.mjs", import.meta.url));

test("rejects client instructions while retaining provenance and protocol assets", () => {
  const root = mkdtempSync(join(tmpdir(), "pstack-prompts-"));
  const put = (path, text) => {
    const target = join(root, path);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, text);
  };
  const run = () => spawnSync(process.execPath, [checker, root], { encoding: "utf8" });
  try {
    put("skills/example/SKILL.md", "Use the host's supported monitor.\n");
    put("docs/guide/example.md", "![Historical card reading /loop](./image.jpg)\n");
    put("dev.kiro/README.md", "Use .kiro/skills/.\n");
    put("skills/sync-pstack-upstream/SKILL.md", "Read cursor/plugins and .cursor-plugin/plugin.json.\n");
    put("skills/example/protocol.ts", "const marker = 'CURSOR_AUTOMATION_ID';\n");
    assert.equal(run().status, 0);
    for (const instruction of [
      "Use Cursor's built-in tool.",
      "Read ~/.cursor/projects/session.jsonl.",
      "Run /loop until done.",
      "Use cursor-team-kit.",
      'Dispatch environment: "cloud".',
      "Use subagent_type and run_in_background.",
      "Run create-skill.",
      "Say deslop it before committing.",
    ]) {
      put("skills/example/SKILL.md", instruction + "\n");
      const result = run();
      assert.equal(result.status, 1, instruction);
      assert.match(result.stderr, /skills\/example\/SKILL\.md:1:/);
    }
    put("skills/example/SKILL.md", "Use the visible cursor location as context.\n");
    assert.equal(run().status, 0);
  } finally {
    rmSync(root, { recursive: true });
  }
});
