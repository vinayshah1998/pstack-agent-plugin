import { createHash } from "node:crypto";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { homedir } from "node:os";
import { delimiter, join } from "node:path";

const scriptsDirectory = import.meta.dir;

function currentInstallKey(): string {
  return createHash("sha256")
    .update(readFileSync(join(scriptsDirectory, "package.json")))
    .update("\0")
    .update(readFileSync(join(scriptsDirectory, "bun.lock")))
    .digest("hex");
}

function dataRoot(): string {
  return (
    process.env.PSTACK_DATA_DIR ??
    process.env.PLUGIN_DATA ??
    join(process.env.XDG_CACHE_HOME ?? join(homedir(), ".cache"), "pstack")
  );
}

function exposeDependencies(nodeModulesDirectory: string): void {
  process.env.NODE_PATH = [nodeModulesDirectory, process.env.NODE_PATH]
    .filter((value): value is string => Boolean(value))
    .join(delimiter);
}

export function ensureDependenciesInstalled(): void {
  const installKey = currentInstallKey();
  const installDirectory = join(
    dataRoot(),
    "poteto-mode-tools",
    installKey
  );
  const nodeModulesDirectory = join(installDirectory, "node_modules");
  const commanderPackagePath = join(
    nodeModulesDirectory,
    "commander",
    "package.json"
  );
  const installKeyPath = join(installDirectory, ".install-key");

  if (
    existsSync(commanderPackagePath) &&
    existsSync(installKeyPath) &&
    readFileSync(installKeyPath, "utf8").trim() === installKey
  ) {
    exposeDependencies(nodeModulesDirectory);
    return;
  }

  mkdirSync(installDirectory, { recursive: true });
  copyFileSync(
    join(scriptsDirectory, "package.json"),
    join(installDirectory, "package.json")
  );
  copyFileSync(
    join(scriptsDirectory, "bun.lock"),
    join(installDirectory, "bun.lock")
  );

  const result = Bun.spawnSync(
    [process.execPath, "install", "--frozen-lockfile", "--production"],
    { cwd: installDirectory }
  );
  if (result.exitCode !== 0) {
    process.stdout.write(result.stdout);
    process.stderr.write(result.stderr);
    throw new Error(
      `bun install --frozen-lockfile --production exited with status ${result.exitCode}`
    );
  }
  if (!existsSync(commanderPackagePath)) {
    throw new Error(
      "bun install completed without installing commander in the pstack data directory"
    );
  }

  writeFileSync(installKeyPath, `${installKey}\n`);
  exposeDependencies(nodeModulesDirectory);

  const restarted = Bun.spawnSync([process.execPath, ...process.argv.slice(1)], {
    cwd: process.cwd(),
    env: process.env,
    stdin: "inherit",
    stdout: "inherit",
    stderr: "inherit",
  });
  process.exit(restarted.exitCode ?? 1);
}
