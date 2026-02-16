import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { pick, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

const UPDATE_FIELDS = [
  "id",
  "body",
  "health",
  "url",
  "createdAt",
  "updatedAt",
];

export const getCommand = new Command()
  .description("Get a project update by ID.")
  .arguments("<id:string>")
  .action(
    handleErrors(async (_options: void, id: string) => {
      const client = getClient();
      const update = await client.projectUpdate(id);
      const project = await update.project;
      const user = await update.user;

      const data = {
        ...pick(update, UPDATE_FIELDS),
        project: project ? pick(project, ["id", "name"]) : null,
        user: user ? pick(user, ["id", "name"]) : null,
      };

      printJson(data);
    }),
  );
