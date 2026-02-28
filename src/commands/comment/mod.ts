import { Command } from "@cliffy/command";
import { getCommand } from "./get.ts";
import { listCommand } from "./list.ts";
import { createCommand } from "./create.ts";
import { updateCommand } from "./update.ts";
import { deleteCommand } from "./delete.ts";
import { resolveCommand } from "./resolve.ts";

export const commentCommand = new Command()
  .description("Manage comments.")
  .command("get", getCommand)
  .command("list", listCommand)
  .command("create", createCommand)
  .command("update", updateCommand)
  .command("delete", deleteCommand)
  .command("resolve", resolveCommand);
