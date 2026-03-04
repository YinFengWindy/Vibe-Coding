import { ClassifiedCommit, CommitRecord, ChangeType, Lang } from "./types.js";

function hasAny(text: string, patterns: RegExp[]): boolean {
  return patterns.some((p) => p.test(text));
}

function detectType(record: CommitRecord): ChangeType {
  const text = `${record.subject}\n${record.body}\n${record.changedFiles.join("\n")}`.toLowerCase();

  if (hasAny(text, [/^feat(\(.+\))?:/m, /\bfeature\b/, /\badd(ed|s)?\b/])) return "feat";
  if (hasAny(text, [/^fix(\(.+\))?:/m, /\bbug\b/, /\bhotfix\b/, /\bresolve(d)?\b/])) return "fix";
  if (hasAny(text, [/^refactor(\(.+\))?:/m, /\bcleanup\b/, /\brestructure\b/])) return "refactor";
  if (hasAny(text, [/^docs?(\(.+\))?:/m, /readme/i, /\.md\b/])) return "docs";
  if (hasAny(text, [/^test(\(.+\))?:/m, /\bunit test\b/, /\be2e\b/, /__tests__/])) return "test";
  return "chore";
}

function shortSha(sha: string): string {
  return sha.slice(0, 7);
}

function summarize(record: CommitRecord, type: ChangeType, lang: Lang): string {
  if (lang === "en") {
    return `[${type}] ${record.subject} (${record.changedFiles.length} files, ${shortSha(record.sha)})`;
  }
  return `[${type}] ${record.subject}（${record.changedFiles.length} 个文件，${shortSha(record.sha)}）`;
}

export function classify(commits: CommitRecord[], lang: Lang): ClassifiedCommit[] {
  return commits.map((commit) => {
    const type = detectType(commit);
    return {
      ...commit,
      type,
      summary: summarize(commit, type, lang)
    };
  });
}
