import { Command } from "@cliffy/command";
import { getCommand } from "./get.ts";
import { listCommand } from "./list.ts";
import { createCommand } from "./create.ts";
import { updateCommand } from "./update.ts";
import { deleteCommand } from "./delete.ts";
import { downloadCommand } from "./download.ts";
import { archiveCommand } from "./archive.ts";
import { searchCommand } from "./search.ts";

export const issueCommand = new Command()
  .description("Manage issues.")
  .command("get", getCommand)
  .command("list", listCommand)
  .command("create", createCommand)
  .command("update", updateCommand)
  .command("delete", deleteCommand)
  .command("download", downloadCommand)
  .command("archive", archiveCommand)
  .command("search", searchCommand);
