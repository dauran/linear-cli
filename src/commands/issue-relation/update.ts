import { Command } from "@cliffy/command";
import { IssueRelationType } from "@linear/sdk";
import { getClient } from "../../client.ts";
import { pick, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

interface UpdateOptions {
  type: string;
}

export const updateCommand = new Command()
  .description("Update an issue relation by ID.")
  .arguments("<id:string>")
  .option(
    "--type <type:string>",
    "New relation type (blocks, duplicate, related).",
    { required: true },
  )
  .action(
    handleErrors(async (options: UpdateOptions, id: string) => {
      const client = getClient();
      const payload = await client.updateIssueRelation(id, {
        type: options.type as IssueRelationType,
      });
      const relation = await payload.issueRelation;

      if (relation) {
        printJson(pick(relation, ["id", "type"]));
      }
    }),
  );
