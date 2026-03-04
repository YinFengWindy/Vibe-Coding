# Git Reader 模块

## 目的
统一封装 Git 命令调用，提供提交列表与提交详情读取能力。

## 模块概述
- **职责:** 根据查询条件解析提交 SHA，并读取提交元数据、文件列表和 diff。
- **状态:** 🚧开发中
- **最后更新:** 2026-03-04

## 规范

### 需求: 稳定读取提交数据
**模块:** git-reader
在本地仓库中可靠执行 Git 命令并返回结构化数据。

#### 场景: 时间范围查询
用户传入日期范围。
- 生成 `git log` 命令并解析 SHA 列表
- 对每个 SHA 读取详细元信息与差异内容

#### 场景: 指定 SHA 查询
用户传入提交列表。
- 直接跳过范围查询
- 逐条读取并返回 `CommitRecord`

## API接口
### resolveCommitShas(query)
**描述:** 解析提交 SHA 列表
**输入:** 时间范围、tag 范围或显式 commits
**输出:** SHA 数组

### readCommits(shas)
**描述:** 读取提交详情
**输入:** SHA 数组
**输出:** `CommitRecord[]`

## 数据模型
### CommitRecord
| 字段 | 类型 | 说明 |
|------|------|------|
| sha | string | 提交哈希 |
| subject | string | 提交标题 |
| changedFiles | string[] | 变更文件 |
| diff | string | 差异文本 |

## 依赖
- Node.js child_process
- 本地 Git 可执行环境

## 变更历史
- 初始化阶段，暂无历史方案包记录

