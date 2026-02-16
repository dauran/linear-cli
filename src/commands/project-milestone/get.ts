import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { pick, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

const MILESTONE_FIELDS = [
  "id",
  "name",
  "description",
  "targetDate",
  "sortOrder",
  "createdAt",
  "updatedAt",
];

export const getCommand = new Command()
  .description("Get a project milestone by ID.")
  .arguments("<id:string>")
  .action(
    handleErrors(async (_options: void, id: string) => {
      const client = getClient();
      const milestone = await client.projectMilestone(id);
      const project = await milestone.project;

      const data = {
        ...pick(milestone, MILESTONE_FIELDS),
        project: project ? pick(project, ["id", "name"]) : null,
      };

      printJson(data);
    }),
  );
