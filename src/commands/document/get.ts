import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { pick, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

const DOCUMENT_FIELDS = [
  "id",
  "title",
  "content",
  "icon",
  "color",
  "url",
  "slugId",
  "createdAt",
  "updatedAt",
];

export const getCommand = new Command()
  .description("Get a document by ID.")
  .arguments("<id:string>")
  .action(
    handleErrors(async (_options: void, id: string) => {
      const client = getClient();
      const document = await client.document(id);
      const project = await document.project;
      const creator = await document.creator;

      const data = {
        ...pick(document, DOCUMENT_FIELDS),
        project: project ? pick(project, ["id", "name"]) : null,
        creator: creator ? pick(creator, ["id", "name"]) : null,
      };

      printJson(data);
    }),
  );
