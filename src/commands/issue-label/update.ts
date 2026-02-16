import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { pick, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

interface UpdateOptions {
  name?: string;
  color?: string;
  description?: string;
  parentId?: string;
  isGroup?: boolean;
}

export const updateCommand = new Command()
  .description("Update an issue label by ID.")
  .arguments("<id:string>")
  .option("--name <name:string>", "New name.")
  .option("--color <color:string>", "New color.")
  .option("--description <description:string>", "New description.")
  .option("--parent-id <parentId:string>", "New parent label ID.")
  .option("--is-group", "Label is a group.")
  .action(
    handleErrors(async (options: UpdateOptions, id: string) => {
      const client = getClient();

      const input: {
        name?: string;
        color?: string;
        description?: string;
        parentId?: string;
        isGroup?: boolean;
      } = {};
      if (options.name !== undefined) input.name = options.name;
      if (options.color !== undefined) input.color = options.color;
      if (options.description !== undefined) {
        input.description = options.description;
      }
      if (options.parentId) input.parentId = options.parentId;
      if (options.isGroup !== undefined) input.isGroup = options.isGroup;

      const payload = await client.updateIssueLabel(id, input);
      const label = await payload.issueLabel;

      if (label) {
        printJson(pick(label, ["id", "name", "color"]));
      }
    }),
  );
