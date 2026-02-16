import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { pick, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

interface CreateOptions {
  teamId: string;
  startsAt: string;
  endsAt: string;
  name?: string;
  description?: string;
}

export const createCommand = new Command()
  .description("Create a new cycle.")
  .option("--team-id <teamId:string>", "Team ID.", { required: true })
  .option("--starts-at <startsAt:string>", "Start date (ISO format).", {
    required: true,
  })
  .option("--ends-at <endsAt:string>", "End date (ISO format).", {
    required: true,
  })
  .option("--name <name:string>", "Cycle name.")
  .option("--description <description:string>", "Cycle description.")
  .action(
    handleErrors(async (options: CreateOptions) => {
      const client = getClient();

      const input: {
        teamId: string;
        startsAt: Date;
        endsAt: Date;
        name?: string;
        description?: string;
      } = {
        teamId: options.teamId,
        startsAt: new Date(options.startsAt),
        endsAt: new Date(options.endsAt),
      };
      if (options.name !== undefined) input.name = options.name;
      if (options.description !== undefined) {
        input.description = options.description;
      }

      const payload = await client.createCycle(input);
      const cycle = await payload.cycle;

      if (cycle) {
        printJson(pick(cycle, ["id", "number", "name", "startsAt", "endsAt"]));
      }
    }),
  );
