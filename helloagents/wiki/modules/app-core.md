# App Core 模块

## 目的
提供 CLI 与 Web 共用的应用层能力，避免重复实现业务流程。

## 模块概述
- **职责:** 参数校验、请求规范化、流程编排、报告产物输出。
- **状态:** 🚧开发中
- **最后更新:** 2026-03-04

## 规范

### 需求: 单一执行入口
**模块:** app-core
通过 `runNarration` 统一执行采集、分类、风险、摘要、渲染与文件写入。

#### 场景: CLI 调用
CLI 解析后的参数传入应用层。
- 应用层返回执行摘要与报告内容
- CLI 仅负责展示终端输出

#### 场景: Web API 调用
Web 服务接收请求体并调用应用层。
- 统一输出 JSON 结果结构
- 报告写入 `web-output/` 目录

## API接口
### validateRequest(input)
**描述:** 校验请求参数组合
**输入:** NarrateRequest
**输出:** 无（异常时抛错）

### runNarration(input)
**描述:** 统一执行叙事报告流程
**输入:** NarrateRequest
**输出:** NarrateResult

## 数据模型
### NarrateResult.outputSummary
| 字段 | 类型 | 说明 |
|------|------|------|
| format | OutputFormat | 输出格式 |
| commits | number | 提交数量 |
| risks | number | 风险数量 |
| llmUsed | boolean | 是否成功生成 LLM 摘要 |

## 依赖
- git-reader
- narration-core
- report-renderer

## 变更历史
- 20260304_web-ui - 引入共用应用层并替换 CLI 直连逻辑

