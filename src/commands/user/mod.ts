import { Command } from "@cliffy/command";
import { getCommand } from "./get.ts";

export const userCommand = new Command()
  .description("Manage users.")
  .command("get", getCommand);
