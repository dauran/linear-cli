import { Command } from "@cliffy/command";
import { teamCommand } from "./src/commands/team/mod.ts";
import { userCommand } from "./src/commands/user/mod.ts";
import { issueCommand } from "./src/commands/issue/mod.ts";
import { commentCommand } from "./src/commands/comment/mod.ts";
import { issueLabelCommand } from "./src/commands/issue-label/mod.ts";
import { projectCommand } from "./src/commands/project/mod.ts";
import { cycleCommand } from "./src/commands/cycle/mod.ts";
import { workflowStateCommand } from "./src/commands/workflow-state/mod.ts";
import { documentCommand } from "./src/commands/document/mod.ts";
import { initiativeCommand } from "./src/commands/initiative/mod.ts";
import { roadmapCommand } from "./src/commands/roadmap/mod.ts";
import { projectMilestoneCommand } from "./src/commands/project-milestone/mod.ts";
import { projectUpdateCommand } from "./src/commands/project-update/mod.ts";
import { issueRelationCommand } from "./src/commands/issue-relation/mod.ts";
import { webhookCommand } from "./src/commands/webhook/mod.ts";
import { notificationCommand } from "./src/commands/notification/mod.ts";
import { attachmentCommand } from "./src/commands/attachment/mod.ts";

const cli = new Command()
  .name("linear")
  .version("0.1.0")
  .description("CLI for interacting with the Linear API.")
  .command("team", teamCommand)
  .command("user", userCommand)
  .command("issue", issueCommand)
  .command("comment", commentCommand)
  .command("issue-label", issueLabelCommand)
  .command("project", projectCommand)
  .command("cycle", cycleCommand)
  .command("workflow-state", workflowStateCommand)
  .command("document", documentCommand)
  .command("initiative", initiativeCommand)
  .command("roadmap", roadmapCommand)
  .command("project-milestone", projectMilestoneCommand)
  .command("project-update", projectUpdateCommand)
  .command("issue-relation", issueRelationCommand)
  .command("webhook", webhookCommand)
  .command("notification", notificationCommand)
  .command("attachment", attachmentCommand);

await cli.parse(Deno.args);
