import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { formatList, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

interface ListOptions {
  first?: number;
  project?: string;
}

const DOCUMENT_FIELDS = [
  "id",
  "title",
  "icon",
  "url",
  "slugId",
  "createdAt",
  "updatedAt",
];

export const listCommand = new Command()
  .description("List documents.")
  .option("--first <count:number>", "Number of documents to return.")
  .option("--project <projectId:string>", "Filter by project ID.")
  .action(
    handleErrors(async (options: ListOptions) => {
      const client = getClient();

      const filter: Record<string, unknown> = {};
      if (options.project) filter.project = { id: { eq: options.project } };

      const documents = await client.documents({
        first: options.first ?? 50,
        filter,
      });

      printJson(formatList(documents.nodes, DOCUMENT_FIELDS));
    }),
  );
