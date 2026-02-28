import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

export const resolveCommand = new Command()
  .description("Resolve a comment by ID.")
  .arguments("<id:string>")
  .action(
    handleErrors(async (_options: void, id: string) => {
      const client = getClient();

      const payload = await client.commentResolve(id);
      const comment = await payload.comment;

      if (comment) {
        printJson({
          id: comment.id,
          resolved: true,
          url: comment.url,
        });
      }
    }),
  );
