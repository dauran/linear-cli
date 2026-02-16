import { Command } from "@cliffy/command";
import { getCommand } from "./get.ts";
import { listCommand } from "./list.ts";
import { createCommand } from "./create.ts";
import { updateCommand } from "./update.ts";

export const webhookCommand = new Command()
  .description("Manage webhooks.")
  .command("get", getCommand)
  .command("list", listCommand)
  .command("create", createCommand)
  .command("update", updateCommand);
