import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { pick, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

const ATTACHMENT_FIELDS = [
  "id",
  "title",
  "subtitle",
  "url",
  "createdAt",
  "updatedAt",
];

export const getCommand = new Command()
  .description("Get an attachment by ID.")
  .arguments("<id:string>")
  .action(
    handleErrors(async (_options: void, id: string) => {
      const client = getClient();
      const attachment = await client.attachment(id);
      const issue = await attachment.issue;

      const data = {
        ...pick(attachment, ATTACHMENT_FIELDS),
        issue: issue
          ? pick(issue, ["id", "identifier", "title"])
          : null,
      };

      printJson(data);
    }),
  );
