import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { pick, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

interface UpdateOptions {
  name?: string;
  description?: string;
  color?: string;
}

export const updateCommand = new Command()
  .description("Update a roadmap by ID.")
  .arguments("<id:string>")
  .option("--name <name:string>", "New name.")
  .option("--description <description:string>", "New description.")
  .option("--color <color:string>", "New color.")
  .action(
    handleErrors(async (options: UpdateOptions, id: string) => {
      const client = getClient();

      const input: {
        name?: string;
        description?: string;
        color?: string;
      } = {};
      if (options.name !== undefined) input.name = options.name;
      if (options.description !== undefined) {
        input.description = options.description;
      }
      if (options.color !== undefined) input.color = options.color;

      const payload = await client.updateRoadmap(id, input);
      const roadmap = await payload.roadmap;

      if (roadmap) {
        printJson(pick(roadmap, ["id", "name", "slug"]));
      }
    }),
  );
