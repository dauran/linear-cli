import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { pick, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

interface ListOptions {
  first?: number;
}

const RELATION_FIELDS = ["id", "type", "createdAt"];

export const listCommand = new Command()
  .description("List issue relations.")
  .option("--first <count:number>", "Number of relations to return.")
  .action(
    handleErrors(async (options: ListOptions) => {
      const client = getClient();
      const relations = await client.issueRelations({
        first: options.first ?? 50,
      });

      const results = await Promise.all(
        relations.nodes.map(async (relation) => {
          const issue = await relation.issue;
          const relatedIssue = await relation.relatedIssue;
          return {
            ...pick(relation, RELATION_FIELDS),
            issue: issue ? pick(issue, ["id", "identifier", "title"]) : null,
            relatedIssue: relatedIssue
              ? pick(relatedIssue, ["id", "identifier", "title"])
              : null,
          };
        }),
      );

      printJson(results);
    }),
  );
