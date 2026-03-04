import { ClassifiedCommit, NarrationReport, RiskFinding } from "./types.js";

function topHighlights(commits: ClassifiedCommit[], lang: "zh" | "en"): string[] {
  const byType = new Map<string, number>();
  for (const c of commits) {
    byType.set(c.type, (byType.get(c.type) ?? 0) + 1);
  }

  const sorted = [...byType.entries()].sort((a, b) => b[1] - a[1]);
  if (lang === "en") {
    return sorted.slice(0, 3).map(([type, n]) => `${n} commits classified as ${type}.`);
  }
  return sorted.slice(0, 3).map(([type, n]) => `${type} 类型提交 ${n} 条。`);
}

export function buildReport(
  commits: ClassifiedCommit[],
  risks: RiskFinding[],
  rollbackAdvice: string[],
  lang: "zh" | "en"
): NarrationReport {
  return {
    generatedAt: new Date().toISOString(),
    lang,
    commits,
    highlights: topHighlights(commits, lang),
    risks,
    rollbackAdvice
  };
}

function renderRiskItem(risk: RiskFinding): string {
  const shortSha = risk.commitSha.slice(0, 7);
  return `- [${risk.severity.toUpperCase()}] ${risk.title} (${shortSha})\n  - ${risk.detail}`;
}

export function toMarkdown(report: NarrationReport): string {
  const isEn = report.lang === "en";
  const lines: string[] = [];

  lines.push(`# ${isEn ? "AI Commit Narration Report" : "AI 提交叙事报告"}`);
  lines.push("");
  lines.push(`- ${isEn ? "Generated At" : "生成时间"}: ${report.generatedAt}`);
  lines.push(`- ${isEn ? "Commit Count" : "提交数量"}: ${report.commits.length}`);
  lines.push("");
  lines.push(`## ${isEn ? "Highlights" : "变更亮点"}`);
  lines.push("");
  if (report.highlights.length === 0) lines.push(`- ${isEn ? "No highlights." : "暂无亮点。"} `);
  else lines.push(...report.highlights.map((h) => `- ${h}`));
  lines.push("");
  lines.push(`## ${isEn ? "Commit Summaries" : "提交摘要"}`);
  lines.push("");
  if (report.commits.length === 0) {
    lines.push(`- ${isEn ? "No commits matched the filter." : "没有匹配到提交。"} `);
  } else {
    for (const commit of report.commits) {
      lines.push(`- ${commit.summary}`);
    }
  }
  lines.push("");
  lines.push(`## ${isEn ? "Risk Findings" : "风险提示"}`);
  lines.push("");
  if (report.risks.length === 0) lines.push(`- ${isEn ? "No obvious risk detected." : "未检测到明显风险。"} `);
  else lines.push(...report.risks.map(renderRiskItem));
  lines.push("");
  lines.push(`## ${isEn ? "Rollback Advice" : "回滚建议"}`);
  lines.push("");
  lines.push(...report.rollbackAdvice.map((x) => `- ${x}`));
  lines.push("");

  return lines.join("\n");
}
