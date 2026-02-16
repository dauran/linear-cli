import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { pick, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

interface UpdateOptions {
  name?: string;
  description?: string;
  state?: string;
  leadId?: string;
  startDate?: string;
  targetDate?: string;
}

export const updateCommand = new Command()
  .description("Update a project by ID.")
  .arguments("<id:string>")
  .option("--name <name:string>", "New name.")
  .option("--description <description:string>", "New description.")
  .option("--state <state:string>", "New state.")
  .option("--lead-id <leadId:string>", "New lead user ID.")
  .option("--start-date <startDate:string>", "New start date (ISO format).")
  .option("--target-date <targetDate:string>", "New target date (ISO format).")
  .action(
    handleErrors(async (options: UpdateOptions, id: string) => {
      const client = getClient();

      const input: {
        name?: string;
        description?: string;
        state?: string;
        leadId?: string;
        startDate?: string;
        targetDate?: string;
      } = {};
      if (options.name !== undefined) input.name = options.name;
      if (options.description !== undefined) {
        input.description = options.description;
      }
      if (options.state !== undefined) input.state = options.state;
      if (options.leadId) input.leadId = options.leadId;
      if (options.startDate) input.startDate = options.startDate;
      if (options.targetDate) input.targetDate = options.targetDate;

      const payload = await client.updateProject(id, input);
      const project = await payload.project;

      if (project) {
        printJson(pick(project, ["id", "name", "state", "url"]));
      }
    }),
  );
