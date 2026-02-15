import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { pick, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

const USER_FIELDS = [
  "id",
  "name",
  "displayName",
  "email",
  "active",
  "admin",
];

export const getCommand = new Command()
  .description('Get a user by ID, or use "me" for the authenticated user.')
  .arguments("<id:string>")
  .action(
    handleErrors(async (_options: void, id: string) => {
      const client = getClient();
      const user = id === "me" ? await client.viewer : await client.user(id);
      printJson(pick(user, USER_FIELDS));
    }),
  );
