const form = document.getElementById("narrateForm");
const errorBox = document.getElementById("errorBox");
const mdOutput = document.getElementById("markdownOutput");
const jsonOutput = document.getElementById("jsonOutput");
const kpiCommits = document.getElementById("kpiCommits");
const kpiRisks = document.getElementById("kpiRisks");
const kpiFormat = document.getElementById("kpiFormat");
const kpiLlm = document.getElementById("kpiLlm");

function showError(text) {
  errorBox.style.display = "block";
  errorBox.textContent = text;
}

function clearError() {
  errorBox.style.display = "none";
  errorBox.textContent = "";
}

function readBody() {
  return {
    repo: document.getElementById("repo").value || ".",
    since: document.getElementById("since").value || undefined,
    until: document.getElementById("until").value || undefined,
    commits: document.getElementById("commits").value || undefined,
    fromTag: document.getElementById("fromTag").value || undefined,
    toTag: document.getElementById("toTag").value || undefined,
    maxCount: Number.parseInt(document.getElementById("maxCount").value || "30", 10),
    lang: document.getElementById("lang").value,
    format: document.getElementById("format").value,
    withLlm: document.getElementById("withLlm").checked,
    llmModel: document.getElementById("llmModel").value || undefined
  };
}

async function runNarration(event) {
  event.preventDefault();
  clearError();

  const submitBtn = document.getElementById("submitBtn");
  submitBtn.disabled = true;
  submitBtn.textContent = "生成中...";

  try {
    const response = await fetch("/api/narrate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(readBody())
    });

    const data = await response.json();
    if (!response.ok || !data.ok) {
      throw new Error(data.error || "请求失败");
    }

    const summary = data.summary;
    kpiCommits.textContent = String(summary.commits);
    kpiRisks.textContent = String(summary.risks);
    kpiFormat.textContent = summary.format;
    kpiLlm.textContent = summary.llmUsed ? "on" : "off";

    mdOutput.textContent = data.markdown || "";
    jsonOutput.textContent = data.json || "";
  } catch (error) {
    showError(error instanceof Error ? error.message : String(error));
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "生成报告";
  }
}

function copyText(id) {
  const text = document.getElementById(id).textContent || "";
  navigator.clipboard.writeText(text);
}

document.getElementById("copyMd").addEventListener("click", () => copyText("markdownOutput"));
document.getElementById("copyJson").addEventListener("click", () => copyText("jsonOutput"));
form.addEventListener("submit", runNarration);
