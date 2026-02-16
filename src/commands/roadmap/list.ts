import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { formatList, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

interface ListOptions {
  first?: number;
}

const ROADMAP_FIELDS = [
  "id",
  "name",
  "slug",
  "color",
  "createdAt",
];

export const listCommand = new Command()
  .description("List roadmaps.")
  .option("--first <count:number>", "Number of roadmaps to return.")
  .action(
    handleErrors(async (options: ListOptions) => {
      const client = getClient();
      const roadmaps = await client.roadmaps({
        first: options.first ?? 50,
      });
      printJson(formatList(roadmaps.nodes, ROADMAP_FIELDS));
    }),
  );
