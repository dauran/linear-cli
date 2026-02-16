import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { pick, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

interface CreateOptions {
  name: string;
  teamId?: string;
  color?: string;
  description?: string;
  parentId?: string;
  isGroup?: boolean;
}

export const createCommand = new Command()
  .description("Create a new issue label.")
  .option("--name <name:string>", "Label name.", { required: true })
  .option("--team-id <teamId:string>", "Team ID (omit for workspace label).")
  .option("--color <color:string>", "Label color.")
  .option("--description <description:string>", "Label description.")
  .option("--parent-id <parentId:string>", "Parent label ID.")
  .option("--is-group", "Label is a group.")
  .action(
    handleErrors(async (options: CreateOptions) => {
      const client = getClient();

      const input: {
        name: string;
        teamId?: string;
        color?: string;
        description?: string;
        parentId?: string;
        isGroup?: boolean;
      } = {
        name: options.name,
      };
      if (options.teamId) input.teamId = options.teamId;
      if (options.color !== undefined) input.color = options.color;
      if (options.description !== undefined) {
        input.description = options.description;
      }
      if (options.parentId) input.parentId = options.parentId;
      if (options.isGroup !== undefined) input.isGroup = options.isGroup;

      const payload = await client.createIssueLabel(input);
      const label = await payload.issueLabel;

      if (label) {
        printJson(pick(label, ["id", "name", "color"]));
      }
    }),
  );
