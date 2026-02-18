# Linear CLI

A command-line interface to interact with the [Linear](https://linear.app) API from your terminal. Manage issues, projects, cycles, documents, and more without leaving the shell.

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
deno task dev team list
deno task dev team get <team-id>
```

---

### `user` — Manage users

| Subcommand  | Description                                             | Arguments | Options            |
| ----------- | ------------------------------------------------------- | --------- | ------------------ |
| `user get`  | Get a user by ID (or `"me"` for the authenticated user) | `<id>`    | —                  |
| `user list` | List users                                              | —         | `--first <count>`  |

**Examples:**

```bash
deno task dev user get me
deno task dev user list --first 20
```

---

### `issue` — Manage issues

| Subcommand      | Description         | Arguments  | Options                                                                                                                                                                                 |
| --------------- | ------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `issue list`    | List issues         | —          | `--first <count>`, `--team <teamId>`, `--assignee <userId>`, `--state <stateId>`, `--cycle <cycleId>`, `--project <projectId>`, `--label <labelId>`, `--priority <0-4>`                  |
| `issue get`     | Get an issue by ID  | `<id>`     | —                                                                                                                                                                                       |
| `issue create`  | Create a new issue  | —          | `--title <title>` _(required)_, `--team-id <teamId>` _(required)_, `--description <desc>`, `--priority <0-4>`, `--assignee-id <userId>`, `--state-id <stateId>`, `--label-ids <ids...>`, `--cycle-id <cycleId>`, `--due-date <YYYY-MM-DD>`, `--estimate <n>`, `--parent-id <issueId>`, `--project-id <projectId>`, `--project-milestone-id <id>`, `--subscriber-ids <ids...>`, `--sort-order <n>`, `--priority-sort-order <n>` |
| `issue update`  | Update an issue     | `<id>`     | `--title <title>`, `--description <desc>`, `--priority <0-4>`, `--assignee-id <userId>`, `--state-id <stateId>`, `--parent-id <issueId>`, `--cycle-id <cycleId>`, `--due-date <YYYY-MM-DD>`, `--estimate <n>`, `--project-id <projectId>`, `--project-milestone-id <id>`, `--label-ids <ids...>`, `--added-label-ids <ids...>`, `--removed-label-ids <ids...>`, `--subscriber-ids <ids...>`, `--team-id <teamId>`, `--sort-order <n>`, `--priority-sort-order <n>`, `--snoozed-until-at <datetime>`, `--sub-issue-sort-order <n>` |
| `issue delete`  | Delete an issue     | `<id>`     | —                                                                                                                                                                                       |
| `issue archive` | Archive an issue    | `<id>`     | —                                                                                                                                                                                       |
| `issue search`  | Search issues       | `<term>`   | `--first <count>`                                                                                                                                                                       |

**Examples:**

```bash
deno task dev issue list --first 10 --team <team-id>
deno task dev issue create --title "My issue" --team-id <team-id> --priority 2
deno task dev issue update <issue-id> --title "New title" --state-id <state-id>
# Make an issue a sub-issue of another
deno task dev issue update <issue-id> --parent-id <parent-issue-id>
deno task dev issue delete <issue-id>
deno task dev issue archive <issue-id>
deno task dev issue search "bug" --first 20
```

---

### `comment` — Manage comments

| Subcommand       | Description                | Arguments | Options                                                           |
| ---------------- | -------------------------- | --------- | ----------------------------------------------------------------- |
| `comment list`   | List comments              | —         | `--issue-id <issueId>`, `--first <count>`                                                                                         |
| `comment get`    | Get a comment by ID        | `<id>`    | —                                                                                                                                  |
| `comment create` | Create a comment           | —         | `--issue-id <issueId>` _(required)_, `--body <body>` _(required)_, `--parent-id <commentId>`, `--project-update-id <id>`, `--document-content-id <id>` |
| `comment update` | Update a comment           | `<id>`    | `--body <body>`, `--resolved`, `--unresolved`                     |
| `comment delete` | Delete a comment           | `<id>`    | —                                                                 |

**Examples:**

```bash
deno task dev comment list --issue-id <issue-id>
deno task dev comment create --issue-id <issue-id> --body "My comment"
deno task dev comment update <comment-id> --body "Updated comment"
deno task dev comment delete <comment-id>
```

---

### `issue-label` — Manage issue labels

| Subcommand           | Description           | Arguments | Options                                                                                               |
| -------------------- | --------------------- | --------- | ----------------------------------------------------------------------------------------------------- |
| `issue-label list`   | List issue labels     | —         | `--first <count>`, `--team-id <teamId>`                                                               |
| `issue-label get`    | Get a label by ID     | `<id>`    | —                                                                                                     |
| `issue-label create` | Create a label        | —         | `--name <name>` _(required)_, `--team-id <teamId>`, `--color <color>`, `--description <desc>`, `--parent-id <id>`, `--is-group` |
| `issue-label update` | Update a label        | `<id>`    | `--name <name>`, `--color <color>`, `--description <desc>`, `--parent-id <id>`, `--is-group`                                    |
| `issue-label delete` | Delete a label        | `<id>`    | —                                                                                                     |

**Examples:**

```bash
deno task dev issue-label list --team-id <team-id>
deno task dev issue-label create --name "Bug" --team-id <team-id> --color "#ff0000"
deno task dev issue-label update <label-id> --color "#00ff00"
deno task dev issue-label delete <label-id>
```

---

### `project` — Manage projects

| Subcommand        | Description          | Arguments | Options                                                                                                                                                          |
| ----------------- | -------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `project list`    | List projects        | —         | `--first <count>`, `--team <teamId>`, `--state <state>`, `--lead <leadId>`                                                                                        |
| `project get`     | Get a project by ID  | `<id>`    | —                                                                                                                                                                |
| `project create`  | Create a project     | —         | `--name <name>` _(required)_, `--team-ids <ids...>` _(required)_, `--description <desc>`, `--state <state>`, `--lead-id <id>`, `--start-date <date>`, `--target-date <date>`, `--color <color>`, `--icon <icon>`, `--member-ids <ids...>`, `--priority <0-4>`, `--status-id <id>`, `--content <markdown>`, `--sort-order <n>`, `--priority-sort-order <n>` |
| `project update`  | Update a project     | `<id>`    | `--name <name>`, `--description <desc>`, `--state <state>`, `--lead-id <id>`, `--start-date <date>`, `--target-date <date>`, `--color <color>`, `--icon <icon>`, `--member-ids <ids...>`, `--priority <0-4>`, `--status-id <id>`, `--content <markdown>`, `--team-ids <ids...>`, `--sort-order <n>`, `--priority-sort-order <n>` |
| `project delete`  | Delete a project     | `<id>`    | —                                                                                                                                                                |
| `project archive` | Archive a project    | `<id>`    | —                                                                                                                                                                |
| `project search`  | Search projects      | `<term>`  | `--first <count>`                                                                                                                                                |

**Examples:**

```bash
deno task dev project list --first 10
deno task dev project create --name "My project" --team-ids <team-id>
deno task dev project update <project-id> --state "started"
deno task dev project delete <project-id>
deno task dev project search "redesign"
```

---

### `cycle` — Manage cycles

| Subcommand      | Description        | Arguments | Options                                                                                                                  |
| --------------- | ------------------ | --------- | ------------------------------------------------------------------------------------------------------------------------ |
| `cycle list`    | List cycles        | —         | `--first <count>`, `--team <teamId>`                                                                                      |
| `cycle get`     | Get a cycle by ID  | `<id>`    | —                                                                                                                        |
| `cycle create`  | Create a cycle     | —         | `--team-id <teamId>` _(required)_, `--starts-at <date>` _(required)_, `--ends-at <date>` _(required)_, `--name <name>`, `--description <desc>` |
| `cycle update`  | Update a cycle     | `<id>`    | `--name <name>`, `--description <desc>`, `--starts-at <date>`, `--ends-at <date>`                                         |
| `cycle archive` | Archive a cycle    | `<id>`    | —                                                                                                                        |

**Examples:**

```bash
deno task dev cycle list --team <team-id>
deno task dev cycle create --team-id <team-id> --starts-at 2025-01-01 --ends-at 2025-01-14
deno task dev cycle archive <cycle-id>
```

---

### `workflow-state` — Manage workflow states

| Subcommand               | Description          | Arguments | Options                                                                                                                                       |
| ------------------------ | -------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `workflow-state list`    | List states          | —         | `--first <count>`, `--team <teamId>`, `--type <type>`                                                                                         |
| `workflow-state get`     | Get a state by ID    | `<id>`    | —                                                                                                                                             |
| `workflow-state create`  | Create a state       | —         | `--name <name>` _(required)_, `--team-id <teamId>` _(required)_, `--type <type>` _(required)_, `--color <color>` _(required)_, `--description <desc>`, `--position <n>` |
| `workflow-state update`  | Update a state       | `<id>`    | `--name <name>`, `--color <color>`, `--description <desc>`, `--position <n>`                                                                   |
| `workflow-state archive` | Archive a state      | `<id>`    | —                                                                                                                                             |

State types: `backlog`, `unstarted`, `started`, `completed`, `cancelled`

**Examples:**

```bash
deno task dev workflow-state list --team <team-id> --type started
deno task dev workflow-state create --name "In Review" --team-id <team-id> --type started --color "#f0c000"
```

---

### `document` — Manage documents

| Subcommand        | Description          | Arguments | Options                                                                              |
| ----------------- | -------------------- | --------- | ------------------------------------------------------------------------------------ |
| `document list`   | List documents       | —         | `--first <count>`, `--project <projectId>`                                            |
| `document get`    | Get a document by ID | `<id>`    | —                                                                                    |
| `document create` | Create a document    | —         | `--title <title>` _(required)_, `--content <content>`, `--project-id <id>`, `--icon <icon>`, `--color <color>`, `--issue-id <issueId>`, `--sort-order <n>` |
| `document update` | Update a document    | `<id>`    | `--title <title>`, `--content <content>`, `--project-id <id>`, `--icon <icon>`, `--color <color>`, `--issue-id <issueId>`, `--sort-order <n>`              |
| `document delete` | Delete a document    | `<id>`    | —                                                                                    |
| `document search` | Search documents     | `<term>`  | `--first <count>`                                                                    |

**Examples:**

```bash
deno task dev document list --project <project-id>
deno task dev document create --title "RFC: New Feature" --content "## Summary\n..."
deno task dev document search "architecture"
```

---

### `initiative` — Manage initiatives

| Subcommand           | Description            | Arguments | Options                                                                          |
| -------------------- | ---------------------- | --------- | -------------------------------------------------------------------------------- |
| `initiative list`    | List initiatives       | —         | `--first <count>`                                                                |
| `initiative get`     | Get an initiative      | `<id>`    | —                                                                                |
| `initiative create`  | Create an initiative   | —         | `--name <name>` _(required)_, `--description <desc>`, `--color <color>`, `--icon <icon>`, `--owner-id <userId>`, `--status <status>`, `--target-date <YYYY-MM-DD>`, `--content <markdown>`, `--sort-order <n>` |
| `initiative update`  | Update an initiative   | `<id>`    | `--name <name>`, `--description <desc>`, `--status <status>`, `--color <color>`, `--icon <icon>`, `--owner-id <userId>`, `--target-date <YYYY-MM-DD>`, `--content <markdown>`, `--sort-order <n>` |
| `initiative delete`  | Delete an initiative   | `<id>`    | —                                                                                |
| `initiative archive` | Archive an initiative  | `<id>`    | —                                                                                |

**Examples:**

```bash
deno task dev initiative list
deno task dev initiative create --name "Q1 Goals" --color "#3b82f6"
```

---

### `roadmap` — Manage roadmaps

| Subcommand        | Description         | Arguments | Options                                                          |
| ----------------- | ------------------- | --------- | ---------------------------------------------------------------- |
| `roadmap list`    | List roadmaps       | —         | `--first <count>`                                                |
| `roadmap get`     | Get a roadmap       | `<id>`    | —                                                                |
| `roadmap create`  | Create a roadmap    | —         | `--name <name>` _(required)_, `--description <desc>`, `--color <color>`, `--owner-id <userId>`, `--sort-order <n>` |
| `roadmap update`  | Update a roadmap    | `<id>`    | `--name <name>`, `--description <desc>`, `--color <color>`, `--owner-id <userId>`, `--sort-order <n>`               |
| `roadmap delete`  | Delete a roadmap    | `<id>`    | —                                                                |
| `roadmap archive` | Archive a roadmap   | `<id>`    | —                                                                |

**Examples:**

```bash
deno task dev roadmap list
deno task dev roadmap create --name "2025 Roadmap"
```

---

### `project-milestone` — Manage project milestones

| Subcommand                  | Description           | Arguments | Options                                                                                                         |
| --------------------------- | --------------------- | --------- | --------------------------------------------------------------------------------------------------------------- |
| `project-milestone list`    | List milestones       | —         | `--first <count>`, `--project <projectId>`                                                                       |
| `project-milestone get`     | Get a milestone       | `<id>`    | —                                                                                                               |
| `project-milestone create`  | Create a milestone    | —         | `--name <name>` _(required)_, `--project-id <id>` _(required)_, `--description <desc>`, `--target-date <date>`, `--sort-order <n>` |
| `project-milestone update`  | Update a milestone    | `<id>`    | `--name <name>`, `--description <desc>`, `--target-date <date>`, `--sort-order <n>`, `--project-id <id>`            |
| `project-milestone delete`  | Delete a milestone    | `<id>`    | —                                                                                                               |

**Examples:**

```bash
deno task dev project-milestone list --project <project-id>
deno task dev project-milestone create --name "Beta" --project-id <project-id> --target-date 2025-03-01
```

---

### `project-update` — Manage project updates

| Subcommand              | Description              | Arguments | Options                                                                               |
| ----------------------- | ------------------------ | --------- | ------------------------------------------------------------------------------------- |
| `project-update list`   | List project updates     | —         | `--first <count>`, `--project <projectId>`                                             |
| `project-update get`    | Get a project update     | `<id>`    | —                                                                                     |
| `project-update create` | Create a project update  | —         | `--project-id <id>` _(required)_, `--body <body>` _(required)_, `--health <health>`    |
| `project-update update` | Update a project update  | `<id>`    | `--body <body>`, `--health <health>`, `--is-diff-hidden`                                |
| `project-update delete` | Delete a project update  | `<id>`    | —                                                                                     |

Health values: `onTrack`, `atRisk`, `offTrack`

**Examples:**

```bash
deno task dev project-update list --project <project-id>
deno task dev project-update create --project-id <project-id> --body "Sprint went well" --health onTrack
```

---

### `issue-relation` — Manage issue relations

| Subcommand              | Description           | Arguments | Options                                                                                                  |
| ----------------------- | --------------------- | --------- | -------------------------------------------------------------------------------------------------------- |
| `issue-relation list`   | List relations        | —         | `--first <count>`                                                                                        |
| `issue-relation get`    | Get a relation        | `<id>`    | —                                                                                                        |
| `issue-relation create` | Create a relation     | —         | `--issue-id <id>` _(required)_, `--related-issue-id <id>` _(required)_, `--type <type>` _(required)_      |
| `issue-relation update` | Update a relation     | `<id>`    | `--type <type>`, `--issue-id <issueId>`, `--related-issue-id <issueId>`                                    |
| `issue-relation delete` | Delete a relation     | `<id>`    | —                                                                                                        |

Relation types: `blocks`, `duplicate`, `related`, `similar`

**Examples:**

```bash
# Issue A blocks Issue B
deno task dev issue-relation create --issue-id <issue-a-id> --related-issue-id <issue-b-id> --type blocks

# Issue A is blocked by Issue B (reverse the IDs, still use "blocks")
deno task dev issue-relation create --issue-id <issue-b-id> --related-issue-id <issue-a-id> --type blocks

# Mark Issue B as a duplicate of Issue A
deno task dev issue-relation create --issue-id <issue-a-id> --related-issue-id <issue-b-id> --type duplicate

# Link two related issues
deno task dev issue-relation create --issue-id <issue-a-id> --related-issue-id <issue-b-id> --type related
```

---

### `webhook` — Manage webhooks

| Subcommand       | Description        | Arguments | Options                                                                                                            |
| ---------------- | ------------------ | --------- | ------------------------------------------------------------------------------------------------------------------ |
| `webhook list`   | List webhooks      | —         | `--first <count>`                                                                                                  |
| `webhook get`    | Get a webhook      | `<id>`    | —                                                                                                                  |
| `webhook create` | Create a webhook   | —         | `--url <url>` _(required)_, `--resource-types <types...>` _(required)_, `--label <label>`, `--team-id <id>`, `--all-public-teams`, `--enabled <bool>`, `--secret <secret>` |
| `webhook update` | Update a webhook   | `<id>`    | `--url <url>`, `--label <label>`, `--enabled <bool>`, `--resource-types <types...>`, `--secret <secret>`             |

**Examples:**

```bash
deno task dev webhook list
deno task dev webhook create --url "https://example.com/hook" --resource-types Issue Comment
```

---

### `notification` — Manage notifications

| Subcommand             | Description            | Arguments | Options                                                     |
| ---------------------- | ---------------------- | --------- | ----------------------------------------------------------- |
| `notification list`    | List notifications     | —         | `--first <count>`                                           |
| `notification get`     | Get a notification     | `<id>`    | —                                                           |
| `notification update`  | Update a notification  | `<id>`    | `--read-at <date>`, `--snoozed-until-at <date>`             |
| `notification archive` | Archive a notification | `<id>`    | —                                                           |

**Examples:**

```bash
deno task dev notification list --first 10
deno task dev notification archive <notification-id>
```

---

### `attachment` — Manage attachments

| Subcommand          | Description          | Arguments | Options                                                                                         |
| ------------------- | -------------------- | --------- | ----------------------------------------------------------------------------------------------- |
| `attachment list`   | List attachments     | —         | `--first <count>`                                                                               |
| `attachment get`    | Get an attachment    | `<id>`    | —                                                                                               |
| `attachment create` | Create an attachment | —         | `--issue-id <id>` _(required)_, `--url <url>` _(required)_, `--title <title>` _(required)_, `--subtitle <subtitle>`, `--comment-body <body>`, `--icon-url <url>`, `--group-by-source` |
| `attachment update` | Update an attachment | `<id>`    | `--title <title>`, `--subtitle <subtitle>`, `--url <url>`, `--icon-url <url>`                     |
| `attachment delete` | Delete an attachment | `<id>`    | —                                                                                               |

**Examples:**

```bash
deno task dev attachment list --first 20
deno task dev attachment create --issue-id <issue-id> --url "https://example.com/file.pdf" --title "Design spec"
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
export LINEAR_API_KEY="lin_api_xxxxx"

./linear team list
./linear issue list --first 5
./linear cycle list --team <team-id>
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

> Files in the `scripts/` directory are gitignored to protect your API keys.

## Project structure

```
linear-cli/
├── main.ts                         # Entry point
├── deno.json                       # Deno configuration & dependencies
├── deno.lock                       # Dependency lockfile
├── scripts/                        # Wrapper scripts (gitignored)
└── src/
    ├── client.ts                   # Linear client (singleton)
    ├── errors.ts                   # Centralized error handling
    ├── output.ts                   # JSON formatting utilities
    └── commands/
        ├── team/                   # list, get
        ├── user/                   # get, list
        ├── issue/                  # list, get, create, update, delete, archive, search
        ├── comment/                # list, get, create, update, delete
        ├── issue-label/            # list, get, create, update, delete
        ├── project/                # list, get, create, update, delete, archive, search
        ├── cycle/                  # list, get, create, update, archive
        ├── workflow-state/         # list, get, create, update, archive
        ├── document/               # list, get, create, update, delete, search
        ├── initiative/             # list, get, create, update, delete, archive
        ├── roadmap/                # list, get, create, update, delete, archive
        ├── project-milestone/      # list, get, create, update, delete
        ├── project-update/         # list, get, create, update, delete
        ├── issue-relation/         # list, get, create, update, delete
        ├── webhook/                # list, get, create, update
        ├── notification/           # list, get, update, archive
        └── attachment/             # list, get, create, update, delete
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
