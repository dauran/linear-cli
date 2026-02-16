import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { pick, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

interface ListOptions {
  first?: number;
  team?: string;
  state?: string;
}

const PROJECT_FIELDS = [
  "id",
  "name",
  "state",
  "progress",
  "url",
  "startDate",
  "targetDate",
  "createdAt",
];

export const listCommand = new Command()
  .description("List projects.")
  .option("--first <count:number>", "Number of projects to return.")
  .option("--team <teamId:string>", "Filter by team ID.")
  .option("--state <state:string>", "Filter by project state.")
  .action(
    handleErrors(async (options: ListOptions) => {
      const client = getClient();

      const filter: Record<string, unknown> = {};
      if (options.state) filter.state = { eq: options.state };

      const args: Record<string, unknown> = {
        first: options.first ?? 50,
        filter,
      };

      const projects = await client.projects(args);

      const results = await Promise.all(
        projects.nodes.map(async (project) => {
          const lead = await project.lead;
          return {
            ...pick(project, PROJECT_FIELDS),
            lead: lead ? pick(lead, ["id", "name"]) : null,
          };
        }),
      );

      printJson(results);
    }),
  );
