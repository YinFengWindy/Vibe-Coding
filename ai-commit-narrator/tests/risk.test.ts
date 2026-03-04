import { describe, expect, it } from "vitest";
import { detectRisks } from "../src/risk.js";
import { ClassifiedCommit } from "../src/types.js";

function commit(diff: string, files: string[]): ClassifiedCommit {
  return {
    sha: "def5678abc1234",
    author: "tester",
    date: "2026-03-04T20:00:00.000Z",
    subject: "feat: update API",
    body: "",
    changedFiles: files,
    diff,
    type: "feat",
    summary: "summary"
  };
}

describe("detectRisks", () => {
  it("detects database risk", () => {
    const risks = detectRisks([commit("+ALTER TABLE users ADD COLUMN nick varchar(20)", ["prisma/schema.prisma"])], "zh");
    expect(risks.some((r) => r.severity === "high")).toBe(true);
  });

  it("detects config risk", () => {
    const risks = detectRisks([commit("+API_URL=https://x", [".env.production"])], "en");
    expect(risks.some((r) => /config/i.test(r.title))).toBe(true);
  });
});
