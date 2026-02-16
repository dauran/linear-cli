import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { formatList, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

interface ListOptions {
  first?: number;
}

const USER_FIELDS = ["id", "name", "displayName", "email", "active", "admin"];

export const listCommand = new Command()
  .description("List users.")
  .option("--first <count:number>", "Number of users to return.")
  .action(
    handleErrors(async (options: ListOptions) => {
      const client = getClient();
      const users = await client.users({
        first: options.first ?? 50,
      });
      printJson(formatList(users.nodes, USER_FIELDS));
    }),
  );
