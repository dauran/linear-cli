import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

export const archiveCommand = new Command()
  .description("Archive an initiative by ID.")
  .arguments("<id:string>")
  .action(
    handleErrors(async (_options: void, id: string) => {
      const client = getClient();
      const payload = await client.archiveInitiative(id);
      printJson({ success: payload.success, id });
    }),
  );
