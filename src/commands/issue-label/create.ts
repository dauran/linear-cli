import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { pick, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

interface CreateOptions {
  name: string;
  teamId: string;
  color?: string;
  description?: string;
  parentId?: string;
}

export const createCommand = new Command()
  .description("Create a new issue label.")
  .option("--name <name:string>", "Label name.", { required: true })
  .option("--team-id <teamId:string>", "Team ID.", { required: true })
  .option("--color <color:string>", "Label color.")
  .option("--description <description:string>", "Label description.")
  .option("--parent-id <parentId:string>", "Parent label ID.")
  .action(
    handleErrors(async (options: CreateOptions) => {
      const client = getClient();

      const input: {
        name: string;
        teamId: string;
        color?: string;
        description?: string;
        parentId?: string;
      } = {
        name: options.name,
        teamId: options.teamId,
      };
      if (options.color !== undefined) input.color = options.color;
      if (options.description !== undefined) {
        input.description = options.description;
      }
      if (options.parentId) input.parentId = options.parentId;

      const payload = await client.createIssueLabel(input);
      const label = await payload.issueLabel;

      if (label) {
        printJson(pick(label, ["id", "name", "color"]));
      }
    }),
  );
