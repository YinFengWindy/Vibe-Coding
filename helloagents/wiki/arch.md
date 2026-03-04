# 架构设计

## 总体架构
```mermaid
flowchart TD
    A[CLI入口 src/index.ts] --> B[Git采集 src/git.ts]
    B --> C[分类引擎 src/classifier.ts]
    C --> D[风险引擎 src/risk.ts]
    D --> E[报告构建 src/report.ts]
    E --> F[Markdown文件输出]
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
    participant Core as 规则引擎
    participant File as 报告文件

    User->>CLI: 输入参数（时间范围/提交列表/tag）
    CLI->>Git: 获取提交与diff
    Git-->>CLI: 提交原始数据
    CLI->>Core: 分类、风险检测、回滚建议
    Core-->>CLI: 结构化报告
    CLI->>File: 写入 Markdown
```

## 重大架构决策
完整的ADR存储在各变更的how.md中，本章节提供索引。

| adr_id | title | date | status | affected_modules | details |
|--------|-------|------|--------|------------------|---------|
| 暂无 | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |

