import { Command } from "@cliffy/command";
import { listCommand } from "./list.ts";
import { getCommand } from "./get.ts";

export const teamCommand = new Command()
  .description("Manage teams.")
  .command("list", listCommand)
  .command("get", getCommand);
