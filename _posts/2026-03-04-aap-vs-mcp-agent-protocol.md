---
layout: post
title: "AAP vs MCP：AI Agent 通信协议的下一步在哪？"
date: 2026-03-04
author: Cobb
categories: [AI, Agent]
tags: [AAP, MCP, AI Agent, 协议, 开发者工具]
pin: false
image: /assets/img/posts/aap-vs-mcp-agent-protocol.jpg
---

MCP（Model Context Protocol）自 Anthropic 推出以来，迅速成为 AI Agent 与外部工具交互的事实标准。但今天 Hacker News 上出现了一个新项目——**Agent Action Protocol（AAP）**，开门见山地说：「MCP got us started, but is insufficient.」

这让我很感兴趣。MCP 到底哪里不够用了？AAP 又想解决什么问题？

## MCP 做对了什么

先给 MCP 一个公正的评价。它定义了一套标准化的方式，让 LLM 可以调用外部工具——读文件、查数据库、调 API。在 MCP 出现之前，每个 Agent 框架都在造自己的轮子，工具描述格式五花八门。MCP 统一了这一层，极大降低了工具集成的成本。

如果你只是构建「单个 Agent + 多个工具」的场景，MCP 基本够用了。

## 问题出在 Agent-to-Agent

但 2026 年的 AI 应用架构早已不是单 Agent 了。典型的生产级系统往往是多个 Agent 协作：一个负责规划，一个负责执行，一个负责审查，还有一个专门处理人机交互。

这时候 MCP 的局限就暴露了：

**1. 缺乏原生的 Agent 间通信**

MCP 的设计模型是 Client-Server：一个 LLM（Client）调用一个工具（Server）。Agent 之间要通信？你得把另一个 Agent 包装成"工具"，这不仅别扭，还丢失了很多语义——比如对方 Agent 的状态、能力描述、协商过程。

**2. 无状态的交互假设**

MCP 的每次调用是相对独立的。但 Agent 间协作往往需要维护上下文：任务分配、进度同步、结果反馈，这些需要有状态的会话机制。

**3. 缺少发现和协商**

在多 Agent 系统中，一个 Agent 需要能发现其他可用的 Agent，了解它们的能力，协商任务分配。MCP 没有提供这一层的抽象。

## AAP 的思路

AAP（Agent Action Protocol）试图在 MCP 的基础上补齐这些缺失：

- **Agent 作为一等公民**：不再把 Agent 伪装成工具，而是定义了 Agent 间的直接通信协议
- **基于 REST API 的消息传递**：降低实现门槛，任何能发 HTTP 请求的语言都能参与
- **能力声明与发现**：每个 Agent 可以声明自己能做什么，其他 Agent 可以查询和选择

从架构上看，AAP 和 MCP 不是替代关系，更像是不同层次的协议：MCP 解决 Agent-to-Tool，AAP 解决 Agent-to-Agent。

## 现实的挑战

思路是好的，但 AAP 面临几个现实问题：

**生态先发优势**。MCP 已经被 Cursor、Windsurf、Claude Desktop 等主流工具采用，网络效应很强。AAP 作为后来者，需要找到一个足够痛的切入点。

**复杂度与必要性的平衡**。并不是所有应用都需要多 Agent 协作。对于大多数开发者来说，单 Agent + 好工具就够了。AAP 需要证明它解决的问题足够普遍。

**标准之争的历史教训**。协议领域最怕的就是碎片化。如果 MCP 也在进化、也在加 Agent 间通信能力，那 AAP 的独立存在是否必要？

## 我的判断

多 Agent 协作是确定性的趋势，通信协议的标准化迟早要发生。但具体是 AAP 胜出、还是 MCP 自己扩展、还是出现第三种方案，现在判断还为时过早。

不过有一点是清楚的：**Agent 生态的复杂度在快速增加**。从单模型到多模型、从单 Agent 到多 Agent、从工具调用到 Agent 间协商——每一层复杂度的增加都需要对应的基础设施。对于开发者来说，在不同模型和 Agent 框架之间灵活切换的能力变得越来越重要。像 [OfoxAI](https://ofox.ai)（ofox.ai）这样的多模型聚合平台，本质上就是在底层解决多模型调度的问题，让开发者专注于上层的 Agent 逻辑设计。

值得持续关注的方向：MCP 的下一个版本会不会加入 Agent 间通信？AAP 能不能找到杀手级用例？以及，会不会有大厂直接下场定义标准？

2026 年的 Agent 基础设施，还远没有定型。

---

*素材来源：[Agent Action Protocol (AAP) - GitHub](https://github.com/agentactionprotocol/aap/)*
