import { ClassifiedCommit, Lang, RiskFinding } from "./types.js";

export interface LlmOptions {
  enabled: boolean;
  baseUrl: string;
  model: string;
  apiKey?: string;
  temperature: number;
  timeoutMs: number;
}

export async function generateLlmSummary(
  commits: ClassifiedCommit[],
  risks: RiskFinding[],
  lang: Lang,
  options: LlmOptions
): Promise<string[] | undefined> {
  if (!options.enabled || !options.apiKey || commits.length === 0) {
    return undefined;
  }

  const body = {
    model: options.model,
    temperature: options.temperature,
    messages: [
      {
        role: "system",
        content:
          lang === "en"
            ? "You are a release manager. Reply with 3-5 concise bullet lines only."
            : "你是发布经理。仅输出3-5条精简要点，每行一个要点。"
      },
      {
        role: "user",
        content: createPrompt(commits, risks, lang)
      }
    ]
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeoutMs);

  try {
    const response = await fetch(`${options.baseUrl.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${options.apiKey}`
      },
      body: JSON.stringify(body),
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`LLM request failed: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) return undefined;
    return normalizeBulletLines(content);
  } catch {
    return undefined;
  } finally {
    clearTimeout(timer);
  }
}

function createPrompt(commits: ClassifiedCommit[], risks: RiskFinding[], lang: Lang): string {
  const topCommits = commits.slice(0, 15).map((c) => `${c.type}: ${c.subject}`).join("\n");
  const riskText =
    risks.length === 0
      ? lang === "en"
        ? "No explicit risk findings."
        : "没有明确风险项。"
      : risks.map((r) => `[${r.severity}] ${r.title}: ${r.detail}`).join("\n");

  if (lang === "en") {
    return `Write executive release highlights for these commits.\n\nCommits:\n${topCommits}\n\nRisks:\n${riskText}`;
  }
  return `请为以下提交生成发布执行摘要。\n\n提交:\n${topCommits}\n\n风险:\n${riskText}`;
}

function normalizeBulletLines(raw: string): string[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^[-*•]\s*/, ""))
    .slice(0, 5);
}
