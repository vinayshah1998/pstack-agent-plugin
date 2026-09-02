#!/usr/bin/env node

import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { realpathSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptPath = fileURLToPath(import.meta.url);

function usage() {
  return `Usage: node status.mjs --fork <path> --upstream <path> [options]

Options:
  --refresh          Fetch and prune the parent checkout before comparison.
  --json             Emit the complete status record as JSON.
  --fail-on-changes  Exit 3 when parent changes are available.
  --help             Show this help text.`;
}

function parseArgs(argv) {
  const options = {
    failOnChanges: false,
    fork: null,
    json: false,
    refresh: false,
    upstream: null,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--fork" || argument === "--upstream") {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) {
        throw new Error(`${argument} requires a path.`);
      }
      options[argument.slice(2)] = value;
      index += 1;
      continue;
    }
    if (argument === "--refresh") {
      options.refresh = true;
      continue;
    }
    if (argument === "--json") {
      options.json = true;
      continue;
    }
    if (argument === "--fail-on-changes") {
      options.failOnChanges = true;
      continue;
    }
    if (argument === "--help") {
      options.help = true;
      continue;
    }
    throw new Error(`Unknown argument ${argument}.`);
  }

  if (!options.help && (!options.fork || !options.upstream)) {
    throw new Error("--fork and --upstream are required.");
  }
  return options;
}

function runGit(repository, args, acceptedStatuses = [0]) {
  const result = spawnSync("git", ["-C", repository, ...args], {
    encoding: "utf8",
  });
  if (!acceptedStatuses.includes(result.status)) {
    const detail = result.stderr.trim() || result.stdout.trim() || `exit ${result.status}`;
    throw new Error(`git ${args.join(" ")} failed in ${repository}: ${detail}`);
  }
  return result.stdout.trim();
}

function parseProvenance(markdown) {
  const readField = (label) => {
    const match = new RegExp("^- " + label + ": `([^`]+)`$", "m").exec(markdown);
    if (!match) {
      throw new Error(`docs/upstream.md is missing ${label}.`);
    }
    return match[1];
  };

  return {
    repository: readField("Source repository"),
    subdirectory: readField("Source directory").replace(/\/$/, ""),
    pinnedCommit: readField("Source commit"),
    pinnedVersion: readField("Source plugin version"),
  };
}

function normalizeRemote(value) {
  const sshMatch = /^git@github\.com:(.+)$/.exec(value);
  const normalized = sshMatch ? `https://github.com/${sshMatch[1]}` : value;
  return normalized.replace(/\.git$/, "").replace(/\/$/, "");
}

function reviewHintForPath(path) {
  if (path === ".cursor-plugin" || path.startsWith(".cursor-plugin/") || path === "agents" || path.startsWith("agents/") || path === "automations" || path.startsWith("automations/")) {
    return "client-path";
  }
  if (path === "skills" || path.startsWith("skills/")) return "skill-path";
  if (path === "docs" || path.startsWith("docs/") || path === "README.md" || path === "LICENSE") return "docs-path";
  if (path === "assets" || path.startsWith("assets/")) return "asset-path";
  return "unclassified-path";
}

function parseNameStatus(output, sourceDirectory) {
  if (!output) return [];
  const prefix = `${sourceDirectory}/`;
  return output
    .split("\n")
    .map((line) => {
      const [status, ...rawPaths] = line.split("\t");
      if (!status || rawPaths.length === 0) {
        throw new Error(`Cannot parse git diff line ${JSON.stringify(line)}.`);
      }
      const paths = rawPaths.map((path) => path.startsWith(prefix) ? path.slice(prefix.length) : path);
      return {
        status,
        paths,
        reviewHint: reviewHintForPath(paths.at(-1)),
      };
    })
    .sort((left, right) => left.paths.join("\0").localeCompare(right.paths.join("\0")));
}

function readSourceVersion(repository, commit, sourceDirectory) {
  const manifest = runGit(repository, ["show", `${commit}:${sourceDirectory}/.cursor-plugin/plugin.json`]);
  try {
    return JSON.parse(manifest).version ?? null;
  } catch (error) {
    throw new Error(`Cannot parse the parent plugin manifest at ${commit}: ${error.message}`);
  }
}

function collectStatus(options) {
  const fork = realpathSync(resolve(options.fork));
  const upstream = realpathSync(resolve(options.upstream));
  runGit(fork, ["rev-parse", "--is-inside-work-tree"]);
  runGit(upstream, ["rev-parse", "--is-inside-work-tree"]);

  const provenancePath = resolve(fork, "docs/upstream.md");
  const provenance = parseProvenance(readFileSync(provenancePath, "utf8"));
  const actualRemote = normalizeRemote(runGit(upstream, ["remote", "get-url", "origin"]));
  const expectedRemote = normalizeRemote(provenance.repository);
  if (actualRemote !== expectedRemote) {
    throw new Error(`Parent checkout origin is ${actualRemote}; expected ${expectedRemote}.`);
  }

  if (options.refresh) runGit(upstream, ["fetch", "--prune", "origin"]);

  let defaultRef = runGit(upstream, ["symbolic-ref", "--quiet", "--short", "refs/remotes/origin/HEAD"], [0, 1]);
  if (!defaultRef) {
    runGit(upstream, ["rev-parse", "--verify", "origin/main"]);
    defaultRef = "origin/main";
  }

  runGit(upstream, ["cat-file", "-e", `${provenance.pinnedCommit}^{commit}`]);
  const latestCommit = runGit(upstream, ["log", "-1", "--format=%H", defaultRef, "--", provenance.subdirectory]);
  const ancestry = spawnSync("git", ["-C", upstream, "merge-base", "--is-ancestor", provenance.pinnedCommit, latestCommit]);
  if (ancestry.status !== 0) {
    throw new Error(`Pinned commit ${provenance.pinnedCommit} is not an ancestor of ${latestCommit}.`);
  }

  const diff = runGit(upstream, ["diff", "--name-status", "--find-renames", provenance.pinnedCommit, latestCommit, "--", provenance.subdirectory]);
  const changes = parseNameStatus(diff, provenance.subdirectory);
  const record = {
    schemaVersion: 1,
    state: changes.length === 0 ? "up-to-date" : "updates-available",
    source: {
      repository: provenance.repository,
      subdirectory: provenance.subdirectory,
      pinnedCommit: provenance.pinnedCommit,
      pinnedVersion: provenance.pinnedVersion,
      latestCommit,
      latestVersion: readSourceVersion(upstream, latestCommit, provenance.subdirectory),
    },
    fork: {
      headCommit: runGit(fork, ["rev-parse", "HEAD"]),
      clean: runGit(fork, ["status", "--porcelain"]) === "",
    },
    changes,
  };
  const fingerprint = createHash("sha256").update(JSON.stringify(record)).digest("hex");
  return { ...record, fingerprint };
}

function renderStatus(status) {
  const lines = [
    `State: ${status.state}`,
    `Parent: ${status.source.pinnedCommit} -> ${status.source.latestCommit}`,
    `Versions: ${status.source.pinnedVersion} -> ${status.source.latestVersion ?? "unknown"}`,
    `Fork clean: ${status.fork.clean ? "yes" : "no"}`,
    `Fingerprint: ${status.fingerprint}`,
  ];
  for (const change of status.changes) {
    lines.push(`${change.status}\t${change.paths.join(" -> ")}\t[${change.reviewHint}]`);
  }
  return lines.join("\n");
}

function main(argv = process.argv.slice(2)) {
  try {
    const options = parseArgs(argv);
    if (options.help) {
      process.stdout.write(`${usage()}\n`);
      return 0;
    }
    const status = collectStatus(options);
    process.stdout.write(options.json ? `${JSON.stringify(status, null, 2)}\n` : `${renderStatus(status)}\n`);
    return options.failOnChanges && status.changes.length > 0 ? 3 : 0;
  } catch (error) {
    process.stderr.write(`ERROR ${error.message}\n\n${usage()}\n`);
    return 2;
  }
}

const isMain = process.argv[1] && resolve(process.argv[1]) === resolve(scriptPath);
if (isMain) process.exitCode = main();

export { collectStatus, main, parseArgs, parseNameStatus, parseProvenance, reviewHintForPath };
