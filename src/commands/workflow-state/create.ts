import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { pick, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

interface CreateOptions {
  name: string;
  teamId: string;
  type: string;
  color: string;
  description?: string;
  position?: number;
}

export const createCommand = new Command()
  .description("Create a new workflow state.")
  .option("--name <name:string>", "State name.", { required: true })
  .option("--team-id <teamId:string>", "Team ID.", { required: true })
  .option(
    "--type <type:string>",
    "State type (backlog, unstarted, started, completed, cancelled).",
    {
      required: true,
    },
  )
  .option("--color <color:string>", "State color.", { required: true })
  .option("--description <description:string>", "State description.")
  .option("--position <position:number>", "State position.")
  .action(
    handleErrors(async (options: CreateOptions) => {
      const client = getClient();

      const input: {
        name: string;
        teamId: string;
        type: string;
        color: string;
        description?: string;
        position?: number;
      } = {
        name: options.name,
        teamId: options.teamId,
        type: options.type,
        color: options.color,
      };
      if (options.description !== undefined) {
        input.description = options.description;
      }
      if (options.position !== undefined) input.position = options.position;

      const payload = await client.createWorkflowState(input);
      const state = await payload.workflowState;

      if (state) {
        printJson(pick(state, ["id", "name", "type", "color"]));
      }
    }),
  );
