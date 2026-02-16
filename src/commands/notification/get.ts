import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { pick, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

const NOTIFICATION_FIELDS = [
  "id",
  "type",
  "readAt",
  "snoozedUntilAt",
  "archivedAt",
  "createdAt",
  "updatedAt",
];

export const getCommand = new Command()
  .description("Get a notification by ID.")
  .arguments("<id:string>")
  .action(
    handleErrors(async (_options: void, id: string) => {
      const client = getClient();
      const notification = await client.notification(id);
      printJson(pick(notification, NOTIFICATION_FIELDS));
    }),
  );
