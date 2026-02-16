import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { pick, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

const CYCLE_FIELDS = [
  "id",
  "number",
  "name",
  "description",
  "startsAt",
  "endsAt",
  "completedAt",
  "progress",
  "scopeCount",
  "url",
  "createdAt",
  "updatedAt",
];

export const getCommand = new Command()
  .description("Get a cycle by ID.")
  .arguments("<id:string>")
  .action(
    handleErrors(async (_options: void, id: string) => {
      const client = getClient();
      const cycle = await client.cycle(id);
      const team = await cycle.team;

      const data = {
        ...pick(cycle, CYCLE_FIELDS),
        team: team ? pick(team, ["id", "name", "key"]) : null,
      };

      printJson(data);
    }),
  );
