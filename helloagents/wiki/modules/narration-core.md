# Narration Core 模块

## 目的
将原始提交数据转为可读摘要，并识别发布风险与回滚策略。

## 模块概述
- **职责:** 提交类型分类、风险规则检测、回滚建议生成。
- **状态:** 🚧开发中
- **最后更新:** 2026-03-04

## 规范

### 需求: 规则化提交分类
**模块:** narration-core
按提交文本与文件路径识别 `feat/fix/refactor/docs/test/chore` 类型。

#### 场景: Conventional Commit 标题
提交标题符合 `feat:`、`fix:` 等前缀。
- 优先按前缀分类
- 生成带文件数与短 SHA 的摘要

#### 场景: 非规范提交标题
提交标题不含标准前缀。
- 结合正文与变更文件进行回退识别
- 无法识别时归为 `chore`

### 需求: 识别发布风险
**模块:** narration-core
基于规则输出高风险和中风险提示。

#### 场景: 数据库迁移/接口变更
diff 或路径命中关键模式。
- 标记高风险
- 提示备份、兼容性验证、灰度发布

#### 场景: 配置变更/大规模删除
命中配置文件或高删除行数规则。
- 标记中风险
- 提示环境核验与误删检查

#### 场景: 风险去重
同一提交命中相同风险标题。
- 按 `commitSha + title` 去重
- 保留首条风险以减少噪音

## API接口
### classify(commits, lang)
**描述:** 提交分类与摘要生成
**输入:** `CommitRecord[]`, 输出语言
**输出:** `ClassifiedCommit[]`

### detectRisks(commits, lang)
**描述:** 风险检测
**输入:** `ClassifiedCommit[]`, 输出语言
**输出:** `RiskFinding[]`

### buildRollbackAdvice(commits, risks, lang)
**描述:** 回滚建议生成
**输入:** 提交与风险列表
**输出:** 建议文本数组

### generateLlmSummary(commits, risks, lang, options)
**描述:** 可选调用 LLM 生成执行摘要
**输入:** 分类结果、风险结果、语言与 LLM 配置
**输出:** 摘要要点数组（失败时返回空）

## 数据模型
### RiskFinding
| 字段 | 类型 | 说明 |
|------|------|------|
| severity | high/medium | 风险等级 |
| title | string | 风险标题 |
| detail | string | 风险细节 |
| commitSha | string | 关联提交 |

## 依赖
- git-reader（输入）
- report-renderer（输出聚合）
- llm（可选摘要）

## 变更历史
- 初始化阶段，暂无历史方案包记录
