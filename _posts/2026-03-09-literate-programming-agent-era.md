---
layout: post
title: "文学编程的复活：AI Agent 时代的代码叙事"
date: 2026-03-09
author: Cobb
categories: [AI, Dev]
tags: [AI, Agent, LLM, literate-programming, coding, Emacs]
pin: false
image: /assets/img/posts/literate-programming-agent-era.png
---

Knuth 在 1984 年提出"文学编程"（Literate Programming）：代码应该像散文一样可读，程序员写的不是给编译器看的指令，而是给人看的叙事。

好想法。没人用。

原因很简单 — 维护两套叙事（代码 + 散文）的成本太高了。你改了一行代码，还得同步更新解释文字。现实中，注释都懒得写，何况写散文。Jupyter Notebook 算是最接近的实践，但也仅限于数据科学领域。

但今天 HN 上一篇 230+ 赞的文章让我重新想了想这件事：**AI Agent 把文学编程的核心障碍消除了。**

## 维护成本归零

文学编程之所以不流行，核心瓶颈是"双重维护"。代码变了，散文要跟着变；散文改了意图，代码要跟着改。人手动做这件事，痛苦且低效。

但 Agent 不怕重复劳动。

你改了代码，让 Agent 更新解释。你改了意图描述，让 Agent 重写实现。两套叙事的同步成本从"人工维护"变成了"一次 prompt"。Agent 最擅长的事情恰恰是翻译和总结 — 这正是文学编程需要的核心能力。

## 读代码比写代码更重要

这个趋势已经很明显了：**工程师的角色正在从"写代码"转向"读代码、审代码"。**

当 Agent 一天能产出几千行代码时，瓶颈不再是生产速度，而是人类的理解速度。一个可以像叙事一样阅读的代码库，价值不言而喻。

原文作者的工作流很有意思：让 Agent 用 Org Mode 写测试 runbook，散文解释每一步的意图，代码块可以交互执行。Review 时你读的是故事，不是指令序列。执行完成后，结果自动嵌入文档，就像 Jupyter Notebook。

## 实际的局限

说说问题。

**格式绑定。** 目前最成熟的文学编程环境是 Emacs Org Mode — 这本身就是最大的采用障碍。Org Mode 功能强大（属性、元数据、多语言代码块），但被 Emacs 绑死了。Markdown 太简单，缺少元数据能力；Org Mode 太 Emacs，缺少生态。

**规模问题。** 小项目、测试 runbook、配置文件 — 文学编程很合适。但一个几十万行的代码库能不能用文学编程组织？这还没有人验证过。代码的"源文件"变成了文学文档，实际代码变成了"编译产物" — 这个心智模型转换不小。

**Agent 幻觉。** 让 Agent 解释代码意图，它可能编造一个听起来合理但不正确的解释。你读着散文觉得"说得通"，但代码其实做的是另一件事。文学编程的可读性反而可能成为一种"可信度陷阱"。

## 一个值得关注的方向

尽管有这些问题，我认为文学编程在 Agent 时代值得重新审视。

核心逻辑是这样的：AI Agent 消除了文学编程最大的障碍（维护成本），同时放大了它最大的优势（可读性）。当代码越来越多由 Agent 生成时，"代码能被人读懂"这件事的价值只会越来越高。

不一定是 Org Mode，不一定是 Knuth 的原始愿景，但某种形式的"代码 + 叙事"组合，可能会成为 Agent 时代的标配。

现在我们已经在用 `AGENTS.md`、`CLAUDE.md` 这类文件给 Agent 提供上下文了 — 某种程度上，这就是文学编程的雏形：用散文指导代码生成。只是方向反过来了。

当你在不同模型之间切换去验证这些想法时，像 [OfoxAI](https://ofox.ai)（ofox.ai）这样的多模型聚合平台让试错成本几乎为零 — Claude 擅长理解代码结构，Gemini 擅长长上下文，选对工具才能验证对方向。

---

**参考：** [We Should Revisit Literate Programming in the Agent Era](https://silly.business/blog/we-should-revisit-literate-programming-in-the-agent-era/) (HN 230+ points)
