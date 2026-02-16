import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { pick, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

const INITIATIVE_FIELDS = [
  "id",
  "name",
  "description",
  "status",
  "color",
  "icon",
  "url",
  "createdAt",
  "updatedAt",
];

export const getCommand = new Command()
  .description("Get an initiative by ID.")
  .arguments("<id:string>")
  .action(
    handleErrors(async (_options: void, id: string) => {
      const client = getClient();
      const initiative = await client.initiative(id);
      const creator = await initiative.creator;

      const data = {
        ...pick(initiative, INITIATIVE_FIELDS),
        creator: creator ? pick(creator, ["id", "name"]) : null,
      };

      printJson(data);
    }),
  );
