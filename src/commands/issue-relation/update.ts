import { Command } from "@cliffy/command";
import { IssueRelationType } from "@linear/sdk";
import { getClient } from "../../client.ts";
import { pick, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

interface UpdateOptions {
  type?: string;
  issueId?: string;
  relatedIssueId?: string;
}

export const updateCommand = new Command()
  .description("Update an issue relation by ID.")
  .arguments("<id:string>")
  .option(
    "--type <type:string>",
    "Relation type (blocks, duplicate, related).",
  )
  .option("--issue-id <issueId:string>", "Source issue ID.")
  .option("--related-issue-id <relatedIssueId:string>", "Related issue ID.")
  .action(
    handleErrors(async (options: UpdateOptions, id: string) => {
      const client = getClient();

      // deno-lint-ignore no-explicit-any
      const input: Record<string, any> = {};
      if (options.type !== undefined) {
        input.type = options.type as IssueRelationType;
      }
      if (options.issueId) input.issueId = options.issueId;
      if (options.relatedIssueId) {
        input.relatedIssueId = options.relatedIssueId;
      }

      const payload = await client.updateIssueRelation(id, input);
      const relation = await payload.issueRelation;

      if (relation) {
        printJson(pick(relation, ["id", "type"]));
      }
    }),
  );
