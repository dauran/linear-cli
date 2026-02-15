import { Command } from "@cliffy/command";
import { teamCommand } from "./src/commands/team/mod.ts";
import { userCommand } from "./src/commands/user/mod.ts";
import { issueCommand } from "./src/commands/issue/mod.ts";
import { commentCommand } from "./src/commands/comment/mod.ts";
import { issueLabelCommand } from "./src/commands/issue-label/mod.ts";
import { projectCommand } from "./src/commands/project/mod.ts";

const cli = new Command()
  .name("linear")
  .version("0.1.0")
  .description("CLI for interacting with the Linear API.")
  .command("team", teamCommand)
  .command("user", userCommand)
  .command("issue", issueCommand)
  .command("comment", commentCommand)
  .command("issue-label", issueLabelCommand)
  .command("project", projectCommand);

await cli.parse(Deno.args);
