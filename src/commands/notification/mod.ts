import { Command } from "@cliffy/command";
import { getCommand } from "./get.ts";
import { listCommand } from "./list.ts";
import { updateCommand } from "./update.ts";
import { archiveCommand } from "./archive.ts";

export const notificationCommand = new Command()
  .description("Manage notifications.")
  .command("get", getCommand)
  .command("list", listCommand)
  .command("update", updateCommand)
  .command("archive", archiveCommand);
