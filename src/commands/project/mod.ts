import { Command } from "@cliffy/command";
import { getCommand } from "./get.ts";

export const projectCommand = new Command()
  .description("Manage projects.")
  .command("get", getCommand);
