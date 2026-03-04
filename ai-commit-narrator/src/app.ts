import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { classify } from "./classifier.js";
import { buildQueryText, GitQuery, readCommits, resolveCommitShas, resolveRepoPath } from "./git.js";
import { generateLlmSummary } from "./llm.js";
import { buildReport, toJson, toMarkdown } from "./report.js";
import { buildRollbackAdvice, detectRisks } from "./risk.js";
import { Lang, OutputFormat } from "./types.js";

export interface NarrateRequest {
  since?: string;
  until?: string;
  commits?: string[];
  fromTag?: string;
  toTag?: string;
  maxCount?: number;
  lang?: Lang;
  format?: OutputFormat;
  output?: string;
  jsonOutput?: string;
  repo?: string;
  withLlm?: boolean;
  llmBaseUrl?: string;
  llmModel?: string;
  llmApiKeyEnv?: string;
  llmTemperature?: number;
  llmTimeoutMs?: number;
}

export interface NarrateResult {
  markdown: string;
  json: string;
  outputSummary: {
    format: OutputFormat;
    commits: number;
    risks: number;
    llmEnabled: boolean;
    llmUsed: boolean;
    markdownOutput?: string;
    jsonOutput?: string;
  };
}

const DEFAULTS = {
  maxCount: 30,
  lang: "zh" as Lang,
  format: "markdown" as OutputFormat,
  output: "CHANGELOG_AI.md",
  jsonOutput: "CHANGELOG_AI.json",
  repo: ".",
  llmBaseUrl: "https://api.openai.com/v1",
  llmModel: "gpt-4o-mini",
  llmApiKeyEnv: "OPENAI_API_KEY",
  llmTemperature: 0.2,
  llmTimeoutMs: 15000
};

export function validateRequest(input: NarrateRequest): void {
  if ((input.fromTag && !input.toTag) || (!input.fromTag && input.toTag)) {
    throw new Error("`--from-tag` 和 `--to-tag` 需要同时提供。");
  }
}

function ensureParent(path: string): void {
  mkdirSync(dirname(resolve(path)), { recursive: true });
}

function sanitizeRequest(input: NarrateRequest): Required<NarrateRequest> {
  return {
    since: input.since ?? "",
    until: input.until ?? "",
    commits: input.commits ?? [],
    fromTag: input.fromTag ?? "",
    toTag: input.toTag ?? "",
    maxCount: Number.isFinite(input.maxCount) && (input.maxCount as number) > 0 ? (input.maxCount as number) : DEFAULTS.maxCount,
    lang: input.lang ?? DEFAULTS.lang,
    format: input.format ?? DEFAULTS.format,
    output: input.output ?? DEFAULTS.output,
    jsonOutput: input.jsonOutput ?? DEFAULTS.jsonOutput,
    repo: input.repo ?? DEFAULTS.repo,
    withLlm: Boolean(input.withLlm),
    llmBaseUrl: input.llmBaseUrl ?? DEFAULTS.llmBaseUrl,
    llmModel: input.llmModel ?? DEFAULTS.llmModel,
    llmApiKeyEnv: input.llmApiKeyEnv ?? DEFAULTS.llmApiKeyEnv,
    llmTemperature: Number.isFinite(input.llmTemperature) ? (input.llmTemperature as number) : DEFAULTS.llmTemperature,
    llmTimeoutMs: Number.isFinite(input.llmTimeoutMs) && (input.llmTimeoutMs as number) > 0 ? (input.llmTimeoutMs as number) : DEFAULTS.llmTimeoutMs
  };
}

function toGitQuery(input: Required<NarrateRequest>): GitQuery {
  return {
    since: input.since || undefined,
    until: input.until || undefined,
    fromTag: input.fromTag || undefined,
    toTag: input.toTag || undefined,
    commits: input.commits.length > 0 ? input.commits : undefined,
    maxCount: input.maxCount
  };
}

export async function runNarration(input: NarrateRequest): Promise<NarrateResult> {
  validateRequest(input);
  const req = sanitizeRequest(input);
  const gitQuery = toGitQuery(req);

  const repoPath = resolveRepoPath(req.repo);
  const shas = resolveCommitShas(gitQuery, repoPath);
  const commits = readCommits(shas, repoPath);
  const classified = classify(commits, req.lang);
  const risks = detectRisks(classified, req.lang);
  const rollbackAdvice = buildRollbackAdvice(classified, risks, req.lang);

  const llmApiKey = process.env[req.llmApiKeyEnv];
  const llmSummary = await generateLlmSummary(classified, risks, req.lang, {
    enabled: req.withLlm,
    baseUrl: req.llmBaseUrl,
    model: req.llmModel,
    apiKey: llmApiKey,
    temperature: req.llmTemperature,
    timeoutMs: req.llmTimeoutMs
  });

  const report = buildReport(
    classified,
    risks,
    rollbackAdvice,
    req.lang,
    repoPath,
    buildQueryText(gitQuery),
    llmSummary
  );

  const markdown = toMarkdown(report);
  const json = toJson(report);

  if (req.format === "markdown" || req.format === "both") {
    ensureParent(req.output);
    writeFileSync(req.output, markdown, { encoding: "utf8" });
  }
  if (req.format === "json" || req.format === "both") {
    ensureParent(req.jsonOutput);
    writeFileSync(req.jsonOutput, json, { encoding: "utf8" });
  }

  return {
    markdown,
    json,
    outputSummary: {
      format: req.format,
      commits: classified.length,
      risks: risks.length,
      llmEnabled: req.withLlm,
      llmUsed: Boolean(llmSummary && llmSummary.length > 0),
      markdownOutput: req.format === "json" ? undefined : req.output,
      jsonOutput: req.format === "markdown" ? undefined : req.jsonOutput
    }
  };
}
