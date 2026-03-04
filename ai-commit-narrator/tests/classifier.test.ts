import { describe, expect, it } from "vitest";
import { classify } from "../src/classifier.js";
import { CommitRecord } from "../src/types.js";

function fakeCommit(subject: string, changedFiles: string[]): CommitRecord {
  return {
    sha: "abc1234def5678",
    author: "tester",
    date: "2026-03-04T20:00:00.000Z",
    subject,
    body: "",
    changedFiles,
    diff: ""
  };
}

describe("classify", () => {
  it("classifies feat commit", () => {
    const result = classify([fakeCommit("feat: add summary output", ["src/report.ts"])], "zh");
    expect(result[0].type).toBe("feat");
  });

  it("classifies docs commit by markdown file", () => {
    const result = classify([fakeCommit("update introduction", ["README.md"])], "en");
    expect(result[0].type).toBe("docs");
  });
});
