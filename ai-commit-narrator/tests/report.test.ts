import { describe, expect, it } from "vitest";
import { buildReport, toJson, toMarkdown } from "../src/report.js";
import { ClassifiedCommit } from "../src/types.js";

const commits: ClassifiedCommit[] = [
  {
    sha: "1234567890abcdef",
    author: "tester",
    date: "2026-03-04T20:00:00.000Z",
    subject: "feat: add report",
    body: "",
    changedFiles: ["src/report.ts"],
    diff: "",
    type: "feat",
    summary: "[feat] add report"
  }
];

describe("report", () => {
  it("renders markdown with basic sections", () => {
    const report = buildReport(commits, [], ["use git revert"], "en", "d:/repo", "maxCount=1");
    const md = toMarkdown(report);
    expect(md).toContain("## Highlights");
    expect(md).toContain("## Rollback Advice");
  });

  it("renders JSON with metadata", () => {
    const report = buildReport(commits, [], ["tip"], "zh", "d:/repo", "maxCount=1");
    const json = toJson(report);
    expect(json).toContain("\"repoPath\": \"d:/repo\"");
  });
});
