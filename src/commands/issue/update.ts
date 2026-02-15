import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { pick, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

interface UpdateOptions {
  title?: string;
  description?: string;
  priority?: number;
  assigneeId?: string;
  stateId?: string;
}

export const updateCommand = new Command()
  .description("Update an issue by ID.")
  .arguments("<id:string>")
  .option("--title <title:string>", "New title.")
  .option("--description <description:string>", "New description.")
  .option("--priority <priority:number>", "New priority (0-4).")
  .option("--assignee-id <assigneeId:string>", "New assignee user ID.")
  .option("--state-id <stateId:string>", "New state ID.")
  .action(
    handleErrors(async (options: UpdateOptions, id: string) => {
      const client = getClient();

      const input: {
        title?: string;
        description?: string;
        priority?: number;
        assigneeId?: string;
        stateId?: string;
      } = {};
      if (options.title !== undefined) input.title = options.title;
      if (options.description !== undefined) {
        input.description = options.description;
      }
      if (options.priority !== undefined) input.priority = options.priority;
      if (options.assigneeId) input.assigneeId = options.assigneeId;
      if (options.stateId) input.stateId = options.stateId;

      const payload = await client.updateIssue(id, input);
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
