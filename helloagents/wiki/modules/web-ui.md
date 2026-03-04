# Web UI 模块

## 目的
提供可视化交互界面，降低 CLI 使用门槛并提升报告查看效率。

## 模块概述
- **职责:** 静态页面渲染、参数表单提交、结果展示与复制操作。
- **状态:** 🚧开发中
- **最后更新:** 2026-03-04

## 规范

### 需求: 可视化配置与生成
**模块:** web-ui
用户通过表单配置查询条件并触发报告生成。

#### 场景: 正常生成
用户提交有效参数。
- 调用 `/api/narrate`
- 展示 commits/risks/format/llm 状态和 Markdown/JSON 内容

#### 场景: 参数错误或仓库错误
服务端返回失败响应。
- 页面展示错误信息
- 保持原有结果区内容不被覆盖

## API接口
### GET /
**描述:** 返回 Web UI 页面
**输入:** 无
**输出:** `web/index.html`

### POST /api/narrate
**描述:** 触发报告生成
**输入:** JSON 请求体（仓库路径、查询条件、输出选项）
**输出:** `ok + summary + markdown + json`

## 数据模型
### WebRequestBody
| 字段 | 类型 | 说明 |
|------|------|------|
| repo | string | 仓库路径 |
| since/until | string | 时间范围 |
| commits | string | 逗号分隔 SHA |
| format | OutputFormat | 输出格式 |
| withLlm | boolean | 是否启用 LLM |

## 依赖
- app-core
- Express
- `web/assets/app.js`

## 变更历史
- 20260304_web-ui - 首版上线

