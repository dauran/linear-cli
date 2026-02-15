import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { pick, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

interface CreateOptions {
  title: string;
  teamId: string;
  description?: string;
  priority?: number;
  assigneeId?: string;
  stateId?: string;
  labelIds?: string[];
}

export const createCommand = new Command()
  .description("Create a new issue.")
  .option("--title <title:string>", "Issue title.", { required: true })
  .option("--team-id <teamId:string>", "Team ID.", { required: true })
  .option("--description <description:string>", "Issue description.")
  .option("--priority <priority:number>", "Priority (0-4).")
  .option("--assignee-id <assigneeId:string>", "Assignee user ID.")
  .option("--state-id <stateId:string>", "State ID.")
  .option("--label-ids <labelIds...:string>", "Label IDs.")
  .action(
    handleErrors(async (options: CreateOptions) => {
      const client = getClient();

      const input: {
        title: string;
        teamId: string;
        description?: string;
        priority?: number;
        assigneeId?: string;
        stateId?: string;
        labelIds?: string[];
      } = {
        title: options.title,
        teamId: options.teamId,
      };
      if (options.description !== undefined) {
        input.description = options.description;
      }
      if (options.priority !== undefined) input.priority = options.priority;
      if (options.assigneeId) input.assigneeId = options.assigneeId;
      if (options.stateId) input.stateId = options.stateId;
      if (options.labelIds) input.labelIds = options.labelIds;

      const payload = await client.createIssue(input);
      const issue = await payload.issue;

      if (issue) {
        printJson(
          pick(issue, [
            "id",
            "identifier",
            "title",
            "url",
          ]),
        );
      }
    }),
  );
