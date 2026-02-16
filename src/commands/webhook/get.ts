import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { pick, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

const WEBHOOK_FIELDS = [
  "id",
  "label",
  "url",
  "enabled",
  "resourceTypes",
  "allPublicTeams",
  "createdAt",
  "updatedAt",
];

export const getCommand = new Command()
  .description("Get a webhook by ID.")
  .arguments("<id:string>")
  .action(
    handleErrors(async (_options: void, id: string) => {
      const client = getClient();
      const webhook = await client.webhook(id);
      const team = await webhook.team;

      const data = {
        ...pick(webhook, WEBHOOK_FIELDS),
        team: team ? pick(team, ["id", "name", "key"]) : null,
      };

      printJson(data);
    }),
  );
