# Linear CLI

A command-line interface to interact with the [Linear](https://linear.app) API from your terminal. Manage issues, comments, teams, projects, and labels without leaving the shell.

Built with [Deno](https://deno.land) and [Cliffy](https://cliffy.io).

## Prerequisites

- [Deno](https://deno.land) v2+
- A Linear API key (Settings → API → Personal API keys)

## Setup

Set your Linear API key as an environment variable:

```bash
export LINEAR_API_KEY="lin_api_xxxxx"
```

To make it permanent, add the line to your `~/.zshrc` or `~/.bashrc`.

## Usage (development mode)

```bash
deno task dev <command> [subcommand] [options]
```

## Available commands

### `team` — Manage teams

| Subcommand  | Description      | Arguments | Options |
| ----------- | ---------------- | --------- | ------- |
| `team list` | List all teams   | —         | —       |
| `team get`  | Get a team by ID | `<id>`    | —       |

**Examples:**

```bash
# List all teams
deno task dev team list

# Get a specific team
deno task dev team get <team-id>
```

---

### `user` — Manage users

| Subcommand | Description                                             | Arguments | Options |
| ---------- | ------------------------------------------------------- | --------- | ------- |
| `user get` | Get a user by ID (or `"me"` for the authenticated user) | `<id>`    | —       |

**Examples:**

```bash
# Get the authenticated user
deno task dev user get me

# Get a user by ID
deno task dev user get <user-id>
```

---

### `issue` — Manage issues

| Subcommand     | Description        | Arguments | Options                                                                                                                                                                                 |
| -------------- | ------------------ | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `issue list`   | List issues        | —         | `--first <count>`, `--team <teamId>`, `--assignee <userId>`, `--state <stateId>`                                                                                                        |
| `issue get`    | Get an issue by ID | `<id>`    | —                                                                                                                                                                                       |
| `issue create` | Create a new issue | —         | `--title <title>` _(required)_, `--team-id <teamId>` _(required)_, `--description <desc>`, `--priority <0-4>`, `--assignee-id <userId>`, `--state-id <stateId>`, `--label-ids <ids...>` |
| `issue update` | Update an issue    | `<id>`    | `--title <title>`, `--description <desc>`, `--priority <0-4>`, `--assignee-id <userId>`, `--state-id <stateId>`                                                                         |

**Examples:**

```bash
# List the first 10 issues for a team
deno task dev issue list --first 10 --team <team-id>

# List issues assigned to a user
deno task dev issue list --assignee <user-id>

# Get an issue by ID
deno task dev issue get <issue-id>

# Create an issue
deno task dev issue create --title "My issue" --team-id <team-id> --priority 2

# Update an issue
deno task dev issue update <issue-id> --title "New title" --state-id <state-id>
```

---

### `comment` — Manage comments

| Subcommand       | Description                | Arguments | Options                                                           |
| ---------------- | -------------------------- | --------- | ----------------------------------------------------------------- |
| `comment list`   | List comments for an issue | —         | `--issue-id <issueId>` _(required)_                               |
| `comment get`    | Get a comment by ID        | `<id>`    | —                                                                 |
| `comment create` | Create a comment           | —         | `--issue-id <issueId>` _(required)_, `--body <body>` _(required)_ |
| `comment update` | Update a comment           | `<id>`    | `--body <body>` _(required)_                                      |

**Examples:**

```bash
# List comments for an issue
deno task dev comment list --issue-id <issue-id>

# Get a comment
deno task dev comment get <comment-id>

# Create a comment
deno task dev comment create --issue-id <issue-id> --body "My comment"

# Update a comment
deno task dev comment update <comment-id> --body "Updated comment"
```

---

### `issue-label` — Manage labels

| Subcommand         | Description       | Arguments | Options                                 |
| ------------------ | ----------------- | --------- | --------------------------------------- |
| `issue-label list` | List issue labels | —         | `--first <count>`, `--team-id <teamId>` |

**Examples:**

```bash
# List all labels
deno task dev issue-label list

# List labels for a specific team
deno task dev issue-label list --team-id <team-id>
```

---

### `project` — Manage projects

| Subcommand    | Description         | Arguments | Options |
| ------------- | ------------------- | --------- | ------- |
| `project get` | Get a project by ID | `<id>`    | —       |

**Examples:**

```bash
# Get project details
deno task dev project get <project-id>
```

## Building an executable

Deno can compile the project into a **standalone native binary** — no dependencies required on the target machine.

### Compile for your platform

```bash
deno compile --allow-env --allow-net --output linear main.ts
```

This produces a `linear` executable in the current directory.

### Cross-compilation

```bash
# macOS Apple Silicon (M1/M2/M3)
deno compile --allow-env --allow-net --target aarch64-apple-darwin --output linear-macos-arm64 main.ts

# macOS Intel
deno compile --allow-env --allow-net --target x86_64-apple-darwin --output linear-macos-x64 main.ts

# Linux x64
deno compile --allow-env --allow-net --target x86_64-unknown-linux-gnu --output linear-linux main.ts

# Windows x64
deno compile --allow-env --allow-net --target x86_64-pc-windows-msvc --output linear-windows.exe main.ts
```

### Running the executable

```bash
# Set your API key
export LINEAR_API_KEY="lin_api_xxxxx"

# Run a command
./linear team list
./linear issue list --first 5
```

### Installing globally

```bash
# Option 1: /usr/local/bin (requires sudo)
sudo cp ./linear /usr/local/bin/linear

# Option 2: user-local directory (no sudo)
mkdir -p ~/.local/bin
cp ./linear ~/.local/bin/linear
# Make sure ~/.local/bin is in your PATH:
# export PATH="$HOME/.local/bin:$PATH"
```

Then simply run:

```bash
linear issue list
```

## Multiple workspaces

To use multiple Linear workspaces with different API keys, create wrapper scripts in the `scripts/` directory:

**`scripts/linear-work.sh`**

```bash
#!/bin/bash
export LINEAR_API_KEY="lin_api_YOUR_WORK_KEY"
exec ./linear "$@"
```

**`scripts/linear-perso.sh`**

```bash
#!/bin/bash
export LINEAR_API_KEY="lin_api_YOUR_PERSONAL_KEY"
exec ./linear "$@"
```

Make them executable:

```bash
chmod +x scripts/linear-work.sh scripts/linear-perso.sh
```

Usage:

```bash
./scripts/linear-work.sh issue list
./scripts/linear-perso.sh team list
```

> ⚠️ Files in the `scripts/` directory are gitignored to protect your API keys.

## Project structure

```
linear-cli/
├── main.ts                         # Entry point
├── deno.json                       # Deno configuration & dependencies
├── deno.lock                       # Dependency lockfile
├── scripts/                        # Wrapper scripts (gitignored)
│   ├── linear-work.sh
│   └── linear-perso.sh
└── src/
    ├── client.ts                   # Linear client (singleton)
    ├── errors.ts                   # Centralized error handling
    ├── output.ts                   # JSON formatting utilities
    └── commands/
        ├── team/                   # list, get
        ├── user/                   # get
        ├── issue/                  # list, get, create, update
        ├── comment/                # list, get, create, update
        ├── issue-label/            # list
        └── project/                # get
```

## Deno tasks

| Command           | Description                     |
| ----------------- | ------------------------------- |
| `deno task dev`   | Run the CLI in development mode |
| `deno task check` | Type-check TypeScript           |
| `deno task lint`  | Run the linter                  |
| `deno task fmt`   | Format the code                 |

## License

Private project.
