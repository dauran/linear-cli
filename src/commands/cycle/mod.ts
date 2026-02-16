import { Command } from "@cliffy/command";
import { getCommand } from "./get.ts";
import { listCommand } from "./list.ts";
import { createCommand } from "./create.ts";
import { updateCommand } from "./update.ts";
import { archiveCommand } from "./archive.ts";

export const cycleCommand = new Command()
  .description("Manage cycles.")
  .command("get", getCommand)
  .command("list", listCommand)
  .command("create", createCommand)
  .command("update", updateCommand)
  .command("archive", archiveCommand);
