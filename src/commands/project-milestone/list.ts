import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { pick, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

interface ListOptions {
  first?: number;
  project?: string;
}

const MILESTONE_FIELDS = [
  "id",
  "name",
  "targetDate",
  "sortOrder",
  "createdAt",
];

export const listCommand = new Command()
  .description("List project milestones.")
  .option("--first <count:number>", "Number of milestones to return.")
  .option("--project <projectId:string>", "Filter by project ID.")
  .action(
    handleErrors(async (options: ListOptions) => {
      const client = getClient();

      const filter: Record<string, unknown> = {};
      if (options.project) filter.project = { id: { eq: options.project } };

      const milestones = await client.projectMilestones({
        first: options.first ?? 50,
        filter,
      });

      const results = milestones.nodes.map((milestone) =>
        pick(milestone, MILESTONE_FIELDS)
      );

      printJson(results);
    }),
  );
