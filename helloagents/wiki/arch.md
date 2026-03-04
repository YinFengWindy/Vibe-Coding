# 架构设计

## 总体架构
```mermaid
flowchart TD
    A1[CLI入口 src/index.ts] --> B[应用层 src/app.ts]
    A2[Web入口 src/server.ts] --> B
    B --> C[Git采集 src/git.ts]
    C --> D[分类引擎 src/classifier.ts]
    D --> E[风险引擎 src/risk.ts]
    E --> F[可选LLM摘要 src/llm.ts]
    F --> G[报告构建 src/report.ts]
    G --> H[Markdown/JSON输出]
    A2 --> I[静态页面 web/index.html]
```

## 技术栈
- **后端:** Node.js 运行时 + TypeScript
- **前端:** 无（CLI 工具）
- **数据:** 无持久化数据库，数据来源为本地 Git 仓库

## 核心流程
```mermaid
sequenceDiagram
    participant User as 用户
    participant CLI as narrate CLI
    participant Git as Git命令
    participant App as 应用层
    participant Core as 规则引擎
    participant LLM as 可选LLM
    participant File as 报告文件

    User->>CLI: 输入参数（时间范围/提交列表/tag）
    CLI->>App: 调用 runNarration
    App->>Git: 获取提交与diff
    Git-->>CLI: 提交原始数据
    App->>Core: 分类、风险检测、回滚建议
    App->>LLM: 可选执行摘要生成
    LLM-->>App: 摘要要点
    Core-->>App: 结构化报告
    App->>File: 写入 Markdown/JSON
```

## 重大架构决策
完整的ADR存储在各变更的how.md中，本章节提供索引。

| adr_id | title | date | status | affected_modules | details |
|--------|-------|------|--------|------------------|---------|
| 暂无 | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
