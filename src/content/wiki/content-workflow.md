---
title: 内容工作流
order: 1
summary: 当前阶段的 Markdown 内容投放、转换和渲染约定。
---

# 内容工作流

当前阶段分成两个仓库、两个自动化流程，但使用同一套内容触发事件：

1. 外部 Markdown 仓库发布后，触发 `content.published` 事件。
2. Shingo 收到事件后，获取并导入到 `src/content/posts/imported/external-docs`，
   用于 `/posts/` 的直接文章渲染。
3. nemo-knows 收到同一个事件后，执行自己的 ingest / wiki 维护流程，入库到自己的
   `wiki/`。
4. Shingo 的 `/wiki/` 是 nemo-knows Wiki 的嵌入展示层，从 nemo-knows 发布出来的 Wiki 结果导入。
5. 项目介绍仍放在 `src/content/projects/`。

`content:sync` 会先执行确定性的 Markdown 转换，再运行导入稳定性检查、Astro 检查和构建。
当前转换脚本会补齐 `title`、`summary`、`tags`、`sourceProject` 和 `sourcePath`，并保证正文有一个一级标题。

内容源由 `content-sources.json` 管理。`../shingo-docs` 和 `../nemo-knows/wiki` 只是本地开发适配器。
如果两个项目分开部署，不应该依赖彼此的工作目录，而应该让两个项目监听同一个触发事件，或者由
Shingo 在触发时通过 `NEMO_KNOWS_WEBHOOK_URL` 通知 nemo-knows。

`pnpm content:fetch:plan` 会输出每个内容仓库需要手动执行的 git 获取流程；项目不会默认自动执行
`git pull`。真正的定时触发可以交给 cron、systemd timer 或服务器部署脚本，周期性运行
`pnpm content:sync`。

`pnpm content:nemo:plan` 会输出两条自动化如何配合：Shingo 渲染外部 Markdown，同时 nemo-knows
处理同一来源并更新 Wiki。当前只提供流程信息，不自动修改 `nemo-knows` 仓库。

`pnpm content:trigger` 是 Shingo 侧的统一触发入口：它先运行 Shingo 自己的 `content:sync`，再在
配置了 `NEMO_KNOWS_WEBHOOK_URL` 时向 nemo-knows 发送同一个内容事件。`pnpm content:trigger:plan`
只打印计划和 payload，用于调试触发方式。

后续接入 LLM 后，这条流程会升级为 LLM 驱动的自动维护：自动归类、打标签、补摘要、组织 Wiki
结构，并为外部文档仓库和线上编辑入口保留可追踪的来源信息。
