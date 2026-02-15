import { Command } from "@cliffy/command";
import { listCommand } from "./list.ts";

export const issueLabelCommand = new Command()
  .description("Manage issue labels.")
  .command("list", listCommand);
