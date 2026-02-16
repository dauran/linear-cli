import { Command } from "@cliffy/command";
import { IssueRelationType } from "@linear/sdk";
import { getClient } from "../../client.ts";
import { pick, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

interface CreateOptions {
  issueId: string;
  relatedIssueId: string;
  type: string;
}

export const createCommand = new Command()
  .description("Create a new issue relation.")
  .option("--issue-id <issueId:string>", "Issue ID.", { required: true })
  .option("--related-issue-id <relatedIssueId:string>", "Related issue ID.", {
    required: true,
  })
  .option(
    "--type <type:string>",
    "Relation type (blocks, duplicate, related).",
    { required: true },
  )
  .action(
    handleErrors(async (options: CreateOptions) => {
      const client = getClient();

      const payload = await client.createIssueRelation({
        issueId: options.issueId,
        relatedIssueId: options.relatedIssueId,
        type: options.type as IssueRelationType,
      });
      const relation = await payload.issueRelation;

      if (relation) {
        printJson(pick(relation, ["id", "type"]));
      }
    }),
  );
