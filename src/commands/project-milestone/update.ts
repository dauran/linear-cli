import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { pick, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

interface UpdateOptions {
  name?: string;
  description?: string;
  targetDate?: string;
  sortOrder?: number;
  projectId?: string;
}

export const updateCommand = new Command()
  .description("Update a project milestone by ID.")
  .arguments("<id:string>")
  .option("--name <name:string>", "New name.")
  .option("--description <description:string>", "New description.")
  .option("--target-date <targetDate:string>", "New target date (ISO format).")
  .option("--sort-order <sortOrder:number>", "New sort order.")
  .option("--project-id <projectId:string>", "Move to another project.")
  .action(
    handleErrors(async (options: UpdateOptions, id: string) => {
      const client = getClient();

      const input: {
        name?: string;
        description?: string;
        targetDate?: string;
        sortOrder?: number;
        projectId?: string;
      } = {};
      if (options.name !== undefined) input.name = options.name;
      if (options.description !== undefined) {
        input.description = options.description;
      }
      if (options.targetDate) input.targetDate = options.targetDate;
      if (options.sortOrder !== undefined) input.sortOrder = options.sortOrder;
      if (options.projectId) input.projectId = options.projectId;

      const payload = await client.updateProjectMilestone(id, input);
      const milestone = await payload.projectMilestone;

      if (milestone) {
        printJson(pick(milestone, ["id", "name", "targetDate"]));
      }
    }),
  );
