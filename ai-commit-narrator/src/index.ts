#!/usr/bin/env node
import { Command } from "commander";
import { runNarration } from "./app.js";
import { Lang, OutputFormat } from "./types.js";

interface CliOptions {
  since?: string;
  until?: string;
  commits?: string;
  fromTag?: string;
  toTag?: string;
  maxCount: string;
  lang: string;
  output: string;
  jsonOutput: string;
  format: string;
  stdout?: boolean;
  repo: string;
  withLlm?: boolean;
  llmBaseUrl: string;
  llmModel: string;
  llmApiKeyEnv: string;
  llmTemperature: string;
  llmTimeoutMs: string;
}

function parseLang(raw: string): Lang {
  return raw === "en" ? "en" : "zh";
}

function parseFormat(raw: string): OutputFormat {
  if (raw === "json" || raw === "both") return raw;
  return "markdown";
}

function parsePositiveInt(raw: string, fallback: number): number {
  const value = Number.parseInt(raw, 10);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function parseFloatOr(raw: string, fallback: number): number {
  const value = Number.parseFloat(raw);
  return Number.isFinite(value) ? value : fallback;
}

function normalizeCommits(raw?: string): string[] | undefined {
  if (!raw) return undefined;
  const commits = raw
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
  return commits.length > 0 ? commits : undefined;
}

const program = new Command();

program
  .name("narrate")
  .description("Generate release narration from git commits.")
  .option("--since <date>", "Start date for git log")
  .option("--until <date>", "End date for git log")
  .option("--commits <list>", "Comma-separated commit SHA list")
  .option("--from-tag <tag>", "From git tag")
  .option("--to-tag <tag>", "To git tag")
  .option("--max-count <n>", "Maximum number of commits", "30")
  .option("--lang <lang>", "Output language: zh or en", "zh")
  .option("--repo <path>", "Target repository path", ".")
  .option("--format <type>", "Output format: markdown|json|both", "markdown")
  .option("--output <file>", "Markdown output file", "CHANGELOG_AI.md")
  .option("--json-output <file>", "JSON output file", "CHANGELOG_AI.json")
  .option("--stdout", "Print markdown report to stdout")
  .option("--with-llm", "Enable LLM executive summary")
  .option("--llm-base-url <url>", "LLM compatible API base URL", "https://api.openai.com/v1")
  .option("--llm-model <model>", "LLM model id", "gpt-4o-mini")
  .option("--llm-api-key-env <name>", "Environment variable name for API key", "OPENAI_API_KEY")
  .option("--llm-temperature <n>", "LLM temperature", "0.2")
  .option("--llm-timeout-ms <n>", "LLM timeout in milliseconds", "15000")
  .action(async (opts: CliOptions) => {
    const result = await runNarration({
      since: opts.since,
      until: opts.until,
      commits: normalizeCommits(opts.commits),
      fromTag: opts.fromTag,
      toTag: opts.toTag,
      maxCount: parsePositiveInt(opts.maxCount, 30),
      lang: parseLang(opts.lang),
      format: parseFormat(opts.format),
      output: opts.output,
      jsonOutput: opts.jsonOutput,
      repo: opts.repo,
      withLlm: Boolean(opts.withLlm),
      llmBaseUrl: opts.llmBaseUrl,
      llmModel: opts.llmModel,
      llmApiKeyEnv: opts.llmApiKeyEnv,
      llmTemperature: parseFloatOr(opts.llmTemperature, 0.2),
      llmTimeoutMs: parsePositiveInt(opts.llmTimeoutMs, 15000)
    });

    if (opts.stdout) {
      console.log(result.markdown);
    }

    const lang = parseLang(opts.lang);
    const okText = lang === "en" ? "Report generated" : "报告生成完成";
    const commitText = lang === "en" ? "Commits" : "提交数";
    const riskText = lang === "en" ? "Risks" : "风险项";
    const llmText = lang === "en" ? "LLM summary" : "LLM摘要";
    console.log(`${okText}: format=${result.outputSummary.format}`);
    console.log(
      `${commitText}: ${result.outputSummary.commits}, ${riskText}: ${result.outputSummary.risks}, ${llmText}: ${
        result.outputSummary.llmUsed ? "on" : "off"
      }`
    );
  });

program.parseAsync(process.argv).catch((error) => {
  console.error(`narrate failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
