import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { pick, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

interface ListOptions {
  issueId: string;
}

const COMMENT_FIELDS = ["id", "body", "createdAt", "updatedAt"];

export const listCommand = new Command()
  .description("List comments for an issue.")
  .option("--issue-id <issueId:string>", "Issue ID.", { required: true })
  .action(
    handleErrors(async (options: ListOptions) => {
      const client = getClient();
      const issue = await client.issue(options.issueId);
      const comments = await issue.comments();

      const results = await Promise.all(
        comments.nodes.map(async (comment) => {
          const user = await comment.user;
          return {
            ...pick(comment, COMMENT_FIELDS),
            user: user ? pick(user, ["id", "name"]) : null,
          };
        }),
      );

      printJson(results);
    }),
  );
