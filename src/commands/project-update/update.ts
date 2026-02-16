import { Command } from "@cliffy/command";
import { ProjectUpdateHealthType } from "@linear/sdk";
import { getClient } from "../../client.ts";
import { pick, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

interface UpdateOptions {
  body?: string;
  health?: string;
}

export const updateCommand = new Command()
  .description("Update a project update by ID.")
  .arguments("<id:string>")
  .option("--body <body:string>", "New body.")
  .option(
    "--health <health:string>",
    "New health status (onTrack, atRisk, offTrack).",
  )
  .action(
    handleErrors(async (options: UpdateOptions, id: string) => {
      const client = getClient();

      // deno-lint-ignore no-explicit-any
      const input: Record<string, any> = {};
      if (options.body !== undefined) input.body = options.body;
      if (options.health !== undefined) {
        input.health = options.health as ProjectUpdateHealthType;
      }

      const payload = await client.updateProjectUpdate(id, input);
      const update = await payload.projectUpdate;

      if (update) {
        printJson(pick(update, ["id", "body", "health", "url"]));
      }
    }),
  );
