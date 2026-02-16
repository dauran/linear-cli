import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { pick, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

interface CreateOptions {
  url: string;
  resourceTypes: string[];
  label?: string;
  teamId?: string;
  allPublicTeams?: boolean;
  enabled?: boolean;
  secret?: string;
}

export const createCommand = new Command()
  .description("Create a new webhook.")
  .option("--url <url:string>", "Webhook URL.", { required: true })
  .option("--resource-types <resourceTypes...:string>", "Resource types.", {
    required: true,
  })
  .option("--label <label:string>", "Webhook label.")
  .option("--team-id <teamId:string>", "Team ID.")
  .option("--all-public-teams", "Subscribe to all public teams.")
  .option("--enabled <enabled:boolean>", "Enable or disable.")
  .option("--secret <secret:string>", "Signing secret.")
  .action(
    handleErrors(async (options: CreateOptions) => {
      const client = getClient();

      const input: {
        url: string;
        resourceTypes: string[];
        label?: string;
        teamId?: string;
        allPublicTeams?: boolean;
        enabled?: boolean;
        secret?: string;
      } = {
        url: options.url,
        resourceTypes: options.resourceTypes,
      };
      if (options.label !== undefined) input.label = options.label;
      if (options.teamId) input.teamId = options.teamId;
      if (options.allPublicTeams !== undefined) {
        input.allPublicTeams = options.allPublicTeams;
      }
      if (options.enabled !== undefined) input.enabled = options.enabled;
      if (options.secret !== undefined) input.secret = options.secret;

      const payload = await client.createWebhook(input);
      const webhook = await payload.webhook;

      if (webhook) {
        printJson(pick(webhook, ["id", "label", "url", "enabled"]));
      }
    }),
  );
