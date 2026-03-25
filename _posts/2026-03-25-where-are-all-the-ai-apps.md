---
layout: post
title: "AI 让程序员效率翻倍？数据说：并没有"
date: 2026-03-25
author: Cobb
categories: [AI, Dev]
tags: [AI, productivity, vibecoding, pypi, data-analysis]
pin: false
image: /assets/img/posts/where-are-all-the-ai-apps.png
---

Answer.AI 最近发了一篇数据驱动的文章，标题很直白：**So where are all the AI apps?**

问题很简单 —— 如果 AI 编程工具真的让开发者效率提升了 2 倍、10 倍甚至 100 倍，那这些多出来的产出去哪了？

## PyPI 的数据不说谎

他们选了 PyPI（Python 包仓库）作为观测指标。逻辑很清晰：如果软件生产力真的爆发了，最大的公共代码仓库应该能看到明显的拐点。

结果呢？

![PyPI 包创建趋势](/assets/img/posts/where-are-all-the-ai-apps-1.png){: w="700" }
_PyPI 新包数量变化 —— ChatGPT 发布后并没有出现明显拐点_

**ChatGPT 发布前后，新包创建速度几乎没有变化。** 那些偶尔的尖峰？是垃圾包和恶意软件造成的，不是真正的生产力爆发。

更有意思的是包更新频率的分析。他们追踪了 PyPI 下载量前 15000 的「真实」包，按出生年份分组看更新节奏。确实，近年出生的包更新更频繁 —— 但这个趋势从 2019 年就开始了，早于任何 AI 编码工具。更可能的原因是 GitHub Actions 等 CI 工具的普及。

## AI 产出的其实是……更多 AI 项目

当他们把数据按「是否跟 AI 相关」切分后，真相浮出水面：

![AI vs 非 AI 包发布频率对比](/assets/img/posts/where-are-all-the-ai-apps-2.png){: w="700" }
_AI 相关的包发布激增，而非 AI 包几乎没有变化_

**非 AI 包的更新节奏跟 ChatGPT 之前几乎一样。** 真正爆发的只有 AI 相关的包 —— AI wrapper、agent 框架、模型工具链。

换句话说，AI 生产力工具带来的不是「更多软件」，而是「更多 AI 软件」。这个市场在自己给自己造轮子。

## 我的看法

这篇文章的数据很扎实，但结论需要加一个上下文：**PyPI 包数量不等于软件产出量。**

AI 编码工具改变的不是「新建项目」的频率，而是「在现有项目里写代码」的效率。用 Cursor 或 Claude Code 写一个功能，以前要一天，现在可能半天。这种效率提升不会反映在 PyPI 的新包数量上。

另一个被忽略的维度是 —— AI 编程降低了门槛。很多 vibecoding 产出根本不是 PyPI 包，而是一次性的脚本、小工具、个人项目、内部系统。这些东西永远不会出现在公共统计里。

但文章的核心观察我是认同的：**AI 生产力的溢出效应，目前主要还在 AI 自身的生态内循环。** 真正的 killer app —— 那个让普通人觉得「没有 AI 之前做不到」的应用 —— 还没出现。

至少，PyPI 是这么说的。

---

如果你在多个 AI 模型之间频繁切换做开发，推荐试试 [OfoxAI](https://ofox.ai)（ofox.ai）— 一个账号搞定 Claude、GPT、Gemini 等主流模型。
