import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { pick, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

interface CreateOptions {
  issueId: string;
  body: string;
}

export const createCommand = new Command()
  .description("Create a comment on an issue.")
  .option("--issue-id <issueId:string>", "Issue ID.", { required: true })
  .option("--body <body:string>", "Comment body.", { required: true })
  .action(
    handleErrors(async (options: CreateOptions) => {
      const client = getClient();
      const payload = await client.createComment({
        issueId: options.issueId,
        body: options.body,
      });
      const comment = await payload.comment;

      if (comment) {
        printJson(pick(comment, ["id", "body", "createdAt", "url"]));
      }
    }),
  );
