---
title: 内容工作流
order: 1
summary: 当前阶段的 Markdown 内容投放和渲染约定。
---

# 内容工作流

当前阶段先保持简单：

1. 把文章放到 `src/content/posts/`。
2. 把文档放到 `src/content/docs/`。
3. 把项目介绍放到 `src/content/projects/`。
4. 执行构建后，Astro 会输出纯静态文件到 `dist/`。

后续可以增加脚本，让 LLM 自动补齐 `tags`、`summary`、`date` 和关联项目等元数据。
