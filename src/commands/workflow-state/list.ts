import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { formatList, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

interface ListOptions {
  first?: number;
  team?: string;
  type?: string;
}

const STATE_FIELDS = ["id", "name", "type", "color", "position"];

export const listCommand = new Command()
  .description("List workflow states.")
  .option("--first <count:number>", "Number of states to return.")
  .option("--team <teamId:string>", "Filter by team ID.")
  .option("--type <type:string>", "Filter by state type.")
  .action(
    handleErrors(async (options: ListOptions) => {
      const client = getClient();

      const filter: Record<string, unknown> = {};
      if (options.team) filter.team = { id: { eq: options.team } };
      if (options.type) filter.type = { eq: options.type };

      const states = await client.workflowStates({
        first: options.first ?? 50,
        filter,
      });

      printJson(formatList(states.nodes, STATE_FIELDS));
    }),
  );
