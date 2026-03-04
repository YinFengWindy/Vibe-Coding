import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { CommitRecord } from "./types.js";

const FIELD_SEPARATOR = "\u001f";
const RECORD_SEPARATOR = "\u001e";

function runGit(args: string[], repoPath: string): string {
  try {
    return execFileSync("git", args, {
      cwd: repoPath,
      stdio: ["ignore", "pipe", "pipe"],
      encoding: "utf8"
    }).trim();
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`Git command failed: git ${args.join(" ")}\n${detail}`);
  }
}

export function resolveRepoPath(inputPath: string): string {
  const abs = resolve(inputPath);
  if (!existsSync(abs)) {
    throw new Error(`Repository path does not exist: ${abs}`);
  }
  const isGitRepo = runGit(["rev-parse", "--is-inside-work-tree"], abs) === "true";
  if (!isGitRepo) {
    throw new Error(`Not a git repository: ${abs}`);
  }
  return abs;
}

export interface GitQuery {
  since?: string;
  until?: string;
  fromTag?: string;
  toTag?: string;
  commits?: string[];
  maxCount?: number;
}

export function buildQueryText(query: GitQuery): string {
  if (query.commits && query.commits.length > 0) {
    return `commits=${query.commits.join(",")}`;
  }
  const parts: string[] = [];
  if (query.fromTag && query.toTag) parts.push(`range=${query.fromTag}..${query.toTag}`);
  if (query.since) parts.push(`since=${query.since}`);
  if (query.until) parts.push(`until=${query.until}`);
  parts.push(`maxCount=${query.maxCount ?? 30}`);
  return parts.join("; ");
}

export function resolveCommitShas(query: GitQuery, repoPath: string): string[] {
  if (query.commits && query.commits.length > 0) {
    return query.commits;
  }

  const args: string[] = ["log", "--pretty=format:%H"];
  if (query.fromTag && query.toTag) {
    args.push(`${query.fromTag}..${query.toTag}`);
  }
  if (query.since) {
    args.push(`--since=${query.since}`);
  }
  if (query.until) {
    args.push(`--until=${query.until}`);
  }
  if (query.maxCount && query.maxCount > 0) {
    args.push(`--max-count=${query.maxCount}`);
  }

  const output = runGit(args, repoPath);
  if (!output) return [];
  return output
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);
}

export function readCommits(shas: string[], repoPath: string): CommitRecord[] {
  if (shas.length === 0) return [];

  const records: CommitRecord[] = [];
  for (const sha of shas) {
    const raw = runGit(
      [
        "show",
        "--name-only",
        "--no-color",
        `--format=%H${FIELD_SEPARATOR}%an${FIELD_SEPARATOR}%ad${FIELD_SEPARATOR}%s${FIELD_SEPARATOR}%b${RECORD_SEPARATOR}`,
        "--date=iso-strict",
        sha
      ],
      repoPath
    );

    const [meta, fileChunk = ""] = raw.split(RECORD_SEPARATOR);
    const [mSha, author, date, subject, body = ""] = meta.split(FIELD_SEPARATOR);
    const changedFiles = fileChunk
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean);
    const diff = runGit(["show", "--format=", "--unified=0", "--no-color", sha], repoPath);

    records.push({
      sha: mSha,
      author,
      date,
      subject,
      body: body.trim(),
      changedFiles,
      diff
    });
  }
  return records;
}
