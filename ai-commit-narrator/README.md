# AI Commit Narrator

将 Git 提交自动转换为可读变更说明，并输出风险提示、回滚建议与可选的 AI 执行摘要。  
当前支持 `CLI` 与 `Web UI` 两种使用方式，复用同一核心引擎。

## 功能特性

- 提交采集：时间范围、tag 范围、显式 SHA 列表
- 自动分类：`feat/fix/refactor/docs/test/chore`
- 风险识别：数据库迁移、配置变更、API 签名变化、大规模删除
- 回滚建议：按风险情况生成发布/回滚策略
- 多格式输出：Markdown / JSON / 双写输出
- 可选 LLM：生成执行摘要（兼容 OpenAI Chat Completions 协议）
- Web UI：表单配置、结果预览、一键复制

## 快速开始

```bash
cd ai-commit-narrator
npm install
npm run build
```

## CLI 用法

```bash
# 1) 按时间范围生成 Markdown 报告
node dist/index.js --since "2026-03-01" --until "2026-03-04" --output CHANGELOG_AI.md

# 2) 输出 JSON 报告
node dist/index.js --max-count 20 --format json --json-output reports/report.json

# 3) 同时输出 Markdown + JSON
node dist/index.js --from-tag v0.1.0 --to-tag v0.2.0 --format both --output RELEASE.md --json-output RELEASE.json

# 4) 启用 LLM 执行摘要（需 OPENAI_API_KEY）
node dist/index.js --max-count 15 --with-llm --llm-model gpt-4o-mini
```

## Web UI 用法

```bash
cd ai-commit-narrator
npm run web
```

启动后访问 `http://localhost:3088`。  
Web UI 将调用 `/api/narrate`，并把报告写入 `web-output/` 目录（被 `.gitignore` 忽略）。

## 参数说明

- `--repo <path>`: 目标仓库路径（默认当前目录）
- `--since <date>` / `--until <date>`: 时间范围
- `--commits <sha1,sha2>`: 指定提交列表
- `--from-tag <tag>` / `--to-tag <tag>`: 指定 tag 范围（必须成对提供）
- `--max-count <n>`: 最大提交数（默认 30）
- `--lang <zh|en>`: 输出语言（默认 `zh`）
- `--format <markdown|json|both>`: 输出格式（默认 `markdown`）
- `--output <file>`: Markdown 输出文件（默认 `CHANGELOG_AI.md`）
- `--json-output <file>`: JSON 输出文件（默认 `CHANGELOG_AI.json`）
- `--stdout`: 在终端打印 Markdown 报告
- `--with-llm`: 启用 LLM 执行摘要
- `--llm-base-url <url>`: LLM API Base URL（默认 `https://api.openai.com/v1`）
- `--llm-model <model>`: 模型名（默认 `gpt-4o-mini`）
- `--llm-api-key-env <name>`: API Key 的环境变量名（默认 `OPENAI_API_KEY`）
- `--llm-temperature <n>`: 温度（默认 `0.2`）
- `--llm-timeout-ms <n>`: 请求超时毫秒数（默认 `15000`）

## 目录结构

```text
src/
  app.ts        # 核心应用层（CLI/Web共用）
  index.ts      # CLI入口
  server.ts     # Web服务入口
  git.ts        # Git采集
  classifier.ts # 分类规则
  risk.ts       # 风险规则
  llm.ts        # 可选LLM摘要
  report.ts     # 报告构建与渲染
web/
  index.html
  assets/
    style.css
    app.js
```

## 质量保障

```bash
npm run build
npm test
```
