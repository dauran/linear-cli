import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { pick, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

interface CreateOptions {
  title: string;
  content?: string;
  projectId?: string;
  icon?: string;
  color?: string;
  issueId?: string;
  sortOrder?: number;
}

export const createCommand = new Command()
  .description("Create a new document.")
  .option("--title <title:string>", "Document title.", { required: true })
  .option("--content <content:string>", "Document content.")
  .option("--project-id <projectId:string>", "Project ID.")
  .option("--icon <icon:string>", "Document icon.")
  .option("--color <color:string>", "Document color.")
  .option("--issue-id <issueId:string>", "Issue ID.")
  .option("--sort-order <sortOrder:number>", "Sort order.")
  .action(
    handleErrors(async (options: CreateOptions) => {
      const client = getClient();

      const input: {
        title: string;
        content?: string;
        projectId?: string;
        icon?: string;
        color?: string;
        issueId?: string;
        sortOrder?: number;
      } = {
        title: options.title,
      };
      if (options.content !== undefined) input.content = options.content;
      if (options.projectId) input.projectId = options.projectId;
      if (options.icon !== undefined) input.icon = options.icon;
      if (options.color !== undefined) input.color = options.color;
      if (options.issueId) input.issueId = options.issueId;
      if (options.sortOrder !== undefined) input.sortOrder = options.sortOrder;

      const payload = await client.createDocument(input);
      const document = await payload.document;

      if (document) {
        printJson(pick(document, ["id", "title", "url", "slugId"]));
      }
    }),
  );
