import { LinearClient } from "@linear/sdk";

let client: LinearClient | null = null;

export function getClient(): LinearClient {
  if (client) return client;

  const apiKey = Deno.env.get("LINEAR_API_KEY");
  if (!apiKey) {
    console.error("Error: LINEAR_API_KEY environment variable is not set.");
    Deno.exit(1);
  }

  client = new LinearClient({ apiKey });
  return client;
}
