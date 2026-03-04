export type ChangeType = "feat" | "fix" | "refactor" | "docs" | "test" | "chore";
export type Lang = "zh" | "en";
export type OutputFormat = "markdown" | "json" | "both";

export interface CommitRecord {
  sha: string;
  author: string;
  date: string;
  subject: string;
  body: string;
  changedFiles: string[];
  diff: string;
}

export interface ClassifiedCommit extends CommitRecord {
  type: ChangeType;
  summary: string;
}

export interface RiskFinding {
  severity: "high" | "medium";
  title: string;
  detail: string;
  commitSha: string;
}

export interface NarrationReport {
  generatedAt: string;
  lang: Lang;
  commits: ClassifiedCommit[];
  highlights: string[];
  risks: RiskFinding[];
  rollbackAdvice: string[];
  llmSummary?: string[];
  meta: {
    repoPath: string;
    query: string;
  };
}
