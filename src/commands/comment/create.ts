import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { pick, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

interface CreateOptions {
  issueId: string;
  body: string;
  parentId?: string;
  projectUpdateId?: string;
  documentContentId?: string;
}

export const createCommand = new Command()
  .description("Create a comment on an issue.")
  .option("--issue-id <issueId:string>", "Issue ID.", { required: true })
  .option("--body <body:string>", "Comment body.", { required: true })
  .option("--parent-id <parentId:string>", "Parent comment ID (threading).")
  .option(
    "--project-update-id <projectUpdateId:string>",
    "Project update ID.",
  )
  .option(
    "--document-content-id <documentContentId:string>",
    "Document content ID.",
  )
  .action(
    handleErrors(async (options: CreateOptions) => {
      const client = getClient();

      const input: {
        issueId: string;
        body: string;
        parentId?: string;
        projectUpdateId?: string;
        documentContentId?: string;
      } = {
        issueId: options.issueId,
        body: options.body,
      };
      if (options.parentId) input.parentId = options.parentId;
      if (options.projectUpdateId) {
        input.projectUpdateId = options.projectUpdateId;
      }
      if (options.documentContentId) {
        input.documentContentId = options.documentContentId;
      }

      const payload = await client.createComment(input);
      const comment = await payload.comment;

      if (comment) {
        printJson(pick(comment, ["id", "body", "createdAt", "url"]));
      }
    }),
  );
