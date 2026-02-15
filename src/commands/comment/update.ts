import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { pick, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

interface UpdateOptions {
  body: string;
}

export const updateCommand = new Command()
  .description("Update a comment by ID.")
  .arguments("<id:string>")
  .option("--body <body:string>", "New comment body.", { required: true })
  .action(
    handleErrors(async (options: UpdateOptions, id: string) => {
      const client = getClient();
      const payload = await client.updateComment(id, { body: options.body });
      const comment = await payload.comment;

      if (comment) {
        printJson(pick(comment, ["id", "body", "updatedAt", "url"]));
      }
    }),
  );
