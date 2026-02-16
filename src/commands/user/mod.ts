import { Command } from "@cliffy/command";
import { getCommand } from "./get.ts";
import { listCommand } from "./list.ts";

export const userCommand = new Command()
  .description("Manage users.")
  .command("get", getCommand)
  .command("list", listCommand);
