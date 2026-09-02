import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const script = resolve(dirname(fileURLToPath(import.meta.url)), "status.mjs");

function git(repository, ...args) {
  return execFileSync("git", ["-C", repository, ...args], { encoding: "utf8" }).trim();
}

function commit(repository, message) {
  git(repository, "add", ".");
  git(repository, "commit", "-m", message);
  return git(repository, "rev-parse", "HEAD");
}

function initializeRepository(path) {
  mkdirSync(path, { recursive: true });
  git(path, "init", "-b", "main");
  git(path, "config", "user.email", "pstack-test@example.com");
  git(path, "config", "user.name", "pstack test");
}

test("reports a deterministic parent delta with review hints", () => {
  const root = mkdtempSync(join(tmpdir(), "pstack-upstream-status-"));
  try {
    const upstream = join(root, "upstream");
    const fork = join(root, "fork");
    initializeRepository(upstream);
    mkdirSync(join(upstream, "pstack", ".cursor-plugin"), { recursive: true });
    mkdirSync(join(upstream, "pstack", "skills", "example"), { recursive: true });
    writeFileSync(join(upstream, "pstack", ".cursor-plugin", "plugin.json"), JSON.stringify({ version: "1.0.0" }));
    writeFileSync(join(upstream, "pstack", "skills", "example", "SKILL.md"), "first\n");
    const pinnedCommit = commit(upstream, "initial parent");
    git(upstream, "remote", "add", "origin", "https://example.com/cursor/plugins.git");

    writeFileSync(join(upstream, "pstack", "skills", "example", "SKILL.md"), "second\n");
    writeFileSync(join(upstream, "pstack", ".cursor-plugin", "plugin.json"), JSON.stringify({ version: "1.1.0" }));
    const latestCommit = commit(upstream, "update parent");
    git(upstream, "update-ref", "refs/remotes/origin/main", latestCommit);
    git(upstream, "symbolic-ref", "refs/remotes/origin/HEAD", "refs/remotes/origin/main");

    initializeRepository(fork);
    mkdirSync(join(fork, "docs"), { recursive: true });
    writeFileSync(join(fork, "docs", "upstream.md"), `# Upstream provenance\n\n- Source repository: \`https://example.com/cursor/plugins\`\n- Source directory: \`pstack/\`\n- Source commit: \`${pinnedCommit}\`\n- Source plugin version: \`1.0.0\`\n`);
    commit(fork, "create fork");

    const args = [script, "--fork", fork, "--upstream", upstream, "--json"];
    const first = execFileSync(process.execPath, args, { encoding: "utf8" });
    const second = execFileSync(process.execPath, args, { encoding: "utf8" });
    assert.equal(first, second);

    const status = JSON.parse(first);
    assert.equal(status.state, "updates-available");
    assert.equal(status.source.latestCommit, latestCommit);
    assert.equal(status.source.latestVersion, "1.1.0");
    assert.deepEqual(status.changes, [
      {
        status: "M",
        paths: [".cursor-plugin/plugin.json"],
        reviewHint: "client-path",
      },
      {
        status: "M",
        paths: ["skills/example/SKILL.md"],
        reviewHint: "skill-path",
      },
    ]);
    assert.match(status.fingerprint, /^[a-f0-9]{64}$/);

    const changed = spawnSync(process.execPath, [...args, "--fail-on-changes"]);
    assert.equal(changed.status, 3);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
