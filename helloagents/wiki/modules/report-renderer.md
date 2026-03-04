# Report Renderer 模块

## 目的
将结构化报告数据渲染为可归档、可分享的 Markdown/JSON 文档。

## 模块概述
- **职责:** 构建报告对象（生成时间、查询元信息、亮点、摘要、风险、回滚建议）并渲染文本。
- **状态:** 🚧开发中
- **最后更新:** 2026-03-04

## 规范

### 需求: 输出标准化报告
**模块:** report-renderer
保证报告结构固定，便于 PR/发布说明直接复用。

#### 场景: 有提交数据
存在匹配提交。
- 输出亮点、提交摘要、风险项、回滚建议四个核心章节
- 风险项包含等级与短 SHA
- 包含仓库路径与查询条件元信息

#### 场景: 无提交数据
查询范围无匹配提交。
- 输出空状态提示
- 保持报告章节结构不变

#### 场景: 启用 LLM 摘要
LLM 请求成功返回摘要。
- 在报告中插入 AI 执行摘要章节
- 若请求失败则跳过摘要章节，主报告不受影响

## API接口
### buildReport(commits, risks, rollbackAdvice, lang)
**描述:** 组装 `NarrationReport`
**输入:** 分类提交、风险、回滚建议、语言
**输出:** `NarrationReport`

### toMarkdown(report)
**描述:** 渲染 Markdown 文本
**输入:** `NarrationReport`
**输出:** markdown 字符串

### toJson(report)
**描述:** 渲染 JSON 文本
**输入:** `NarrationReport`
**输出:** JSON 字符串

## 数据模型
### NarrationReport
| 字段 | 类型 | 说明 |
|------|------|------|
| generatedAt | string | 报告生成时间 |
| lang | "zh" \| "en" | 语言 |
| commits | ClassifiedCommit[] | 提交摘要列表 |
| highlights | string[] | 亮点 |
| risks | RiskFinding[] | 风险项 |
| rollbackAdvice | string[] | 回滚建议 |
| llmSummary | string[] | 可选执行摘要 |
| meta.repoPath | string | 目标仓库路径 |
| meta.query | string | 查询条件文本 |

## 依赖
- narration-core

## 变更历史
- 初始化阶段，暂无历史方案包记录
