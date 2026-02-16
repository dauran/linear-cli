import { Command } from "@cliffy/command";
import { ProjectUpdateHealthType } from "@linear/sdk";
import { getClient } from "../../client.ts";
import { pick, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

interface CreateOptions {
  projectId: string;
  body: string;
  health?: string;
}

export const createCommand = new Command()
  .description("Create a new project update.")
  .option("--project-id <projectId:string>", "Project ID.", { required: true })
  .option("--body <body:string>", "Update body.", { required: true })
  .option(
    "--health <health:string>",
    "Health status (onTrack, atRisk, offTrack).",
  )
  .action(
    handleErrors(async (options: CreateOptions) => {
      const client = getClient();

      const input: {
        projectId: string;
        body: string;
        health?: ProjectUpdateHealthType;
      } = {
        projectId: options.projectId,
        body: options.body,
      };
      if (options.health !== undefined) {
        input.health = options.health as ProjectUpdateHealthType;
      }

      const payload = await client.createProjectUpdate(input);
      const update = await payload.projectUpdate;

      if (update) {
        printJson(pick(update, ["id", "body", "health", "url"]));
      }
    }),
  );
