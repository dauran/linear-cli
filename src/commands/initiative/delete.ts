import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

export const deleteCommand = new Command()
  .description("Delete an initiative by ID.")
  .arguments("<id:string>")
  .action(
    handleErrors(async (_options: void, id: string) => {
      const client = getClient();
      const payload = await client.deleteInitiative(id);
      printJson({ success: payload.success, id });
    }),
  );
