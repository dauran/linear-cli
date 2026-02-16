import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { pick, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

interface SearchOptions {
  first?: number;
}

const ISSUE_FIELDS = [
  "id",
  "identifier",
  "title",
  "priority",
  "priorityLabel",
  "url",
  "createdAt",
];

export const searchCommand = new Command()
  .description("Search issues by term.")
  .arguments("<term:string>")
  .option("--first <count:number>", "Number of results to return.")
  .action(
    handleErrors(async (options: SearchOptions, term: string) => {
      const client = getClient();
      const results = await client.searchIssues(term, {
        first: options.first ?? 50,
      });

      const items = await Promise.all(
        results.nodes.map(async (issue) => {
          const state = await issue.state;
          const assignee = await issue.assignee;
          return {
            ...pick(issue, ISSUE_FIELDS),
            state: state ? pick(state, ["id", "name"]) : null,
            assignee: assignee ? pick(assignee, ["id", "name"]) : null,
          };
        }),
      );

      printJson(items);
    }),
  );
