#!/usr/bin/env node

import { readdir, readFile, realpath, stat } from "node:fs/promises";
import { basename, dirname, join, resolve } from "node:path";
import process from "node:process";

const root = resolve(dirname(new URL(import.meta.url).pathname), "..");
const errors = [];
const manifestKeys = new Set([
  "$schema",
  "name",
  "version",
  "description",
  "author",
  "homepage",
  "repository",
  "license",
  "keywords",
  "extensions",
]);
const skillKeys = new Set([
  "name",
  "description",
  "license",
  "compatibility",
  "metadata",
  "allowed-tools",
]);
const namePattern = /^(?!.*(?:--|\.\.))[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$/;

function fail(message) {
  errors.push(message);
}

async function readJson(path) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    fail(`${path}: ${error.message}`);
    return null;
  }
}

function topLevelFrontmatter(text, path) {
  const lines = text.split(/\r?\n/);
  if (lines[0] !== "---") {
    fail(`${path}: missing opening YAML frontmatter delimiter`);
    return new Map();
  }
  const end = lines.indexOf("---", 1);
  if (end < 0) {
    fail(`${path}: missing closing YAML frontmatter delimiter`);
    return new Map();
  }
  const fields = new Map();
  for (const line of lines.slice(1, end)) {
    if (/^\s/.test(line) || line.trim() === "") continue;
    const match = /^([a-zA-Z0-9-]+):(?:\s*(.*))?$/.exec(line);
    if (!match) {
      fail(`${path}: invalid top-level frontmatter line ${JSON.stringify(line)}`);
      continue;
    }
    fields.set(match[1], match[2] ?? "");
  }
  return fields;
}

async function validateContained(path) {
  const resolvedRoot = await realpath(root);
  const resolvedPath = await realpath(path);
  if (resolvedPath !== resolvedRoot && !resolvedPath.startsWith(`${resolvedRoot}/`)) {
    fail(`${path}: resolves outside plugin root`);
  }
}

async function containsFiles(path) {
  for (const entry of await readdir(path, { withFileTypes: true })) {
    const child = join(path, entry.name);
    if (entry.isFile()) return true;
    if (entry.isDirectory() && (await containsFiles(child))) return true;
  }
  return false;
}

const manifestPath = join(root, "plugin.json");
await validateContained(manifestPath);
const manifest = await readJson(manifestPath);
if (manifest) {
  for (const key of Object.keys(manifest)) {
    if (!manifestKeys.has(key)) fail(`plugin.json: unsupported field ${key}`);
  }
  if (manifest.$schema !== "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json") {
    fail("plugin.json: unsupported or missing Agent Plugins 1.0 schema");
  }
  if (typeof manifest.name !== "string" || !namePattern.test(manifest.name) || manifest.name.length > 64) {
    fail("plugin.json: invalid name");
  }
  if (manifest.author && Object.keys(manifest.author).some((key) => !["name", "email", "url"].includes(key))) {
    fail("plugin.json: author contains unsupported fields");
  }
  if (manifest.extensions && (typeof manifest.extensions !== "object" || Array.isArray(manifest.extensions))) {
    fail("plugin.json: extensions must be an object");
  }
}

const skillsRoot = join(root, "skills");
await validateContained(skillsRoot);
const skillEntries = await readdir(skillsRoot, { withFileTypes: true });
let skillCount = 0;
for (const entry of skillEntries) {
  if (!entry.isDirectory()) continue;
  const skillPath = join(skillsRoot, entry.name, "SKILL.md");
  try {
    if (!(await stat(skillPath)).isFile()) continue;
  } catch {
    continue;
  }
  skillCount += 1;
  await validateContained(skillPath);
  const fields = topLevelFrontmatter(await readFile(skillPath, "utf8"), skillPath);
  for (const key of fields.keys()) {
    if (!skillKeys.has(key)) fail(`${skillPath}: unsupported frontmatter field ${key}`);
  }
  const rawName = fields.get("name") ?? "";
  const skillName = rawName.replace(/^['"]|['"]$/g, "");
  if (skillName !== entry.name) fail(`${skillPath}: name ${JSON.stringify(skillName)} does not match directory ${entry.name}`);
  if (!namePattern.test(skillName) || skillName.length > 64) fail(`${skillPath}: invalid skill name`);
  if (!fields.has("description")) fail(`${skillPath}: missing description`);
}

for (const legacyRoot of [".cursor-plugin", "agents", "automations"]) {
  try {
    if (await containsFiles(join(root, legacyRoot))) {
      fail(`${legacyRoot}: client-specific root must be removed or moved under a reverse-domain extension`);
    }
  } catch {
    // Absent is valid.
  }
}

if (errors.length > 0) {
  for (const error of errors) process.stderr.write(`ERROR ${error}\n`);
  process.stderr.write(`Validation failed with ${errors.length} error(s).\n`);
  process.exit(1);
}

process.stdout.write(`Validated Agent Plugins 1.0 manifest and ${skillCount} Agent Skills.\n`);
