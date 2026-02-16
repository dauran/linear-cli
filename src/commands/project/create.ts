import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { pick, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

interface CreateOptions {
  name: string;
  teamIds: string[];
  description?: string;
  state?: string;
  leadId?: string;
  startDate?: string;
  targetDate?: string;
}

export const createCommand = new Command()
  .description("Create a new project.")
  .option("--name <name:string>", "Project name.", { required: true })
  .option("--team-ids <teamIds...:string>", "Team IDs.", { required: true })
  .option("--description <description:string>", "Project description.")
  .option("--state <state:string>", "Project state.")
  .option("--lead-id <leadId:string>", "Lead user ID.")
  .option("--start-date <startDate:string>", "Start date (ISO format).")
  .option("--target-date <targetDate:string>", "Target date (ISO format).")
  .action(
    handleErrors(async (options: CreateOptions) => {
      const client = getClient();

      const input: {
        name: string;
        teamIds: string[];
        description?: string;
        state?: string;
        leadId?: string;
        startDate?: string;
        targetDate?: string;
      } = {
        name: options.name,
        teamIds: options.teamIds,
      };
      if (options.description !== undefined) {
        input.description = options.description;
      }
      if (options.state !== undefined) input.state = options.state;
      if (options.leadId) input.leadId = options.leadId;
      if (options.startDate) input.startDate = options.startDate;
      if (options.targetDate) input.targetDate = options.targetDate;

      const payload = await client.createProject(input);
      const project = await payload.project;

      if (project) {
        printJson(pick(project, ["id", "name", "state", "url"]));
      }
    }),
  );
