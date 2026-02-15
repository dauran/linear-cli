import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { pick, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

const PROJECT_FIELDS = [
  "id",
  "name",
  "description",
  "state",
  "url",
  "progress",
  "startDate",
  "targetDate",
  "createdAt",
  "updatedAt",
];

export const getCommand = new Command()
  .description("Get a project by ID.")
  .arguments("<id:string>")
  .action(
    handleErrors(async (_options: void, id: string) => {
      const client = getClient();
      const project = await client.project(id);
      const lead = await project.lead;

      const data = {
        ...pick(project, PROJECT_FIELDS),
        lead: lead ? pick(lead, ["id", "name", "email"]) : null,
      };

      printJson(data);
    }),
  );
