// deno-lint-ignore no-explicit-any
export function pick(obj: any, keys: string[]): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
}

export function printJson(data: unknown): void {
  console.log(JSON.stringify(data, null, 2));
}

export function formatList(
  // deno-lint-ignore no-explicit-any
  items: any[],
  keys: string[],
): Record<string, unknown>[] {
  return items.map((item) => pick(item, keys));
}
