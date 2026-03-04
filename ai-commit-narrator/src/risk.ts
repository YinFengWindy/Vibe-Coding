import { ClassifiedCommit, RiskFinding } from "./types.js";

function addFinding(
  findings: RiskFinding[],
  commit: ClassifiedCommit,
  severity: "high" | "medium",
  title: string,
  detail: string
): void {
  findings.push({
    severity,
    title,
    detail,
    commitSha: commit.sha
  });
}

export function detectRisks(commits: ClassifiedCommit[], lang: "zh" | "en"): RiskFinding[] {
  const findings: RiskFinding[] = [];

  for (const commit of commits) {
    const files = commit.changedFiles.join("\n").toLowerCase();
    const text = `${commit.subject}\n${commit.body}\n${commit.diff}`.toLowerCase();
    const deletedLines = (commit.diff.match(/^\-/gm) ?? []).length;

    if (/migrations?\/|schema\.sql|prisma\/schema\.prisma/.test(files) || /\balter table\b|\bdrop table\b/.test(text)) {
      addFinding(
        findings,
        commit,
        "high",
        lang === "en" ? "Database migration detected" : "检测到数据库迁移变更",
        lang === "en" ? "Schema/data migration may require backup and rollout plan." : "涉及 Schema 或数据迁移，发布前建议备份并制定回滚流程。"
      );
    }

    if (/\.env|config|settings|docker-compose|k8s|helm|terraform/.test(files)) {
      addFinding(
        findings,
        commit,
        "medium",
        lang === "en" ? "Configuration changes detected" : "检测到配置变更",
        lang === "en" ? "Verify environment-specific values before release." : "请在各环境校验配置值，避免环境差异导致故障。"
      );
    }

    if (/^[-+].*\b(public|export)\b.*\(/m.test(commit.diff) || /^[-+].*controller|route|api/m.test(commit.diff)) {
      addFinding(
        findings,
        commit,
        "high",
        lang === "en" ? "Potential API signature change" : "疑似 API 签名变更",
        lang === "en" ? "Interface contract may have changed; check backward compatibility." : "接口契约可能变化，请确认兼容性与调用方影响。"
      );
    }

    if (deletedLines >= 200) {
      addFinding(
        findings,
        commit,
        "medium",
        lang === "en" ? "Large deletion volume" : "删除量较大",
        lang === "en" ? `Detected ${deletedLines} removed lines; confirm no accidental removal.` : `检测到约 ${deletedLines} 行删除，请确认不存在误删。`
      );
    }
  }

  return findings;
}

export function buildRollbackAdvice(commits: ClassifiedCommit[], risks: RiskFinding[], lang: "zh" | "en"): string[] {
  const tips: string[] = [];
  const highRisk = risks.some((x) => x.severity === "high");
  const hasDb = risks.some((x) => /database|数据库/.test(x.title.toLowerCase()));

  if (lang === "en") {
    tips.push("Use `git revert <sha>` for targeted rollback instead of force-push.");
    if (highRisk) tips.push("Perform canary release and monitor error rate, p95 latency, and business KPIs.");
    if (hasDb) tips.push("Prepare data rollback script or snapshot restore plan before release.");
    if (commits.length > 10) tips.push("Split deployment by commit batches to isolate impact.");
  } else {
    tips.push("优先使用 `git revert <sha>` 进行定点回滚，避免直接强推历史。");
    if (highRisk) tips.push("建议灰度发布并重点监控错误率、P95 延迟和核心业务指标。");
    if (hasDb) tips.push("涉及数据库变更时，发布前准备数据回滚脚本或快照恢复方案。");
    if (commits.length > 10) tips.push("建议分批发布提交，便于定位问题与缩小影响面。");
  }

  return tips;
}
