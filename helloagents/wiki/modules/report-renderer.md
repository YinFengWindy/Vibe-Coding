# Report Renderer 模块

## 目的
将结构化报告数据渲染为可归档、可分享的 Markdown 文档。

## 模块概述
- **职责:** 构建报告对象（生成时间、亮点、摘要、风险、回滚建议）并渲染文本。
- **状态:** 🚧开发中
- **最后更新:** 2026-03-04

## 规范

### 需求: 输出标准化 Markdown 报告
**模块:** report-renderer
保证报告结构固定，便于 PR/发布说明直接复用。

#### 场景: 有提交数据
存在匹配提交。
- 输出亮点、提交摘要、风险项、回滚建议四个核心章节
- 风险项包含等级与短 SHA

#### 场景: 无提交数据
查询范围无匹配提交。
- 输出空状态提示
- 保持报告章节结构不变

## API接口
### buildReport(commits, risks, rollbackAdvice, lang)
**描述:** 组装 `NarrationReport`
**输入:** 分类提交、风险、回滚建议、语言
**输出:** `NarrationReport`

### toMarkdown(report)
**描述:** 渲染 Markdown 文本
**输入:** `NarrationReport`
**输出:** markdown 字符串

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

## 依赖
- narration-core

## 变更历史
- 初始化阶段，暂无历史方案包记录

