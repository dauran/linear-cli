import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { pick, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

interface ListOptions {
  first?: number;
  team?: string;
  assignee?: string;
  state?: string;
  cycle?: string;
  project?: string;
  label?: string;
  priority?: number;
  parent?: string;
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

export const listCommand = new Command()
  .description("List issues.")
  .option("--first <count:number>", "Number of issues to return.")
  .option("--team <teamId:string>", "Filter by team ID.")
  .option("--assignee <userId:string>", "Filter by assignee ID.")
  .option("--state <stateId:string>", "Filter by state ID.")
  .option("--cycle <cycleId:string>", "Filter by cycle ID.")
  .option("--project <projectId:string>", "Filter by project ID.")
  .option("--label <labelId:string>", "Filter by label ID.")
  .option("--priority <priority:number>", "Filter by priority (0-4).")
  .option(
    "--parent <issueId:string>",
    "Filter by parent issue ID (sub-issues).",
  )
  .action(
    handleErrors(async (options: ListOptions) => {
      const client = getClient();

      const filter: Record<string, unknown> = {};
      if (options.team) filter.team = { id: { eq: options.team } };
      if (options.assignee) {
        filter.assignee = { id: { eq: options.assignee } };
      }
      if (options.state) filter.state = { id: { eq: options.state } };
      if (options.cycle) filter.cycle = { id: { eq: options.cycle } };
      if (options.project) filter.project = { id: { eq: options.project } };
      if (options.label) filter.labels = { id: { eq: options.label } };
      if (options.priority !== undefined) {
        filter.priority = { eq: options.priority };
      }
      if (options.parent) filter.parent = { id: { eq: options.parent } };

      const issues = await client.issues({
        first: options.first ?? 50,
        filter,
      });

      const results = await Promise.all(
        issues.nodes.map(async (issue) => {
          const state = await issue.state;
          const assignee = await issue.assignee;
          return {
            ...pick(issue, ISSUE_FIELDS),
            state: state ? pick(state, ["id", "name"]) : null,
            assignee: assignee ? pick(assignee, ["id", "name"]) : null,
          };
        }),
      );

      printJson(results);
    }),
  );
