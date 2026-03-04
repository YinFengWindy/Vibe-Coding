# API 手册

## 概述
本项目为本地 CLI 工具，接口形态为命令行参数，不提供 HTTP API。

## 认证方式
不涉及远程认证；默认读取当前 Git 仓库本地信息。

---

## 接口列表

### CLI

#### [CLI] narrate
**描述:** 生成提交叙事报告（变更亮点、风险提示、回滚建议）。

**请求参数:**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| --since | string | 否 | 起始时间 |
| --until | string | 否 | 结束时间 |
| --commits | string | 否 | 逗号分隔提交 SHA 列表 |
| --from-tag | string | 否 | 起始 tag |
| --to-tag | string | 否 | 结束 tag |
| --max-count | number | 否 | 最大提交数，默认 30 |
| --lang | enum(zh/en) | 否 | 输出语言，默认 zh |
| --output | string | 否 | 输出文件路径，默认 `CHANGELOG_AI.md` |

**响应:**
```json
{
  "stdout": "报告已写入: CHANGELOG_AI.md\n提交数: 2, 风险项: 1"
}
```

**错误码:**
| 错误码 | 说明 |
|--------|------|
| CLI-001 | Git 命令执行失败 |
| CLI-002 | 参数不合法或组合无效 |

