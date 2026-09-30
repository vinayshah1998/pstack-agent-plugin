#!/usr/bin/env node

import { readdir, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(process.argv[2] ?? join(dirname(fileURLToPath(import.meta.url)), ".."));
const forbidden = /\bCursor\b|\.cursor(?:\/|\b)|cursor-team-kit|\bsubagent_type\b|\bgeneralPurpose\b|\brun_in_background\b|\bcloud_base_branch\b|\/loop\b|\/goal\b|\/deslop\b|\bcreate-skill\b|\bTask tool\b|environment:\s*["']cloud["']/;
let failures = 0;
let files = 0;

async function scan(directory) {
  for (const entry of await readdir(join(root, directory), { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (path === join("skills", "sync-pstack-upstream")) continue;
    if (entry.isDirectory()) {
      await scan(path);
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files += 1;
      const lines = (await readFile(join(root, path), "utf8")).split(/\r?\n/);
      for (const [index, line] of lines.entries()) {
        if (/^!\[.*\]\([^)]*\)\s*$/.test(line)) continue;
        if (forbidden.test(line)) {
          console.error(`${path}:${index + 1}: client-specific operating instruction: ${line}`);
          failures += 1;
        }
      }
    }
  }
}

for (const directory of ["skills", "docs/guide", "dev.kiro"]) await scan(directory);
if (failures) process.exitCode = 1;
else console.log(`Checked ${files} operational Markdown files for known client-specific instructions.`);
