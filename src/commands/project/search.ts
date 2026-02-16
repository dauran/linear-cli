import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { pick, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

interface SearchOptions {
  first?: number;
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

export const searchCommand = new Command()
  .description("Search projects by term.")
  .arguments("<term:string>")
  .option("--first <count:number>", "Number of results to return.")
  .action(
    handleErrors(async (options: SearchOptions, term: string) => {
      const client = getClient();
      const results = await client.searchProjects(term, {
        first: options.first ?? 50,
      });

      const items = await Promise.all(
        results.nodes.map(async (project) => {
          const lead = await project.lead;
          return {
            ...pick(project, PROJECT_FIELDS),
            lead: lead ? pick(lead, ["id", "name"]) : null,
          };
        }),
      );

      printJson(items);
    }),
  );
