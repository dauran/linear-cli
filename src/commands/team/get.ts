import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { pick, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

const TEAM_FIELDS = [
  "id",
  "name",
  "key",
  "description",
  "private",
  "timezone",
];

export const getCommand = new Command()
  .description("Get a team by ID.")
  .arguments("<id:string>")
  .action(
    handleErrors(async (_options: void, id: string) => {
      const client = getClient();
      const team = await client.team(id);
      printJson(pick(team, TEAM_FIELDS));
    }),
  );
