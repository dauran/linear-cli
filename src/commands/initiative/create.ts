import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { pick, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

interface CreateOptions {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
}

export const createCommand = new Command()
  .description("Create a new initiative.")
  .option("--name <name:string>", "Initiative name.", { required: true })
  .option("--description <description:string>", "Initiative description.")
  .option("--color <color:string>", "Initiative color.")
  .option("--icon <icon:string>", "Initiative icon.")
  .action(
    handleErrors(async (options: CreateOptions) => {
      const client = getClient();

      const input: {
        name: string;
        description?: string;
        color?: string;
        icon?: string;
      } = {
        name: options.name,
      };
      if (options.description !== undefined) {
        input.description = options.description;
      }
      if (options.color !== undefined) input.color = options.color;
      if (options.icon !== undefined) input.icon = options.icon;

      const payload = await client.createInitiative(input);
      const initiative = await payload.initiative;

      if (initiative) {
        printJson(pick(initiative, ["id", "name", "status"]));
      }
    }),
  );
