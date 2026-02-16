import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { pick, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

interface CreateOptions {
  name: string;
  projectId: string;
  description?: string;
  targetDate?: string;
  sortOrder?: number;
}

export const createCommand = new Command()
  .description("Create a new project milestone.")
  .option("--name <name:string>", "Milestone name.", { required: true })
  .option("--project-id <projectId:string>", "Project ID.", { required: true })
  .option("--description <description:string>", "Milestone description.")
  .option("--target-date <targetDate:string>", "Target date (ISO format).")
  .option("--sort-order <sortOrder:number>", "Sort order.")
  .action(
    handleErrors(async (options: CreateOptions) => {
      const client = getClient();

      const input: {
        name: string;
        projectId: string;
        description?: string;
        targetDate?: string;
        sortOrder?: number;
      } = {
        name: options.name,
        projectId: options.projectId,
      };
      if (options.description !== undefined) {
        input.description = options.description;
      }
      if (options.targetDate) input.targetDate = options.targetDate;
      if (options.sortOrder !== undefined) input.sortOrder = options.sortOrder;

      const payload = await client.createProjectMilestone(input);
      const milestone = await payload.projectMilestone;

      if (milestone) {
        printJson(pick(milestone, ["id", "name", "targetDate"]));
      }
    }),
  );
