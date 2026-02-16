import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { pick, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

interface CreateOptions {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  ownerId?: string;
  status?: string;
  targetDate?: string;
  content?: string;
  sortOrder?: number;
}

export const createCommand = new Command()
  .description("Create a new initiative.")
  .option("--name <name:string>", "Initiative name.", { required: true })
  .option("--description <description:string>", "Initiative description.")
  .option("--color <color:string>", "Initiative color.")
  .option("--icon <icon:string>", "Initiative icon.")
  .option("--owner-id <ownerId:string>", "Owner user ID.")
  .option(
    "--status <status:string>",
    "Status (Planned, Active, Completed).",
  )
  .option("--target-date <targetDate:string>", "Target date (YYYY-MM-DD).")
  .option("--content <content:string>", "Content (markdown).")
  .option("--sort-order <sortOrder:number>", "Sort order.")
  .action(
    handleErrors(async (options: CreateOptions) => {
      const client = getClient();

      // deno-lint-ignore no-explicit-any
      const input: Record<string, any> = {
        name: options.name,
      };
      if (options.description !== undefined) {
        input.description = options.description;
      }
      if (options.color !== undefined) input.color = options.color;
      if (options.icon !== undefined) input.icon = options.icon;
      if (options.ownerId) input.ownerId = options.ownerId;
      if (options.status !== undefined) input.status = options.status;
      if (options.targetDate) input.targetDate = options.targetDate;
      if (options.content !== undefined) input.content = options.content;
      if (options.sortOrder !== undefined) input.sortOrder = options.sortOrder;

      const payload = await client.createInitiative(
        input as { name: string },
      );
      const initiative = await payload.initiative;

      if (initiative) {
        printJson(pick(initiative, ["id", "name", "status"]));
      }
    }),
  );
