import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { formatList, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

interface ListOptions {
  first?: number;
}

const WEBHOOK_FIELDS = [
  "id",
  "label",
  "url",
  "enabled",
  "resourceTypes",
  "createdAt",
];

export const listCommand = new Command()
  .description("List webhooks.")
  .option("--first <count:number>", "Number of webhooks to return.")
  .action(
    handleErrors(async (options: ListOptions) => {
      const client = getClient();
      const webhooks = await client.webhooks({
        first: options.first ?? 50,
      });
      printJson(formatList(webhooks.nodes, WEBHOOK_FIELDS));
    }),
  );
