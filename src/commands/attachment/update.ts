import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { pick, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

interface UpdateOptions {
  title?: string;
  subtitle?: string;
  url?: string;
}

export const updateCommand = new Command()
  .description("Update an attachment by ID.")
  .arguments("<id:string>")
  .option("--title <title:string>", "New title.")
  .option("--subtitle <subtitle:string>", "New subtitle.")
  .option("--url <url:string>", "New URL.")
  .action(
    handleErrors(async (options: UpdateOptions, id: string) => {
      const client = getClient();

      // deno-lint-ignore no-explicit-any
      const input: Record<string, any> = {};
      if (options.title !== undefined) input.title = options.title;
      if (options.subtitle !== undefined) input.subtitle = options.subtitle;
      if (options.url !== undefined) input.url = options.url;

      const payload = await client.updateAttachment(
        id,
        input as { title: string; subtitle?: string; url?: string },
      );
      const attachment = await payload.attachment;

      if (attachment) {
        printJson(pick(attachment, ["id", "title", "url"]));
      }
    }),
  );
