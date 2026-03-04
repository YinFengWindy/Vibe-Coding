# Changelog

本文件记录项目所有重要变更。
格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/),
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [Unreleased]

### 新增
- 初始化 `helloagents/` 知识库结构与核心文档。
- 支持 `--format markdown|json|both` 多格式输出与 `--repo` 指定仓库路径。
- 新增可选 `--with-llm` 执行摘要能力（OpenAI 兼容接口）。
- 新增自动化测试（分类、风险、报告渲染）。
- 新增 Web UI（`src/server.ts` + `web/`），支持表单式生成报告与结果预览。

### 变更
- 重构 Git 命令执行方式，改为参数化调用并增强错误可读性。
- 报告增加元信息（仓库路径、查询条件）与 JSON 输出能力。
- 抽离 `src/app.ts` 作为 CLI/Web 共用应用层。

## [0.1.0] - 2026-03-04

### 新增
- 创建 `AI Commit Narrator` CLI 脚手架与核心功能。
