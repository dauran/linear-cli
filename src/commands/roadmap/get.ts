import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { pick, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

const ROADMAP_FIELDS = [
  "id",
  "name",
  "description",
  "slug",
  "color",
  "url",
  "createdAt",
  "updatedAt",
];

export const getCommand = new Command()
  .description("Get a roadmap by ID.")
  .arguments("<id:string>")
  .action(
    handleErrors(async (_options: void, id: string) => {
      const client = getClient();
      const roadmap = await client.roadmap(id);
      const creator = await roadmap.creator;

      const data = {
        ...pick(roadmap, ROADMAP_FIELDS),
        creator: creator ? pick(creator, ["id", "name"]) : null,
      };

      printJson(data);
    }),
  );
