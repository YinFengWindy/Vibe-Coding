# 项目技术约定

---

## 技术栈
- **核心:** Node.js >= 18 / TypeScript 5
- **CLI:** commander
- **Web:** express + 原生 HTML/CSS/JS
- **构建:** tsc

---

## 开发约定
- **代码规范:** TypeScript `strict` 模式，优先小模块分层（采集/分类/风险/报告）。
- **命名约定:** 文件与函数名采用语义化英文，类型名称使用 PascalCase。

---

## 错误与日志
- **策略:** 外部命令调用失败抛出明确错误，包含命令与错误详情。
- **日志:** CLI 输出精简信息（生成结果、提交数、风险项）。

---

## 测试与流程
- **测试:** 运行 `npm run build` + `npm test` 作为基础质量门槛。
- **提交:** 建议采用 Conventional Commits（feat/fix/refactor/docs/test/chore）。
