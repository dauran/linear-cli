import { Command } from "@cliffy/command";
import { getCommand } from "./get.ts";
import { listCommand } from "./list.ts";
import { createCommand } from "./create.ts";
import { updateCommand } from "./update.ts";
import { deleteCommand } from "./delete.ts";

export const projectUpdateCommand = new Command()
  .description("Manage project updates.")
  .command("get", getCommand)
  .command("list", listCommand)
  .command("create", createCommand)
  .command("update", updateCommand)
  .command("delete", deleteCommand);
