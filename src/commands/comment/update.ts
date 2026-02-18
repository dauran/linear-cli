import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { pick, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

interface UpdateOptions {
  body?: string;
  resolved?: boolean;
  unresolved?: boolean;
}

export const updateCommand = new Command()
  .description("Update a comment by ID.")
  .arguments("<id:string>")
  .option("--body <body:string>", "New comment body.")
  .option("--resolved", "Mark comment as resolved.")
  .option("--unresolved", "Mark comment as unresolved.")
  .action(
    handleErrors(async (options: UpdateOptions, id: string) => {
      const client = getClient();

      const input: { body?: string; resolvedAt?: Date | null } = {};
      if (options.body !== undefined) input.body = options.body;
      if (options.resolved) input.resolvedAt = new Date();
      if (options.unresolved) input.resolvedAt = null;

      const payload = await client.updateComment(id, input);
      const comment = await payload.comment;

      if (comment) {
        printJson(pick(comment, ["id", "body", "updatedAt", "url"]));
      }
    }),
  );
