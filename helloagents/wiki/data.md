# 数据模型

## 概述
项目当前不维护持久化数据库，主要处理运行时内存数据结构与生成的 Markdown 文件。

---

## 数据表/集合

### CommitRecord

**描述:** 从 Git 中读取的原始提交信息。

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| sha | string | 非空 | 提交哈希 |
| author | string | 非空 | 作者 |
| date | string | 非空 | 提交时间（ISO） |
| subject | string | 非空 | 提交标题 |
| body | string | 可空 | 提交正文 |
| changedFiles | string[] | 非空 | 变更文件列表 |
| diff | string | 非空 | 提交差异文本 |

**索引:**
- 无持久化索引

**关联关系:**
- `ClassifiedCommit` 基于 `CommitRecord` 扩展字段 `type`、`summary`
- `NarrationReport` 聚合 `ClassifiedCommit` 与 `RiskFinding`

