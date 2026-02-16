import { Command } from "@cliffy/command";
import { InitiativeStatus } from "@linear/sdk";
import { getClient } from "../../client.ts";
import { pick, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

interface UpdateOptions {
  name?: string;
  description?: string;
  status?: string;
  color?: string;
  icon?: string;
}

export const updateCommand = new Command()
  .description("Update an initiative by ID.")
  .arguments("<id:string>")
  .option("--name <name:string>", "New name.")
  .option("--description <description:string>", "New description.")
  .option("--status <status:string>", "New status.")
  .option("--color <color:string>", "New color.")
  .option("--icon <icon:string>", "New icon.")
  .action(
    handleErrors(async (options: UpdateOptions, id: string) => {
      const client = getClient();

      // deno-lint-ignore no-explicit-any
      const input: Record<string, any> = {};
      if (options.name !== undefined) input.name = options.name;
      if (options.description !== undefined) {
        input.description = options.description;
      }
      if (options.status !== undefined) {
        input.status = options.status as InitiativeStatus;
      }
      if (options.color !== undefined) input.color = options.color;
      if (options.icon !== undefined) input.icon = options.icon;

      const payload = await client.updateInitiative(id, input);
      const initiative = await payload.initiative;

      if (initiative) {
        printJson(pick(initiative, ["id", "name", "status"]));
      }
    }),
  );
