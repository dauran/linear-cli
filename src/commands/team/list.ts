import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { formatList, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

const TEAM_FIELDS = ["id", "name", "key", "description"];

export const listCommand = new Command()
  .description("List all teams.")
  .action(
    handleErrors(async () => {
      const client = getClient();
      const teams = await client.teams();
      printJson(formatList(teams.nodes, TEAM_FIELDS));
    }),
  );
