import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { pick, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

const RELATION_FIELDS = ["id", "type", "createdAt", "updatedAt"];

export const getCommand = new Command()
  .description("Get an issue relation by ID.")
  .arguments("<id:string>")
  .action(
    handleErrors(async (_options: void, id: string) => {
      const client = getClient();
      const relation = await client.issueRelation(id);
      const issue = await relation.issue;
      const relatedIssue = await relation.relatedIssue;

      const data = {
        ...pick(relation, RELATION_FIELDS),
        issue: issue ? pick(issue, ["id", "identifier", "title"]) : null,
        relatedIssue: relatedIssue
          ? pick(relatedIssue, ["id", "identifier", "title"])
          : null,
      };

      printJson(data);
    }),
  );
