import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { formatList, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

interface ListOptions {
  first?: number;
  teamId?: string;
}

const LABEL_FIELDS = ["id", "name", "color", "description"];

export const listCommand = new Command()
  .description("List issue labels.")
  .option("--first <count:number>", "Number of labels to return.")
  .option("--team-id <teamId:string>", "Filter by team ID.")
  .action(
    handleErrors(async (options: ListOptions) => {
      const client = getClient();

      const filter: Record<string, unknown> = {};
      if (options.teamId) filter.team = { id: { eq: options.teamId } };

      const labels = await client.issueLabels({
        first: options.first ?? 50,
        filter,
      });

      printJson(formatList(labels.nodes, LABEL_FIELDS));
    }),
  );
