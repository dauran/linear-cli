import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { pick, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

interface UpdateOptions {
  title?: string;
  content?: string;
  projectId?: string;
  icon?: string;
  color?: string;
}

export const updateCommand = new Command()
  .description("Update a document by ID.")
  .arguments("<id:string>")
  .option("--title <title:string>", "New title.")
  .option("--content <content:string>", "New content.")
  .option("--project-id <projectId:string>", "New project ID.")
  .option("--icon <icon:string>", "New icon.")
  .option("--color <color:string>", "New color.")
  .action(
    handleErrors(async (options: UpdateOptions, id: string) => {
      const client = getClient();

      const input: {
        title?: string;
        content?: string;
        projectId?: string;
        icon?: string;
        color?: string;
      } = {};
      if (options.title !== undefined) input.title = options.title;
      if (options.content !== undefined) input.content = options.content;
      if (options.projectId) input.projectId = options.projectId;
      if (options.icon !== undefined) input.icon = options.icon;
      if (options.color !== undefined) input.color = options.color;

      const payload = await client.updateDocument(id, input);
      const document = await payload.document;

      if (document) {
        printJson(pick(document, ["id", "title", "url", "slugId"]));
      }
    }),
  );
