import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { formatList, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

interface SearchOptions {
  first?: number;
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

export const searchCommand = new Command()
  .description("Search documents by term.")
  .arguments("<term:string>")
  .option("--first <count:number>", "Number of results to return.")
  .action(
    handleErrors(async (options: SearchOptions, term: string) => {
      const client = getClient();
      const results = await client.searchDocuments(term, {
        first: options.first ?? 50,
      });

      printJson(formatList(results.nodes, DOCUMENT_FIELDS));
    }),
  );
