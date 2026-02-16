import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { pick, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

interface UpdateOptions {
  name?: string;
  description?: string;
  startsAt?: string;
  endsAt?: string;
}

export const updateCommand = new Command()
  .description("Update a cycle by ID.")
  .arguments("<id:string>")
  .option("--name <name:string>", "New name.")
  .option("--description <description:string>", "New description.")
  .option("--starts-at <startsAt:string>", "New start date (ISO format).")
  .option("--ends-at <endsAt:string>", "New end date (ISO format).")
  .action(
    handleErrors(async (options: UpdateOptions, id: string) => {
      const client = getClient();

      const input: {
        name?: string;
        description?: string;
        startsAt?: Date;
        endsAt?: Date;
      } = {};
      if (options.name !== undefined) input.name = options.name;
      if (options.description !== undefined) {
        input.description = options.description;
      }
      if (options.startsAt) input.startsAt = new Date(options.startsAt);
      if (options.endsAt) input.endsAt = new Date(options.endsAt);

      const payload = await client.updateCycle(id, input);
      const cycle = await payload.cycle;

      if (cycle) {
        printJson(pick(cycle, ["id", "number", "name", "startsAt", "endsAt"]));
      }
    }),
  );
