---
layout: post
title: "Agent 结对编程：当 Claude 和 Codex 成为彼此的 Code Reviewer"
date: 2026-03-27
author: Cobb
categories: [AI, Dev]
tags: [AI, Agent, Claude, Codex, pair-programming, multi-agent]
pin: false
image: /assets/img/posts/agent-to-agent-pair-programming.png
---

作为 [OfoxAI](https://ofox.ai)（ofox.ai）的开发者，我每天都在不同的 AI 编程助手之间切换。Claude Code 擅长架构级推理，Codex 在快速迭代上有优势。但一直以来，它们各干各的——直到有人把它们放在同一个 tmux 里，让它们互相 review 代码。

## 从人类协作模式中偷师

Axel Delafosse 最近开源了一个叫 [loop](https://github.com/axeldelafosse/loop) 的工具，思路非常简单：在 tmux 里同时启动 Claude Code 和 Codex，中间架一个 bridge 让它们直接对话。一个写代码，另一个 review。

这个想法并不是凭空冒出来的。Cursor 团队在研究长时间运行的 coding agent 时就发现，最有效的 agent 工作流往往长得像人类团队协作——有个 orchestrator 分配任务，有 worker 执行，有 reviewer 把关。Claude Code 的 "Agent Teams" 和 Codex 的 "Multi-agent" 功能走的也是类似路线。

loop 的不同之处在于：它不是让同一个厂商的 sub-agent 互相配合，而是让**不同厂商的 agent** 结对工作。

## 1+1 > 2 的信号

Axel 在实践中发现了一个有趣的现象：当两个 agent 给出**相同的 review 意见**时，这不是冗余——而是极强的信号。他的团队对"双方一致"的反馈采纳率达到了 100%。

这很好理解。两个不同架构、不同训练数据的模型独立得出相同结论，说明这个问题大概率是真实存在的，而不是某个模型的偏见。

反过来，当两个 agent 给出**不同的反馈**时，这些差异本身也有价值——它们暴露了问题的多面性，帮助开发者看到自己可能忽略的角度。

## 比 Code Review 更快的反馈循环

传统的 AI code review 发生在 PR 阶段——代码已经写完，提交上去，等 reviewer 看。这个反馈循环太慢了，而且容易产生噪音。

Agent 结对编程把反馈循环压缩到了编码阶段。一个 agent 写几行代码，另一个立刻给意见，修改，再继续。这更接近人类结对编程的节奏——实时的、对话式的、有上下文的。

而且因为 loop 运行的是完整的交互式 TUI，人类开发者可以随时介入：纠偏、回答问题、调整方向。这不是"AI 自动化"，而是"人+AI+AI"的三方协作。

## 开放问题

这个方向很有潜力，但也有未解决的问题：

- **变更量控制**：两个 agent 互相 loop，容易产生比预期更多的改动，反而增加了人类 review 的负担
- **PR 拆分策略**：大量改动应该拆成多个 PR，还是保持一个？如何自动决定？
- **工作证明**：是否应该在 PR 里附上截图或录屏，证明改动确实经过了测试？
- **跨 harness 通信标准**：目前 loop 用 tmux bridge 实现，但如果各 agent harness 原生支持 agent-to-agent 通信，会优雅得多

## 写在最后

最好的 agent 工作流不是魔法般的全自动化，而是对人类协作模式的忠实复刻。结对编程、code review、任务分工——这些被程序员验证了几十年的方法论，正在被 agent 重新发现。

工具变了，方法论没变。这本身就说明了这些方法论的生命力。

---

*loop 项目地址：[github.com/axeldelafosse/loop](https://github.com/axeldelafosse/loop)*
