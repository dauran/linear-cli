import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { pick, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

interface CreateOptions {
  name: string;
  description?: string;
  color?: string;
  ownerId?: string;
  sortOrder?: number;
}

export const createCommand = new Command()
  .description("Create a new roadmap.")
  .option("--name <name:string>", "Roadmap name.", { required: true })
  .option("--description <description:string>", "Roadmap description.")
  .option("--color <color:string>", "Roadmap color.")
  .option("--owner-id <ownerId:string>", "Owner user ID.")
  .option("--sort-order <sortOrder:number>", "Sort order.")
  .action(
    handleErrors(async (options: CreateOptions) => {
      const client = getClient();

      const input: {
        name: string;
        description?: string;
        color?: string;
        ownerId?: string;
        sortOrder?: number;
      } = {
        name: options.name,
      };
      if (options.description !== undefined) {
        input.description = options.description;
      }
      if (options.color !== undefined) input.color = options.color;
      if (options.ownerId) input.ownerId = options.ownerId;
      if (options.sortOrder !== undefined) input.sortOrder = options.sortOrder;

      const payload = await client.createRoadmap(input);
      const roadmap = await payload.roadmap;

      if (roadmap) {
        printJson(pick(roadmap, ["id", "name", "slug"]));
      }
    }),
  );
