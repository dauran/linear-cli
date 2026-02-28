import { InvalidInputLinearError, LinearError } from "@linear/sdk";

export function handleErrors<T extends unknown[]>(
  fn: (...args: T) => Promise<void>,
): (...args: T) => Promise<void> {
  return async (...args: T) => {
    try {
      await fn(...args);
    } catch (error) {
      if (error instanceof InvalidInputLinearError) {
        console.error(`Invalid input: ${error.message}`);
      } else if (error instanceof LinearError) {
        console.error(`Linear API error: ${error.message}`);
      } else if (error instanceof Error) {
        console.error(`Error: ${error.message}`);
      } else {
        console.error("An unknown error occurred.");
      }
      Deno.exit(1);
    }
  };
}
