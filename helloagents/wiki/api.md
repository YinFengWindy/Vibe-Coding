# API 手册

## 概述
项目包含两类接口：
- CLI 接口：命令行 `narrate`
- Web 接口：本地服务 `/api/narrate`

## 认证方式
- 本地模式无需认证
- 启用 `--with-llm` 时通过环境变量读取 API Key（默认 `OPENAI_API_KEY`）

---

## 接口列表

### CLI

#### [CLI] narrate
**描述:** 生成提交叙事报告（亮点、摘要、风险、回滚建议），并可选生成 LLM 执行摘要。

**关键参数:**
| 参数名 | 类型 | 说明 |
|--------|------|------|
| --repo | string | 目标仓库路径 |
| --since / --until | string | 时间范围 |
| --commits | string | 逗号分隔 SHA |
| --from-tag / --to-tag | string | tag 范围（需成对） |
| --format | enum(markdown/json/both) | 输出格式 |
| --with-llm | boolean | 启用 LLM 摘要 |

---

### Web

#### [GET] /
**描述:** 返回 Web UI 页面。

#### [POST] /api/narrate
**描述:** 接收表单参数并生成报告。

**请求参数:**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| repo | string | 否 | 仓库路径 |
| since | string | 否 | 起始时间 |
| until | string | 否 | 结束时间 |
| commits | string | 否 | 逗号分隔 SHA 列表 |
| fromTag | string | 否 | 起始 tag |
| toTag | string | 否 | 结束 tag |
| maxCount | number | 否 | 最大提交数 |
| lang | enum(zh/en) | 否 | 报告语言 |
| format | enum(markdown/json/both) | 否 | 输出格式 |
| withLlm | boolean | 否 | 启用 LLM 摘要 |
| llmModel | string | 否 | LLM 模型名 |

**响应:**
```json
{
  "ok": true,
  "summary": {
    "format": "both",
    "commits": 3,
    "risks": 2,
    "llmUsed": false
  },
  "markdown": "# AI 提交叙事报告 ...",
  "json": "{...}"
}
```

**错误码:**
| 错误码 | 说明 |
|--------|------|
| API-400 | 参数不合法或仓库不可访问 |
| API-500 | 内部异常 |

