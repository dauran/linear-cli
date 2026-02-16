import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

export const archiveCommand = new Command()
  .description("Archive a workflow state by ID.")
  .arguments("<id:string>")
  .action(
    handleErrors(async (_options: void, id: string) => {
      const client = getClient();
      const payload = await client.archiveWorkflowState(id);
      printJson({ success: payload.success, id });
    }),
  );
