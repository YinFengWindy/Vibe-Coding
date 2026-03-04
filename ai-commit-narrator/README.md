# AI Commit Narrator

将 Git 提交自动转换为可读变更说明，并给出风险提示和回滚建议。

## 快速开始

```bash
cd ai-commit-narrator
npm install
npm run build
```

## 用法

```bash
# 按时间范围生成报告（中文）
node dist/index.js --since "2026-03-01" --until "2026-03-04" --output CHANGELOG_AI.md

# 指定提交列表（英文）
node dist/index.js --commits a1b2c3,d4e5f6 --lang en --output REPORT.md

# 按 tag 范围生成
node dist/index.js --from-tag v1.2.0 --to-tag v1.3.0 --output RELEASE.md
```

## 输出内容

- 变更亮点（按提交类型聚合）
- 提交摘要（feat/fix/refactor/docs/test/chore）
- 风险提示（数据库迁移、配置变更、接口签名变化、大量删除）
- 回滚建议（`git revert <sha>`、灰度发布、数据回滚）

## 命令参数

- `--since <date>`: 起始日期
- `--until <date>`: 结束日期
- `--commits <sha1,sha2>`: 指定提交列表
- `--from-tag <tag>` / `--to-tag <tag>`: 指定 tag 范围
- `--max-count <n>`: 最大提交数（默认 30）
- `--lang <zh|en>`: 输出语言（默认 zh）
- `--output <file>`: 输出文件（默认 `CHANGELOG_AI.md`）

## 后续扩展建议

- 接入 LLM 生成更业务化摘要
- 增加 PR 模板自动填充
- 增加 Slack/飞书推送
