import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { formatList, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

interface ListOptions {
  first?: number;
}

const INITIATIVE_FIELDS = [
  "id",
  "name",
  "status",
  "color",
  "icon",
  "createdAt",
];

export const listCommand = new Command()
  .description("List initiatives.")
  .option("--first <count:number>", "Number of initiatives to return.")
  .action(
    handleErrors(async (options: ListOptions) => {
      const client = getClient();
      const initiatives = await client.initiatives({
        first: options.first ?? 50,
      });
      printJson(formatList(initiatives.nodes, INITIATIVE_FIELDS));
    }),
  );
