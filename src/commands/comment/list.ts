import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { pick, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

interface ListOptions {
  issueId?: string;
  first?: number;
}

const COMMENT_FIELDS = [
  "id",
  "parentId",
  "body",
  "createdAt",
  "updatedAt",
  "resolvedAt",
];

export const listCommand = new Command()
  .description("List comments for an issue.")
  .option("--issue-id <issueId:string>", "Issue ID.")
  .option("--first <count:number>", "Number of comments to return.")
  .action(
    handleErrors(async (options: ListOptions) => {
      const client = getClient();

      if (options.issueId) {
        const issue = await client.issue(options.issueId);
        const comments = await issue.comments({
          first: options.first ?? 50,
        });

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
      } else {
        const comments = await client.comments({
          first: options.first ?? 50,
        });

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
      }
    }),
  );
