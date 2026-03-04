# CLI 模块

## 目的
作为命令行入口，负责参数解析、流程调度和结果输出。

## 模块概述
- **职责:** 解析命令参数，按顺序调用 Git 读取、分类、风险检测与报告渲染模块。
- **状态:** 🚧开发中
- **最后更新:** 2026-03-04

## 规范

### 需求: 命令行生成叙事报告
**模块:** cli
根据用户输入的查询条件（时间、tag、SHA）生成结构化报告，支持 Markdown 与 JSON。

#### 场景: 指定时间范围生成报告
用户传入 `--since` 与 `--until` 参数。
- 解析参数并查询匹配提交
- 输出报告文件并打印提交数与风险数

#### 场景: 指定提交列表生成报告
用户传入 `--commits` 参数。
- 跳过时间查询，直接处理目标提交
- 按输出语言生成对应报告内容

#### 场景: 启用 LLM 执行摘要
用户传入 `--with-llm` 且 API Key 可用。
- 调用兼容 Chat Completions 的接口生成 3-5 条摘要
- 请求失败时降级为纯规则报告，不阻塞主流程

## API接口
### CLI narrate
**描述:** 报告生成入口命令
**输入:** 命令参数（仓库路径、提交查询、语言、格式、LLM选项）
**输出:** 终端统计信息 + Markdown/JSON 报告文件

## 数据模型
### CliOptions
| 字段 | 类型 | 说明 |
|------|------|------|
| since | string | 可选起始日期 |
| until | string | 可选结束日期 |
| commits | string[] | 可选提交列表 |
| lang | "zh" \| "en" | 报告语言 |
| format | "markdown" \| "json" \| "both" | 输出格式 |
| output | string | Markdown 输出路径 |
| jsonOutput | string | JSON 输出路径 |
| withLlm | boolean | 是否启用 LLM |

## 依赖
- app-core
- git-reader
- narration-core
- report-renderer

## 变更历史
- 初始化阶段，暂无历史方案包记录
