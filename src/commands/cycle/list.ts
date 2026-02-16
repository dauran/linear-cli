import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { formatList, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

interface ListOptions {
  first?: number;
  team?: string;
}

const CYCLE_FIELDS = [
  "id",
  "number",
  "name",
  "startsAt",
  "endsAt",
  "progress",
  "scopeCount",
];

export const listCommand = new Command()
  .description("List cycles.")
  .option("--first <count:number>", "Number of cycles to return.")
  .option("--team <teamId:string>", "Filter by team ID.")
  .action(
    handleErrors(async (options: ListOptions) => {
      const client = getClient();

      const filter: Record<string, unknown> = {};
      if (options.team) filter.team = { id: { eq: options.team } };

      const cycles = await client.cycles({
        first: options.first ?? 50,
        filter,
      });

      printJson(formatList(cycles.nodes, CYCLE_FIELDS));
    }),
  );
