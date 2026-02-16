import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { formatList, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

interface ListOptions {
  first?: number;
}

const NOTIFICATION_FIELDS = [
  "id",
  "type",
  "readAt",
  "snoozedUntilAt",
  "archivedAt",
  "createdAt",
];

export const listCommand = new Command()
  .description("List notifications.")
  .option("--first <count:number>", "Number of notifications to return.")
  .action(
    handleErrors(async (options: ListOptions) => {
      const client = getClient();
      const notifications = await client.notifications({
        first: options.first ?? 50,
      });
      printJson(formatList(notifications.nodes, NOTIFICATION_FIELDS));
    }),
  );
