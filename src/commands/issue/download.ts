import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

interface DownloadOptions {
  output?: string;
}

type SourceRef =
  | { kind: "description" }
  | { kind: "comment"; commentId: string };

interface FoundUrl {
  url: string;
  label: string | null;
  source: SourceRef;
}

interface DownloadResult {
  url: string;
  file: string | null;
  bytes: number | null;
  sources: SourceRef[];
  label: string | null;
  error: string | null;
}

const IMAGE_RE = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
const LINK_RE = /(?<!!)\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
const UPLOAD_PREFIX = "https://uploads.linear.app/";
const CONCURRENCY = 4;
const PAGE_SIZE = 50;

function extractUrls(markdown: string, source: SourceRef): FoundUrl[] {
  const found: FoundUrl[] = [];
  for (const m of markdown.matchAll(IMAGE_RE)) {
    const url = m[2];
    if (url.startsWith(UPLOAD_PREFIX)) {
      found.push({ url, label: m[1] || null, source });
    }
  }
  for (const m of markdown.matchAll(LINK_RE)) {
    const url = m[2];
    if (url.startsWith(UPLOAD_PREFIX)) {
      found.push({ url, label: m[1] || null, source });
    }
  }
  return found;
}

function sanitizeName(raw: string): string {
  // deno-lint-ignore no-control-regex
  let s = raw.replace(/[\/\\\x00-\x1f]/g, "");
  s = s.replace(/[<>:"|?*]/g, "_");
  s = s.replace(/\s+/g, "_");
  s = s.replace(/^[\s.]+|[\s.]+$/g, "");
  if (s.length > 80) s = s.slice(0, 80);
  return s;
}

function splitExt(name: string): { base: string; ext: string } {
  const idx = name.lastIndexOf(".");
  if (idx <= 0 || idx === name.length - 1) return { base: name, ext: "" };
  const ext = name.slice(idx);
  if (ext.length > 11) return { base: name, ext: "" };
  return { base: name.slice(0, idx), ext };
}

async function sha1Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest(
    "SHA-1",
    new TextEncoder().encode(input),
  );
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function deriveFilename(
  label: string | null,
  url: string,
  urlObj: URL,
): Promise<string> {
  const segments = urlObj.pathname.split("/").filter((s) => s.length > 0);
  const lastSeg = segments.length > 0
    ? decodeURIComponent(segments[segments.length - 1])
    : "";
  let ext = lastSeg ? splitExt(lastSeg).ext : "";

  let base = "";
  if (label) {
    const sanitized = sanitizeName(label);
    if (sanitized) {
      const split = splitExt(sanitized);
      base = split.base;
      if (!ext && split.ext) ext = split.ext;
    }
  }
  if (!base && lastSeg) {
    const sanitized = sanitizeName(lastSeg);
    if (sanitized) base = splitExt(sanitized).base;
  }
  if (!base) {
    base = (await sha1Hex(url)).slice(0, 12);
  }
  return base + ext;
}

async function pathExists(p: string): Promise<boolean> {
  try {
    await Deno.stat(p);
    return true;
  } catch (e) {
    if (e instanceof Deno.errors.NotFound) return false;
    throw e;
  }
}

async function resolveCollision(
  dir: string,
  name: string,
  taken: Set<string>,
): Promise<string> {
  const { base, ext } = splitExt(name);
  let candidate = name;
  let counter = 0;
  while (taken.has(candidate) || await pathExists(`${dir}/${candidate}`)) {
    counter += 1;
    candidate = `${base}-${counter}${ext}`;
  }
  return candidate;
}

async function downloadOne(
  url: string,
  apiKey: string,
  dir: string,
  filename: string,
): Promise<{ bytes: number; path: string }> {
  const res = await fetch(url, { headers: { Authorization: apiKey } });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText}`);
  }
  const buf = new Uint8Array(await res.arrayBuffer());
  const path = `${dir}/${filename}`;
  await Deno.writeFile(path, buf);
  return { bytes: buf.byteLength, path };
}

// deno-lint-ignore no-explicit-any
async function fetchAllComments(issue: any): Promise<any[]> {
  // deno-lint-ignore no-explicit-any
  const all: any[] = [];
  let conn = await issue.comments({ first: PAGE_SIZE });
  all.push(...conn.nodes);
  while (conn.pageInfo?.hasNextPage && conn.pageInfo?.endCursor) {
    conn = await issue.comments({
      first: PAGE_SIZE,
      after: conn.pageInfo.endCursor,
    });
    all.push(...conn.nodes);
  }
  return all;
}

async function runWithConcurrency<T, R>(
  items: T[],
  limit: number,
  worker: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  const lanes = Array.from(
    { length: Math.min(limit, items.length) },
    async () => {
      while (true) {
        const i = next++;
        if (i >= items.length) return;
        results[i] = await worker(items[i]);
      }
    },
  );
  await Promise.all(lanes);
  return results;
}

export const downloadCommand = new Command()
  .description(
    "Download inline uploaded files from an issue's description and comments.",
  )
  .arguments("<id:string>")
  .option(
    "--output <dir:string>",
    "Output directory (default: ./local/download/<id>/).",
  )
  .action(
    handleErrors(async (options: DownloadOptions, id: string) => {
      const apiKey = Deno.env.get("LINEAR_API_KEY")!;
      const client = getClient();
      const issue = await client.issue(id);
      const outputDir = options.output ?? `./local/download/${id}`;
      await Deno.mkdir(outputDir, { recursive: true });

      const found: FoundUrl[] = [];
      if (issue.description) {
        found.push(
          ...extractUrls(issue.description, { kind: "description" }),
        );
      }
      const comments = await fetchAllComments(issue);
      for (const c of comments) {
        if (c.body) {
          found.push(
            ...extractUrls(c.body, { kind: "comment", commentId: c.id }),
          );
        }
      }

      const byUrl = new Map<
        string,
        { label: string | null; sources: SourceRef[] }
      >();
      for (const f of found) {
        const entry = byUrl.get(f.url) ?? { label: null, sources: [] };
        if (!entry.label && f.label) entry.label = f.label;
        entry.sources.push(f.source);
        byUrl.set(f.url, entry);
      }

      const taken = new Set<string>();
      const plans: {
        url: string;
        meta: { label: string | null; sources: SourceRef[] };
        filename: string;
      }[] = [];
      for (const [url, meta] of byUrl) {
        const u = new URL(url);
        const desired = await deriveFilename(meta.label, url, u);
        const filename = await resolveCollision(outputDir, desired, taken);
        taken.add(filename);
        plans.push({ url, meta, filename });
      }

      const results: DownloadResult[] = await runWithConcurrency(
        plans,
        CONCURRENCY,
        async (p) => {
          try {
            const { bytes, path } = await downloadOne(
              p.url,
              apiKey,
              outputDir,
              p.filename,
            );
            return {
              url: p.url,
              file: path,
              bytes,
              sources: p.meta.sources,
              label: p.meta.label,
              error: null,
            };
          } catch (e) {
            return {
              url: p.url,
              file: null,
              bytes: null,
              sources: p.meta.sources,
              label: p.meta.label,
              error: e instanceof Error ? e.message : String(e),
            };
          }
        },
      );

      printJson({
        issueId: id,
        outputDir,
        urlsFound: byUrl.size,
        filesWritten: results.filter((r) => r.file).length,
        filesFailed: results.filter((r) => r.error).length,
        downloads: results,
      });
    }),
  );
