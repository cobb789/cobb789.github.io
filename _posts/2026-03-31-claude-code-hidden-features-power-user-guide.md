---
layout: post
title: "Claude Code 15 个隐藏功能：从手机写代码到并行跑几十个 Agent（译+解读）"
date: 2026-03-31
author: Cobb
categories: [AI, Dev]
tags: [Claude, Claude Code, Anthropic, AI Coding, Agent, 生产力]
pin: false
---

> **原文出处：** Boris Cherny（[@bcherny](https://x.com/bcherny)，Claude Code 创始人）在 X/Twitter 发布的长推文，2026 年 3 月 30 日。
> **原文链接：** [https://x.com/bcherny/status/2038454336355999749](https://x.com/bcherny/status/2038454336355999749)
> **翻译 & 解读：** Cobb @ OfoxAI Lab

---

Claude Code 的创始人 Boris Cherny 昨天分享了一条炸裂的推文 —— 15 个他日常使用的 Claude Code 隐藏功能，发布不到 24 小时就拿到了 **2 万+ 点赞、4.7 万+ 收藏**。

这些不是"你可能不知道的快捷键"级别的 tips。这是 **Claude Code 核心团队自己是怎么用这个工具的** —— 用手机写代码、跨设备迁移 session、让 Agent 24/7 自动跑 code review、并行几十个 Claude 同时工作。

下面是完整的 15 个功能，加上我的实战解读。

---

## 1. 手机 App 写代码

Claude 的 iOS/Android App 里有一个 **Code 标签页**，可以直接连接 Claude Code session。Boris 说他很多代码是在手机上写的。

**怎么用：** 下载 Claude App → 左侧菜单 → Code 标签页。

> **Cobb 解读：** 这不是噱头。当你有一个长时间运行的 Agent 在跑任务，用手机随时看进度、给指令，比打开笔记本快多了。通勤路上改 bug 不再是梦。

## 2. 跨设备迁移 Session

在手机/网页/桌面和终端之间**无缝切换同一个 session**。

- `claude --teleport` 或 `/teleport`：把云端 session 拉到本地终端继续
- `/remote-control`：从手机/网页远程控制本地 CLI session

**怎么用：** Boris 建议在设置里开启 "Enable Remote Control"，这样任何设备都能接管。

> **Cobb 解读：** 这是真正的"编程不受设备限制"。在公司用终端开了个复杂的 session，回家后直接手机接管继续。比 SSH 优雅十倍。

## 3. /loop 和 /schedule —— 让 Agent 自动循环跑

两个最强大的功能：

- `/loop 5m /babysit`：每 5 分钟自动跑一次 babysit，处理 code review、自动 rebase
- `/schedule`：定时执行任务，最长可以跑**一周**

Boris 自己跑的 loop 包括：每 5 分钟自动处理 code review、自动 rebase、自动修复小 regression。

> **Cobb 解读：** 这才是 Agent 的正确打开方式。不是等你手动输入 prompt，而是让它**像一个值夜班的同事**一样持续工作。配合 Hooks 使用效果拉满。评论区有人说 /loop 让他在一台 Mac Mini 上跑 5 个产品的自动化管理——这不是未来，这是现在。

## 4. Hooks —— Agent 生命周期中的确定性钩子

Hooks 让你在 Agent 的生命周期中**注入自己的逻辑**：

- **SessionStart**：每次启动时自动加载上下文（比如 AGENTS.md、MEMORY.md）
- **PreToolUse**：在模型执行 bash 命令前先跑你的逻辑（日志、安全检查）
- **权限路由**：把权限确认请求发到 WhatsApp，手机上点一下就批准

> **Cobb 解读：** Hooks 是让 Claude Code 从"聊天机器人"变成"真正的 Agent"的关键。评论区有人说得好：SessionStart Hook 加载组织级别的上下文（客户问题、决策历史、架构约束），Agent 每次醒来就有完整记忆，代码质量天壤之别。

## 5. Cowork Dispatch —— 远程操控桌面 App

Dispatch 是 Claude Desktop App 的**安全远程控制**。可以用你的 MCP、浏览器，在不在电脑旁时也能处理工作。

Boris 说他不写代码的时候就在用 Dispatch —— 处理 Slack、邮件、管理文件。

> **Cobb 解读：** Dispatch 把 Claude Code 从"编程工具"扩展到了"个人工作助手"。想象一下：出门在外，用手机让 Claude 帮你回 Slack、整理文件、查邮件。这不是科幻片了。

## 6. Chrome 扩展 —— 前端开发的利器

Chrome 扩展让 Claude 能**直接看到你的网页**并自主迭代。

Boris 说关键原则是：**给 Claude 一种验证自己输出的方式**。就像你不会让工程师闭着眼睛写前端一样，给 Claude 浏览器访问权，它就能自己检查渲染结果、自己修 bug、自己迭代到满意。

> **Cobb 解读：** 这是一个被严重低估的功能。以前 AI 写前端代码全靠"盲猜"，现在它能看到自己写的页面长什么样。闭环反馈 = 质量飞升。

## 7. Desktop App 自动启动和测试 Web 服务器

Claude Desktop App 内置了**自动运行 web server + 内置浏览器测试**的能力。

在 CLI 里也可以通过配置实现类似效果，但 Desktop App 开箱即用。

> **Cobb 解读：** 全栈开发者的福音。不用手动 `npm run dev` 然后切浏览器看效果，Claude 自己启动服务、自己打开浏览器、自己测试。

## 8. 分叉 Session

两种方式分叉（fork）一个已有的 session：

1. 在 session 里运行 `/branch`
2. 从 CLI 运行 `claude --resume <session-id> --fork-session`

> **Cobb 解读：** 当你的 session 走到一个分叉点——比如你想同时尝试两个不同方案——直接 fork 一份出来。不用从头开始，保留完整上下文。这是版本控制思维在 AI session 上的体现。

## 9. /btw —— 不打断 Agent 的侧面提问

当 Agent 正在埋头工作时，用 `/btw` 可以问一个快速问题，**不会打断当前任务**。

> **Cobb 解读：** 非常实用的小功能。Agent 在跑一个大任务，你突然想问个不相关的问题，以前只能等或者开新 session。现在直接 `/btw 这个 API 的参数是什么？` 就行。

## 10. Git Worktrees —— 并行开发的基础设施

Claude Code 对 **git worktrees** 有深度集成。Boris 说他同时跑**几十个 Claude**，靠的就是 worktrees。

**怎么用：** `claude -w` 启动一个新 session 并自动在新的 worktree 里工作。

> **Cobb 解读：** 这是实现"一个人 = 一个团队"的核心基础设施。每个 worktree 是一个独立的工作目录，每个 Claude 在自己的目录里干活，互不干扰。没有 worktrees 就没法并行。

## 11. /batch —— 扇出大规模变更

`/batch` 会先采访你了解需求，然后**自动扇出任务到几十甚至上千个 worktree Agent** 并行处理。

适用场景：大规模代码迁移、批量重构、任何可以并行化的工作。

> **Cobb 解读：** 这才是真正让人兴奋的功能。一个人做大规模 migration？以前需要一个团队干一周的事，现在 /batch 扇出 100 个 Agent 并行跑，几小时搞定。这不是线性提升，是量级提升。

## 12. --bare —— SDK 启动加速 10 倍

默认情况下 `claude -p` 会搜索本地的 CLAUDE.md、settings、MCPs。用 `--bare` 跳过这些，启动速度提升最多 **10 倍**。

适用于非交互式调用（SDK、脚本、CI/CD 集成）。

> **Cobb 解读：** 如果你在写自动化脚本频繁调用 Claude，这个 flag 必加。省掉的不是几秒钟，是每次调用都节省的累积时间。

## 13. --add-dir —— 跨仓库工作

`--add-dir`（或 `/add-dir`）让 Claude 能访问多个文件夹。

**怎么用：** 在 repo A 启动 Claude，然后 `--add-dir ../repo-b` 让它同时看到 repo B 的代码。这不仅让 Claude 能读，还给了它写权限。

> **Cobb 解读：** 微服务架构或 monorepo 之外的多仓库项目，这个功能是刚需。改一个 API 需要同时改 client 和 server？一个 session 搞定。

## 14. --agent —— 自定义 Agent 的系统 Prompt 和工具

在 `.claude/agents` 目录下定义你的 agent，然后 `claude --agent=<name>` 启动。

每个 agent 可以有自己的**系统 prompt、工具集、行为模式**。

> **Cobb 解读：** 这是 Claude Code 的"模块化"能力。你可以有一个专门做 code review 的 agent、一个专门写测试的 agent、一个专门做部署的 agent，各司其职。配合 /loop 和 worktrees，你就有了一个完整的自动化开发团队。

## 15. /voice —— 语音输入

Boris 说他**大部分代码都是说出来的，而不是打出来的**。

- CLI 里运行 `/voice`，然后按住空格键说话
- Desktop App 有语音按钮
- iOS 可以开启系统级听写

> **Cobb 解读：** 结合手机 App + 语音输入，你可以**走在路上就把代码写了**。这听起来离谱，但 Boris 确实在这样做。语音到代码的路径已经打通了。

---

## 总结：Claude Code 不是你以为的样子

这 15 个功能揭示了一个事实：**Claude Code 已经远不是一个 AI 编程助手了**。它是一个完整的 Agent 平台：

- 📱 **多端协同**：手机、网页、桌面、终端无缝切换
- 🔄 **自动化循环**：/loop + /schedule = 永不下班的 AI 同事
- 🪝 **可编程钩子**：Hooks 让你在 Agent 的每个环节注入自定义逻辑
- ⚡ **并行扩展**：Worktrees + /batch = 一个人当一个团队用
- 🎤 **自然交互**：语音输入 + 手机操控 = 编程不再需要坐在电脑前

评论区的一条评论说得好：*"大部分人还在像用自动补全一样用 Claude Code。而真正的差距，在于'知道它存在'和'像 Boris 这样使用它'之间。这不是写得更快的区别——是做完全不同的事的区别。"*

那条推文 4.7 万收藏说明了一切。这不是热度，是恐慌性收藏——人们怕自己落后了。

---

> 📖 **原文推文：** [Boris Cherny (@bcherny) — Claude Code Hidden Features](https://x.com/bcherny/status/2038454336355999749)
>
> 🔗 **OfoxAI — 你的 AI 开发伙伴：** [https://ofox.ai/zh?utm_source=blog&utm_medium=post&utm_campaign=claude_code_tips](https://ofox.ai/zh?utm_source=blog&utm_medium=post&utm_campaign=claude_code_tips)
