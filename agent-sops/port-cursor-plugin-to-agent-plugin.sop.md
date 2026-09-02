# Port a Cursor Plugin to Agent Plugins and Kiro

## Overview

This SOP extracts a Cursor plugin into a standalone repository, converts its portable components to Agent Plugins 1.0, isolates client-specific behavior, adapts supported behavior to Kiro, and validates the result. Use it when a Cursor marketplace directory contains skills, agents, rules, hooks, or automations that need a portable core and a Kiro Power distribution.

## Parameters

- **source_repo** (required): HTTPS Git repository URL containing the Cursor plugin source.
- **source_subdirectory** (required): Repository-relative path to the plugin directory, such as `pstack`.
- **destination_path** (required): Absolute path for the standalone local repository.
- **plugin_name** (required): Lowercase Agent Plugins name satisfying the 1-64 character schema constraint.
- **target_clients** (optional, default: `kiro`): Comma-separated clients that need reverse-domain extension adapters.
- **preserve_history** (optional, default: `true`): Whether to retain subdirectory history with `git subtree split` or an equivalent history filter.
- **publish_repo** (optional): Confirmed `owner/name` remote destination. Omit to stop after local validation.
- **visibility** (optional, default: `private`): Remote visibility when `publish_repo` is supplied.

**Constraints for parameter acquisition:**
- If all required parameters are already provided, You MUST proceed to the Steps
- If any required parameters are missing, You MUST ask for them before proceeding
- When asking for parameters, You MUST request all parameters in a single prompt
- When asking for parameters, You MUST use the exact parameter names as defined
- You MUST confirm `publish_repo` and `visibility` before creating a remote because publication changes external visibility

## Steps

### 1. Pin the source

Resolve the source default branch and the latest commit touching `source_subdirectory`. Record the commit, plugin version, license, and complete file inventory in a port ledger.

**Constraints:**
- You MUST use git or the repository API to pin an immutable source commit
- You MUST verify the source license permits the standalone port
- You MUST NOT infer ownership or license from the parent repository name because subdirectories may carry separate metadata
- You MUST stop if the source cannot be pinned or licensing is unclear

### 2. Extract standalone history

Create `destination_path` from only `source_subdirectory`, preserving its relevant history when `preserve_history` is true.

**Constraints:**
- You MUST verify the destination parent exists before creating files
- You MUST use `git filter-repo`, `git subtree split`, or an equivalent history-preserving mechanism when requested
- You MUST verify the standalone root contains the source plugin files and no unrelated monorepo files
- You MUST NOT publish or push during extraction because the port is not validated yet
- You MUST hard stop on a dirty or pre-existing destination unless the user explicitly selected it

### 3. Classify components

Write a machine-readable inventory that classifies each source file as portable skill content, portable MCP configuration, client extension, general documentation, generated artifact, or unsupported behavior.

**Constraints:**
- You MUST classify Agent Plugins 1.0 portable components only as root `plugin.json`, immediate `skills/*/SKILL.md`, or root `mcp.json`
- You MUST classify custom agents, rules, hooks, automations, hosted routines, and client commands as client-specific because Agent Plugins 1.0 does not standardize them
- You SHOULD fan out large skill inventories to isolated subagents with distinct output paths
- You MUST validate that every tracked source file appears exactly once in the inventory before advancing

### 4. Create the portable manifest

Create root `plugin.json` against `https://agent-plugins.org/schemas/1.0.0/plugin.schema.json` and retain valid shared metadata.

**Constraints:**
- You MUST include `$schema` and `name`
- You MUST keep only schema-supported top-level fields
- You MUST place client metadata under reverse-domain keys in `extensions`
- You MUST NOT put `skills`, `agents`, `commands`, `rules`, or hooks at the portable manifest top level because the schema is closed
- You MUST validate the manifest before skill conversion

### 5. Normalize Agent Skills

Convert every immediate portable skill to the Agent Skills specification and preserve skill-local scripts, references, and assets.

**Constraints:**
- You MUST make each frontmatter `name` equal its parent directory and use lowercase hyphenated names
- You MUST remove or relocate client-only frontmatter fields
- You MUST retain required `name` and `description` fields
- You MUST replace cross-skill filesystem coupling with skill-name references unless the referenced file is inside the same skill directory
- You MUST validate every skill independently and skip no failure silently

### 6. Isolate client behavior

Move retained client-specific assets under reverse-domain extension directories or convert reusable behavior into portable skills.

**Constraints:**
- You MUST use a stable namespace controlled by the client, such as `dev.kiro`
- You MUST extract reusable workflow behavior from custom-agent or automation wrappers before removing legacy roots
- You MUST NOT claim portable parity for hosted automations, secret cards, schedulers, or client-only cloud workers because Agent Plugins does not define them
- You SHOULD delete obsolete unnamespaced client roots after their retained behavior is represented elsewhere

### 7. Add the Kiro adapter

Provide Kiro steering, optional custom-agent profiles, model setup, installation instructions, and explicit fallbacks for unsupported runtime capabilities.

**Constraints:**
- You MUST map portable skills through Kiro Powers
- You MUST validate every Kiro agent profile with `kiro-cli agent validate`
- You MUST use Kiro model identifiers detected on the target account and MUST NOT copy Cursor-specific model suffixes because those identifiers are not valid Kiro model IDs
- You MUST enforce read-only behavior through Kiro tools and permissions rather than prose
- You MUST require explicit transcript input or supported export and MUST NOT inspect undocumented Kiro storage because private storage formats are unsupported and may cross workspace boundaries
- You MUST document that durable triggers and hosted automations require an external scheduler or event listener

### 8. Make scripts installation-safe

Audit all executable skill assets for runtime dependencies, writable paths, network installation, secrets, and host-specific assumptions.

**Constraints:**
- You MUST treat the plugin root as read-only
- You MUST put private persistent state under client-provided plugin data when available or an explicit user-selected path
- You MUST pin direct dependencies to exact versions
- You MUST NOT embed credentials or write them into plugin files because published package contents and logs are not secret storage
- You MUST run existing targeted tests and typechecks for changed executable behavior

### 9. Validate the package

Run deterministic package validation, official skill validation when available, Kiro agent validation, existing script checks, and a fresh-install smoke test.

**Constraints:**
- You MUST fail on an invalid root manifest or any invalid immediate skill
- You MUST verify legacy client roots are absent or namespaced
- You MUST run the repository's validation command from the plugin root
- You MUST record commands, exit codes, and unresolved environmental gaps
- You MUST NOT declare compatibility from schema validation alone because runtime mappings and permissions also require inspection

### 10. Review and publish

Review the diff against the source ledger and user goals. Publish only to the confirmed remote and visibility.

**Constraints:**
- You MUST verify attribution, license, source commit, portable components, Kiro behavior, validation evidence, and documentation before publication
- You MUST ask for confirmation when `publish_repo` or `visibility` was not already explicit
- You MUST NOT force-push or bypass hooks because that can overwrite remote work or skip safeguards
- You MUST return the local path, remote URL when published, source commit, validation summary, and known limitations

## Examples

### Example 1: Local Kiro port

**Input:**
- source_repo: `https://github.com/cursor/plugins.git`
- source_subdirectory: `pstack`
- destination_path: `/work/pstack-agent-plugin`
- plugin_name: `pstack`
- target_clients: `kiro`

**Expected behavior:** The agent creates and validates a standalone local Agent Plugins package and stops before remote publication.

### Example 2: Confirmed private publication

**Input:**
- source_repo: `https://github.com/example/plugins.git`
- source_subdirectory: `example-plugin`
- destination_path: `/work/example-agent-plugin`
- plugin_name: `example-plugin`
- publish_repo: `octocat/example-agent-plugin`
- visibility: `private`

**Expected behavior:** The agent validates the complete port, creates the private repository, pushes the current branch without force, and reports the URL.

## Troubleshooting

### Skills fail validation

Check that the skill directory and frontmatter name match, only supported fields remain, and multiline descriptions use valid YAML.

### Kiro agent validates but cannot find skills

Confirm that the Power is installed and visible through `/powers`, then confirm the profile enables Powers or references installed skill resources.

### Runtime script writes under the plugin root

Move generated dependencies, caches, and state to client-managed plugin data or a user-selected writable directory. Treat the installed package as immutable.

### Hosted automation has no Kiro equivalent

Extract its decision workflow into a portable skill and document the external trigger, credential, scheduler, and retry responsibilities. Do not represent a one-shot Kiro session as a durable service.
