import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { pick, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

const LABEL_FIELDS = [
  "id",
  "name",
  "color",
  "description",
  "createdAt",
  "updatedAt",
];

export const getCommand = new Command()
  .description("Get an issue label by ID.")
  .arguments("<id:string>")
  .action(
    handleErrors(async (_options: void, id: string) => {
      const client = getClient();
      const label = await client.issueLabel(id);
      const team = await label.team;
      const parent = await label.parent;

      const data = {
        ...pick(label, LABEL_FIELDS),
        team: team ? pick(team, ["id", "name", "key"]) : null,
        parent: parent ? pick(parent, ["id", "name"]) : null,
      };

      printJson(data);
    }),
  );
