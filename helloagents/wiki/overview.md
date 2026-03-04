# Vibe-Coding / AI Commit Narrator

> 本文件包含项目级别的核心信息。详细的模块文档见 `modules/` 目录。

---

## 1. 项目概述

### 目标与背景
将 Git 提交自动转换为面向人类阅读的变更说明，并输出风险提示与回滚建议，提升发布沟通效率。

### 范围
- **范围内:** 按提交范围采集 Git 数据、分类摘要、风险检测、Markdown 报告输出。
- **范围外:** 生产环境自动发布、自动执行回滚、远程仓库凭据管理。

### 干系人
- **负责人:** 项目维护者（当前仓库 owner）

---

## 2. 模块索引

| 模块名称 | 职责 | 状态 | 文档 |
|---------|------|------|------|
| cli | 解析参数并组织整体流程 | 🚧开发中 | [modules/cli.md](modules/cli.md) |
| app-core | CLI/Web 共用应用层，统一编排处理流程 | 🚧开发中 | [modules/app-core.md](modules/app-core.md) |
| git-reader | 读取提交、文件列表与差异内容 | 🚧开发中 | [modules/git-reader.md](modules/git-reader.md) |
| narration-core | 提交分类、风险识别、回滚建议生成 | 🚧开发中 | [modules/narration-core.md](modules/narration-core.md) |
| report-renderer | 报告结构构建与 Markdown 渲染 | 🚧开发中 | [modules/report-renderer.md](modules/report-renderer.md) |
| web-ui | 提供可视化表单、API 调用与报告预览 | 🚧开发中 | [modules/web-ui.md](modules/web-ui.md) |

---

## 3. 快速链接
- [技术约定](../project.md)
- [架构设计](arch.md)
- [API 手册](api.md)
- [数据模型](data.md)
- [变更历史](../history/index.md)
