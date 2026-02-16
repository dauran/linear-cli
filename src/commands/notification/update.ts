import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

interface UpdateOptions {
  readAt?: string;
  snoozedUntilAt?: string;
}

export const updateCommand = new Command()
  .description("Update a notification by ID.")
  .arguments("<id:string>")
  .option("--read-at <readAt:string>", "Read at timestamp (ISO format).")
  .option(
    "--snoozed-until-at <snoozedUntilAt:string>",
    "Snoozed until timestamp (ISO format).",
  )
  .action(
    handleErrors(async (options: UpdateOptions, id: string) => {
      const client = getClient();

      const input: {
        readAt?: Date;
        snoozedUntilAt?: Date;
      } = {};
      if (options.readAt) input.readAt = new Date(options.readAt);
      if (options.snoozedUntilAt) {
        input.snoozedUntilAt = new Date(options.snoozedUntilAt);
      }

      const payload = await client.updateNotification(id, input);
      printJson({ success: payload.success, id });
    }),
  );
