import express from "express";
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { runNarration } from "./app.js";
import { Lang, OutputFormat } from "./types.js";

interface WebRequestBody {
  repo?: string;
  since?: string;
  until?: string;
  commits?: string;
  fromTag?: string;
  toTag?: string;
  maxCount?: number;
  lang?: Lang;
  format?: OutputFormat;
  withLlm?: boolean;
  llmModel?: string;
}

const app = express();
const port = Number.parseInt(process.env.PORT ?? "3088", 10);
const webRoot = resolve(process.cwd(), "web");

app.use(express.json({ limit: "1mb" }));
app.use("/assets", express.static(join(webRoot, "assets")));

app.get("/", (_req, res) => {
  const html = readFileSync(join(webRoot, "index.html"), "utf8");
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(html);
});

app.post("/api/narrate", async (req, res) => {
  const body = (req.body ?? {}) as WebRequestBody;
  try {
    const result = await runNarration({
      repo: body.repo ?? ".",
      since: body.since || undefined,
      until: body.until || undefined,
      commits: body.commits
        ? body.commits
            .split(",")
            .map((x) => x.trim())
            .filter(Boolean)
        : undefined,
      fromTag: body.fromTag || undefined,
      toTag: body.toTag || undefined,
      maxCount: body.maxCount ?? 30,
      lang: body.lang ?? "zh",
      format: body.format ?? "both",
      output: "web-output/CHANGELOG_AI.md",
      jsonOutput: "web-output/CHANGELOG_AI.json",
      withLlm: Boolean(body.withLlm),
      llmModel: body.llmModel ?? "gpt-4o-mini"
    });

    res.json({
      ok: true,
      summary: result.outputSummary,
      markdown: result.markdown,
      json: result.json
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

app.listen(port, () => {
  console.log(`Web UI running on http://localhost:${port}`);
});
