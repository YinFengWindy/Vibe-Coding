#!/usr/bin/env node
import { Command } from "commander";
import { writeFileSync } from "node:fs";
import { classify } from "./classifier.js";
import { readCommits, resolveCommitShas } from "./git.js";
import { buildReport, toMarkdown } from "./report.js";
import { buildRollbackAdvice, detectRisks } from "./risk.js";

type Lang = "zh" | "en";

function parseLang(raw: string): Lang {
  return raw === "en" ? "en" : "zh";
}

const program = new Command();

program
  .name("narrate")
  .description("Generate human-readable release notes, risk alerts, and rollback tips from git commits.")
  .option("--since <date>", "Start date for git log, e.g. 2026-03-01")
  .option("--until <date>", "End date for git log, e.g. 2026-03-04")
  .option("--commits <list>", "Comma-separated commit SHA list")
  .option("--from-tag <tag>", "From git tag")
  .option("--to-tag <tag>", "To git tag")
  .option("--max-count <n>", "Maximum number of commits", "30")
  .option("--lang <lang>", "Output language: zh or en", "zh")
  .option("--output <file>", "Output markdown file", "CHANGELOG_AI.md")
  .action((opts) => {
    const lang = parseLang(opts.lang);
    const shas = resolveCommitShas({
      since: opts.since,
      until: opts.until,
      fromTag: opts.fromTag,
      toTag: opts.toTag,
      commits: opts.commits ? String(opts.commits).split(",").map((x) => x.trim()).filter(Boolean) : undefined,
      maxCount: Number.parseInt(String(opts.maxCount), 10)
    });

    const commits = readCommits(shas);
    const classified = classify(commits, lang);
    const risks = detectRisks(classified, lang);
    const rollbackAdvice = buildRollbackAdvice(classified, risks, lang);
    const report = buildReport(classified, risks, rollbackAdvice, lang);
    const markdown = toMarkdown(report);

    writeFileSync(opts.output, markdown, { encoding: "utf8" });
    const okText = lang === "en" ? "Report written to" : "报告已写入";
    const commitText = lang === "en" ? "Commits" : "提交数";
    const riskText = lang === "en" ? "Risks" : "风险项";
    console.log(`${okText}: ${opts.output}`);
    console.log(`${commitText}: ${classified.length}, ${riskText}: ${risks.length}`);
  });

program.parse(process.argv);
