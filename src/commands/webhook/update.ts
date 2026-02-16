import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { pick, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

interface UpdateOptions {
  url?: string;
  label?: string;
  enabled?: boolean;
  resourceTypes?: string[];
}

export const updateCommand = new Command()
  .description("Update a webhook by ID.")
  .arguments("<id:string>")
  .option("--url <url:string>", "New URL.")
  .option("--label <label:string>", "New label.")
  .option("--enabled <enabled:boolean>", "Enable or disable.")
  .option("--resource-types <resourceTypes...:string>", "New resource types.")
  .action(
    handleErrors(async (options: UpdateOptions, id: string) => {
      const client = getClient();

      const input: {
        url?: string;
        label?: string;
        enabled?: boolean;
        resourceTypes?: string[];
      } = {};
      if (options.url !== undefined) input.url = options.url;
      if (options.label !== undefined) input.label = options.label;
      if (options.enabled !== undefined) input.enabled = options.enabled;
      if (options.resourceTypes) input.resourceTypes = options.resourceTypes;

      const payload = await client.updateWebhook(id, input);
      const webhook = await payload.webhook;

      if (webhook) {
        printJson(pick(webhook, ["id", "label", "url", "enabled"]));
      }
    }),
  );
