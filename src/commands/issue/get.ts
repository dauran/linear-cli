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

const CHILD_FIELDS = ["id", "identifier", "title"];
const STATE_FIELDS = ["id", "name"];
const RELATION_FIELDS = ["id", "type"];

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
      const parent = await issue.parent;
      const childrenConn = await issue.children();
      const relationsConn = await issue.relations();
      const inverseRelationsConn = await issue.inverseRelations();

      const data = {
        ...pick(issue, ISSUE_FIELDS),
        state: state ? pick(state, ["id", "name", "type"]) : null,
        assignee: assignee ? pick(assignee, ["id", "name", "email"]) : null,
        team: team ? pick(team, ["id", "name", "key"]) : null,
        parent: parent
          ? {
              ...pick(parent, CHILD_FIELDS),
              state: (await parent.state?.then((s) => (s ? pick(s, STATE_FIELDS) : null))) ?? null,
            }
          : null,
        children: await Promise.all(
          childrenConn.nodes.map(async (c) => ({
            ...pick(c, CHILD_FIELDS),
            state: (await c.state?.then((s) => (s ? pick(s, STATE_FIELDS) : null))) ?? null,
          })),
        ),
        relations: await Promise.all(
          relationsConn.nodes.map(async (r) => {
            const related = await r.relatedIssue;
            return {
              ...pick(r, RELATION_FIELDS),
              relatedIssue: related
                ? {
                    ...pick(related, CHILD_FIELDS),
                    state: (await related.state?.then((s) => (s ? pick(s, STATE_FIELDS) : null))) ?? null,
                  }
                : null,
            };
          }),
        ),
        inverseRelations: await Promise.all(
          inverseRelationsConn.nodes.map(async (r) => {
            const src = await r.issue;
            return {
              ...pick(r, RELATION_FIELDS),
              issue: src
                ? {
                    ...pick(src, CHILD_FIELDS),
                    state: (await src.state?.then((s) => (s ? pick(s, STATE_FIELDS) : null))) ?? null,
                  }
                : null,
            };
          }),
        ),
      };

      printJson(data);
    }),
  );
