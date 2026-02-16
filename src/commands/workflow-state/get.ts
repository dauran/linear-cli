import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { pick, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

const STATE_FIELDS = [
  "id",
  "name",
  "type",
  "color",
  "description",
  "position",
  "createdAt",
  "updatedAt",
];

export const getCommand = new Command()
  .description("Get a workflow state by ID.")
  .arguments("<id:string>")
  .action(
    handleErrors(async (_options: void, id: string) => {
      const client = getClient();
      const state = await client.workflowState(id);
      const team = await state.team;

      const data = {
        ...pick(state, STATE_FIELDS),
        team: team ? pick(team, ["id", "name", "key"]) : null,
      };

      printJson(data);
    }),
  );
