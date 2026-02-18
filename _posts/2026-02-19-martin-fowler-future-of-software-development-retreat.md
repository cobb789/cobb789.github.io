---
layout: post
title: "Martin Fowler 的软件开发未来峰会：TDD 是最好的 Prompt Engineering"
date: 2026-02-19
author: Cobb
categories: [AI, 软件工程]
tags: [AI, LLM, TDD, Martin Fowler, 软件开发]
pin: false
---

Martin Fowler 和 Thoughtworks 刚刚举办了一场关于[软件开发未来](https://martinfowler.com/bliki/FutureOfSoftwareDevelopment.html)的闭门研讨会，参会者都是行业里最顶尖的工程领袖。昨天发布的总结让我读完之后很感慨——不是因为它给出了什么惊天结论，恰恰是因为**它诚实地说了"我们也不知道"**。

## 没人搞明白了

Annie Vella 在她的[回顾文章](https://annievella.com/posts/finding-comfort-in-the-uncertainty/)里写道：

> 我走进那个房间，期待从走在前面的人身上学到东西。结果发现——**没有人完全搞明白了**。

这才是当前 AI + 软件开发的真实状态。不管你是大厂还是创业公司，大家都在摸着石头过河。那些号称"AI 让开发效率提升 10 倍"的说法，至少在工程实践层面，还远没有被验证。

## 三个值得关注的观点

Thoughtworks 团队整理了一份 [17 页的 PDF 报告](https://www.thoughtworks.com/content/dam/thoughtworks/documents/report/tw_future%20_of_software_development_retreat_%20key_takeaways.pdf)，里面有八个主题，我挑三个最有意思的聊聊。

### 1. 监督工程中间环（Supervisory Engineering Middle Loop）

传统开发有"内环"（写代码-编译-测试）和"外环"（CI/CD-部署-监控）。AI 时代多了一个**中间环**——工程师不再逐行写代码，而是**审查和引导 AI 生成的代码**。

这意味着工程师的核心能力从"写代码"变成了"判断代码"。你需要更强的系统设计能力和代码审查能力，而不是更快的打字速度。

### 2. TDD 是最强的 Prompt Engineering

这是报告里我最喜欢的一个观点。与其费心去写完美的自然语言 prompt，不如**先写测试用例**。测试本身就是最精确的 spec——它告诉 AI "我要什么"，而且可以自动验证 AI 的输出是否正确。

这个观点其实很 Thoughtworks——他们一直是 TDD 的忠实拥护者。但在 AI 语境下，TDD 确实获得了新的生命力。**测试不再只是质量保障工具，它成了人机协作的接口。**

### 3. 风险分层（Risk Tiering）成为核心工程能力

不是所有代码都值得同等的审查力度。报告建议对 AI 生成的代码进行风险分层：低风险的样板代码可以快速通过，高风险的核心业务逻辑需要严格 review。

这让我想到我们在 [OfoxAI](https://ofox.ai) 做 AI Agent 产品时的经验——Agent 自动化程度越高，风险控制框架就越重要。不是限制 AI 做什么，而是明确**哪些事情需要人类把关**。

## 不确定性才是常态

这场峰会最大的价值不在于给出了答案，而在于它把行业最顶尖的人聚到一起，承认了一个事实：**我们正处于一个工具和实践都在剧烈变化的阶段，旧的方法在 AI 面前正在失效，新的方法还没成熟。**

但方向已经隐约可见：工程师的角色在向"监督者"和"架构师"演进，TDD 和风险管理正在变成 AI 时代最重要的工程实践。

与其焦虑"AI 会不会取代我"，不如想想怎么成为那个能判断 AI 输出好坏的人。这可能才是未来几年最值钱的技能。
