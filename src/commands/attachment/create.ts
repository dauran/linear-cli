import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { pick, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

interface CreateOptions {
  issueId: string;
  url: string;
  title: string;
  subtitle?: string;
}

export const createCommand = new Command()
  .description("Create a new attachment.")
  .option("--issue-id <issueId:string>", "Issue ID.", { required: true })
  .option("--url <url:string>", "Attachment URL.", { required: true })
  .option("--title <title:string>", "Attachment title.", { required: true })
  .option("--subtitle <subtitle:string>", "Attachment subtitle.")
  .action(
    handleErrors(async (options: CreateOptions) => {
      const client = getClient();

      const input: {
        issueId: string;
        url: string;
        title: string;
        subtitle?: string;
      } = {
        issueId: options.issueId,
        url: options.url,
        title: options.title,
      };
      if (options.subtitle !== undefined) input.subtitle = options.subtitle;

      const payload = await client.createAttachment(input);
      const attachment = await payload.attachment;

      if (attachment) {
        printJson(pick(attachment, ["id", "title", "url"]));
      }
    }),
  );
