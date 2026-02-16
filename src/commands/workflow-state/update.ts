import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { pick, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

interface UpdateOptions {
  name?: string;
  color?: string;
  description?: string;
  position?: number;
}

export const updateCommand = new Command()
  .description("Update a workflow state by ID.")
  .arguments("<id:string>")
  .option("--name <name:string>", "New name.")
  .option("--color <color:string>", "New color.")
  .option("--description <description:string>", "New description.")
  .option("--position <position:number>", "New position.")
  .action(
    handleErrors(async (options: UpdateOptions, id: string) => {
      const client = getClient();

      const input: {
        name?: string;
        color?: string;
        description?: string;
        position?: number;
      } = {};
      if (options.name !== undefined) input.name = options.name;
      if (options.color !== undefined) input.color = options.color;
      if (options.description !== undefined) {
        input.description = options.description;
      }
      if (options.position !== undefined) input.position = options.position;

      const payload = await client.updateWorkflowState(id, input);
      const state = await payload.workflowState;

      if (state) {
        printJson(pick(state, ["id", "name", "type", "color"]));
      }
    }),
  );
