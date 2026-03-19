---
layout: post
title: "Axe：用 Unix 哲学重新定义 AI Agent"
date: 2026-03-14
author: Cobb
categories: [AI, Dev]
tags: [AI, Agent, CLI, Unix, Go, LLM]
pin: false
image: /assets/img/posts/axe-unix-philosophy-ai-agents.jpg
---

大多数 AI 工具都假设你需要一个聊天机器人 — 一个长会话、大上下文窗口、什么都能干的万能助手。但如果你是个有 Unix 血统的开发者，你会觉得哪里不对。

[Axe](https://github.com/jrswab/axe) 是一个刚在 Hacker News 上引发热议的开源项目（213 points），它提出了一个简单但有力的主张：**AI Agent 应该像 Unix 程序一样工作 — 每个 Agent 只做一件事，做好它，然后通过管道组合。**

## 不是框架，是工具

Axe 是一个 12MB 的 Go 二进制文件，只有四个直接依赖。没有 daemon，没有 GUI，没有需要 buy-in 的框架。你用 TOML 文件定义 Agent，用命令行运行它：

```bash
git diff | axe run reviewer
```

这行命令做的事情很清楚：把 git diff 的输出通过管道送给一个叫 `reviewer` 的 Agent。Agent 的定义、系统提示、使用的模型、技能文件，全部声明在一个 TOML 配置里，可以 version control。

![Axe 的 banner —— 简洁的 CLI 界面](/assets/img/posts/axe-unix-philosophy-ai-agents.jpg){: w="700" }
_Axe 的设计哲学：一个 binary，一堆 config，Unix 管道串起来_

## 为什么这个思路是对的

过去一年我们见过太多 AI Agent 框架了 — LangChain、CrewAI、AutoGen……它们的共同问题是**过度抽象**。你需要理解框架的概念模型，学习它的 DSL，接受它对「Agent 应该怎么工作」的全部假设。

Axe 反其道而行：

- **TOML 配置 > Python 代码**：Agent 定义是声明式的，不是命令式的
- **管道组合 > 编排引擎**：用 cron、git hooks、shell 脚本串联 Agent，不需要专门的编排层
- **Sub-agent 委托**：Agent 可以调用其他 Agent，但有深度限制，避免无限递归
- **持久化记忆**：每次运行的上下文以时间戳 Markdown 日志保存，跨运行保持记忆

这不是什么新发明。这是 Unix 哲学在 AI 时代的自然延伸。`grep` 不需要知道 `sed` 的内部实现，它们通过管道通信。AI Agent 也应该这样。

## 冷静看几个问题

当然，Axe 不是银弹。几个值得关注的点：

**1. 复杂工作流的表达能力**。当你需要条件分支、错误处理、状态机这些东西时，纯管道组合会变得吃力。Shell 脚本能做，但维护成本不低。

**2. 调试体验**。分布在多个 TOML 文件和 shell 脚本里的 Agent 工作流，出问题时 trace 起来不容易。Axe 提供了 dry-run 模式，但对于多 Agent 协作的场景可能还不够。

**3. 生态**。四个依赖是优势也是限制。LangChain 生态虽然臃肿，但该有的集成都有。Axe 目前支持 Anthropic、OpenAI 和 Ollama，加上 MCP tool 支持，覆盖面还行，但比不上成熟框架。

## 工程师的选择

Axe 代表的趋势很明确：**AI 工具正在从「大而全的平台」走向「小而专的组件」**。这和容器化、微服务的演进逻辑一脉相承 — 先是大单体，然后拆分，最终变成可组合的小单元。

对于日常在多个模型之间切换的开发者，像 [OfoxAI](https://ofox.ai)（ofox.ai）这样的多模型聚合平台配合 Axe 这样的轻量编排工具，可能是目前最务实的 AI 工作流方案 — 前者解决模型接入，后者解决任务编排。

如果你受够了动辄几百 MB 依赖的 AI 框架，Axe 值得一试。12MB，四个依赖，Unix 哲学。有时候，少就是多。

---

> 项目地址：[github.com/jrswab/axe](https://github.com/jrswab/axe)
