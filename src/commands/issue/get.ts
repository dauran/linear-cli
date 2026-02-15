import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { pick, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

const ISSUE_FIELDS = [
  "id",
  "identifier",
  "title",
  "description",
  "priority",
  "priorityLabel",
  "url",
  "createdAt",
  "updatedAt",
];

export const getCommand = new Command()
  .description("Get an issue by ID.")
  .arguments("<id:string>")
  .action(
    handleErrors(async (_options: void, id: string) => {
      const client = getClient();
      const issue = await client.issue(id);
      const state = await issue.state;
      const assignee = await issue.assignee;
      const team = await issue.team;

      const data = {
        ...pick(issue, ISSUE_FIELDS),
        state: state ? pick(state, ["id", "name", "type"]) : null,
        assignee: assignee
          ? pick(assignee, ["id", "name", "email"])
          : null,
        team: team ? pick(team, ["id", "name", "key"]) : null,
      };

      printJson(data);
    }),
  );
