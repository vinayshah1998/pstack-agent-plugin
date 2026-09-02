# Feature-map template

Copy this template outside the installed plugin and fill one section per user-facing feature.

## `<feature name>`

`<one-line user-visible purpose>`

### User path

- Entry surface: `<screen, command, route, or menu>`
- Actions: `<real user actions>`
- Reset: `<independent reset path>`

### Stable handles

- `<role and accessible name>`
- `<ARIA relationship, command token, or purpose-named attribute>`

Do not use generated classes, hashes, child indexes, or brittle positions.

### States

- `<default, loading, empty, error, selected, expanded, or feature-specific states>`

### Preconditions

- Auth, fixture data, permissions, flags, and required services.

### Evidence

- Screenshot showing app identity and discriminating state.
- Recording of entry path, interaction, and final state.
- Read-only state cross-check.

### Gotchas

- Wrong surfaces, unsafe environments, dead ends, and valid environment translations.
