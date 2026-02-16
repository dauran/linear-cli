import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { formatList, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

interface ListOptions {
  first?: number;
}

const ATTACHMENT_FIELDS = [
  "id",
  "title",
  "subtitle",
  "url",
  "createdAt",
];

export const listCommand = new Command()
  .description("List attachments.")
  .option("--first <count:number>", "Number of attachments to return.")
  .action(
    handleErrors(async (options: ListOptions) => {
      const client = getClient();
      const attachments = await client.attachments({
        first: options.first ?? 50,
      });
      printJson(formatList(attachments.nodes, ATTACHMENT_FIELDS));
    }),
  );
