---
layout: post
title: "用 Swift 从零构建 Coding Agent：当苹果生态遇上 AI 编程"
date: 2026-03-26
author: Cobb
categories: [AI, Dev]
tags: [swift, coding-agent, claude, apple, llm]
pin: false
image: /assets/img/posts/swift-coding-agent.jpg
---

一个开发者用 Swift 从零实现了一个类 Claude Code 的 coding agent。不是调 SDK，不是套壳，是从 API 调用、工具注册、对话循环到文件操作，全部用 Swift 原生实现。

这个项目叫 [swift-claude-code](https://github.com/ivan-magda/swift-claude-code)，昨天在 Hacker News 上拿了 86 分。看完源码，我觉得它的价值不在于替代 Claude Code，而在于展示了一件事：**构建一个能用的 coding agent，核心逻辑并不复杂。**

## 架构拆解

整个 agent 的核心是一个经典的 ReAct 循环：

1. 用户输入 → 拼装 system prompt + 历史消息
2. 调用 Claude API（Anthropic Swift SDK）
3. 模型返回 tool_use → agent 执行对应工具（读文件、写文件、运行命令等）
4. 工具结果塞回对话 → 继续循环，直到模型给出最终回答

![swift-claude-code 运行演示](/assets/img/posts/swift-coding-agent-1.gif){: w="700" }
_swift-claude-code 终端交互演示_

工具注册用了 Swift 的协议（Protocol），每个工具实现 `Tool` 协议就能被 agent 调用。这个设计干净利落 —— 加新工具只需要写一个 struct，不用改主循环。

## 为什么是 Swift？

表面看，Python 才是 AI 应用的"正确"语言。但作者选 Swift 有几个实际理由：

**原生 macOS 集成。** Swift 可以直接调 AppKit、Foundation，意味着 agent 能无缝操作系统级功能 —— 文件系统、进程管理、甚至 Xcode 集成。Python 要做到这些需要一堆胶水代码。

**类型安全。** 工具定义、API 响应解析、消息结构全部有类型约束。当你的 agent 需要处理模型返回的各种 edge case 时，编译器帮你挡掉一大类运行时错误。

**性能。** Agent 的瓶颈在网络 I/O 不在计算，但 Swift 的并发模型（async/await + structured concurrency）处理多工具并发执行天然比 Python 优雅。

## 对开发者的启发

这个项目最大的意义是去神秘化。很多人觉得 coding agent 是一个巨复杂的系统 —— 需要 RAG、需要 memory、需要 planning。但实际上，一个能用的 MVP 就是：

- 一个好的 system prompt
- 几个文件操作工具
- 一个 shell 执行工具
- 一个对话循环

**500 行代码就够了。**

当然，从"能用"到"好用"的距离是巨大的。Claude Code、Cursor、Windsurf 这些产品在错误恢复、上下文管理、多文件协调上做了大量工程。但这不妨碍我们从一个最小实现开始理解 agent 的本质。

## 苹果生态的 AI 缺口

Swift coding agent 还暴露了一个有趣的生态缺口：**macOS/iOS 开发者缺少原生的 AI 开发工具链。**

Python 有 LangChain、LlamaIndex、Semantic Kernel。Swift 有什么？几乎没有。如果苹果认真对待 on-device AI（他们确实在做），Swift AI 框架的生态建设迟早是必须面对的课题。

这个项目可能是一个信号：开发者已经等不及了，开始自己造轮子。

---

AI coding agent 的技术门槛在快速降低，真正的差异化在于对开发者工作流的深度理解。如果你想在不同模型之间快速切换来测试自己的 agent 方案，推荐试试 [OfoxAI](https://ofox.ai)（ofox.ai）—— 一个账号接入 Claude、GPT、Gemini 等主流模型，省去多平台来回切换的麻烦。
