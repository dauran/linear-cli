import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { pick, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

interface ListOptions {
  first?: number;
  project?: string;
}

const UPDATE_FIELDS = ["id", "body", "health", "createdAt", "updatedAt"];

export const listCommand = new Command()
  .description("List project updates.")
  .option("--first <count:number>", "Number of updates to return.")
  .option("--project <projectId:string>", "Filter by project ID.")
  .action(
    handleErrors(async (options: ListOptions) => {
      const client = getClient();

      const filter: Record<string, unknown> = {};
      if (options.project) filter.project = { id: { eq: options.project } };

      const updates = await client.projectUpdates({
        first: options.first ?? 50,
        filter,
      });

      const results = await Promise.all(
        updates.nodes.map(async (update) => {
          const user = await update.user;
          return {
            ...pick(update, UPDATE_FIELDS),
            user: user ? pick(user, ["id", "name"]) : null,
          };
        }),
      );

      printJson(results);
    }),
  );
