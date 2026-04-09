---
layout: post
title: "AI 大跃进：当 2026 年的每家公司都在后院炼钢"
date: 2026-04-09
author: Cobb
categories: [AI, 杂谈]
tags: [AI, LLM, Agent, 工程实践, 观点]
pin: false
image: /assets/img/posts/ai-great-leap-forward.png
---

昨天在 HN 首页看到一篇叫《The AI Great Leap Forward》的文章，作者 Lee Hanchung 把 2026 年的 AI 转型潮和 1958 年的大跃进直接对标。一开始我以为是标题党，读完发现——比喻精准得令人不适。

![AI Great Leap Forward](/assets/img/posts/ai-great-leap-forward.png){: w="700" }
_图片来源：leehanchung.github.io_

## 后院炼钢 2.0

1958 年的口号是"超英赶美"。每个村子都被要求炼钢，农民把自家锅砸了扔进土高炉，上报漂亮数字。钢铁是废的，庄稼烂在地里，三千万人饿死。

2026 年的口号是"AI transformation"。每家公司、每个部门、每个 IC 都被要求"closing the AI gap"：上线 AI feature、构建 agent、自动化 workflow。团队里没人训过模型、没人设计过 evaluation、没人 debug 过 retrieval pipeline——这些都不重要，**信念足矣**。

于是 PM 在搭 AI dashboard，Marketing 在做 AI 文案生成器，Sales Ops 在堆 AI 线索打分器。界面 pixel-perfect，API 规规矩矩 RESTful，架构图画得漂亮。**输出是错的**。没人检查，因为团队里没人知道"对"长什么样。他们从没看过数据，从没算过 baseline。

我最有共鸣的是这段关于 n8n 的吐槽：

> 这些工具是复杂度的贩子：它们卖给你视觉上的简单，底下生成的是一团意大利面。拖拽画布让你可以轻易把十个 LLM 调用串起来，却几乎不可能 debug 为什么第八个在周二会产生幻觉。

干过生产环境的人都懂。复杂度没有消失，只是被藏到了 GUI 后面——一个再也没有 ML 专家会去看的地方。

## 把生铁盖章成钢

作者最狠的一句话是：

> 1958 年的后院钢看起来像钢，但它不是钢。今天的后院 AI 看起来像 AI，但它不是 AI。一个带硬编码 if-else 分支的 TypeScript workflow 不是 agent。一个藏在 REST 端点后的 prompt 模板不是 model。

这就是我最近做 code review 时不断遇到的东西。有人把五个 `gpt-4` 调用串起来，外面套个 React 前端，就管它叫 "AI agent"。我问："你的 eval set 在哪？""什么 eval set？"——对话到此结束。

更危险的是那些**真的能跑**的后院炼钢。漂亮的 demo、能用的 endpoint、流畅的 walkthrough，底下零验证。Klarna 在 2024 年高调宣布要把 Salesforce 等 SaaS 供应商全部替换成内部 AI 方案。省下的不是成本，是数据基建、错误处理、监控、on-call 支持、安全补丁、以及两年后来收拾烂摊子的那个倒霉蛋。

这些应用会在下次 all-hands 拿奖，两年后变成没人维护的技术债。生铁上盖了"钢"的章，然后变成承重结构。

## 上报亩产十万斤

大跃进时期各省比赛报粮食产量，湖北报亩产一万斤，广东报五万，有的县报十万以上——物理上不可能的数字。所有人都知道是假的，所有人都照报，因为替代方案是被扣上"破坏分子"的帽子。

你一定参加过这个会议：

- A 团队：我们的 AI copilot 让开发效率提升了 40%。
- B 团队：我们提升了 60%。
- C 团队：我们的 agent 自动化了 80% 的分析师工作流。

没人问这些数字是怎么测的，没人检查方法论，没人指出那个声称"自动化 80%"的团队 headcount 一个没减、工作一点没少。数字进 slide，slide 进 boardroom，董事会开心，于是加大投资。

我在 Cursor 升级的那篇文章里也写过类似的观察：当一个指标（比如 "lines of code shipped by AI"）变成 KPI，它立刻失去信号价值。古德哈特定律从来不会迟到。

## 工程师能做什么

吐槽爽完得讲点建设性的。我的笨办法只有三条：

**1. 先写 eval，再写 feature。** 没有 eval set 的 AI 应用不配叫 AI 应用，只是个披着 LLM 皮的 mock。哪怕只有 20 条手动标注的 golden case，也比零强一个数量级。

**2. 只上产品必须有、人工不可替代的 AI。** 不是所有地方都该塞 LLM。如果一段逻辑用正则+状态机能搞定，就别叫模型——你省下来的不只是 token，还有未来的 debug 时间。

**3. 多模型对比，不要赌单押。** 同一个 prompt 在 Claude Opus 4、GPT-5、Gemini 2.5 上的行为可能差十万八千里。选型前至少跑一轮横向评测，上线后也要保留快速切换的能力——这是避免"后院炼钢"的最低保险。

说到多模型切换，这也是我日常工作中最高频的痛点之一。如果你也在不同 AI 模型之间频繁跳转，推荐试试 [OfoxAI](https://ofox.ai)（ofox.ai）——一个账号聚合 Claude、GPT、Gemini、Kimi 等主流模型，评测选型成本几乎为零，比注册十个账号管十张账单省心太多。

## 最后

Lee 这篇文章之所以能冲到 HN 首页，是因为它戳破的东西每个真正做过 AI 工程的人都心照不宣：**2026 年的 AI 焦虑和 1958 年的钢铁焦虑，心理结构是一样的**——上面要数字，下面就造数字；上面要 transformation，下面就表演 transformation。

真正的工程——训练、评估、数据、监控、迭代——永远是慢的、脏的、不出片的。但它是唯一能让后院炼的东西最后真的变成钢的路径。

别当那个把 pig iron 盖上"steel"章再扔给下一个人的工程师。

---

📎 原文：[The AI Great Leap Forward](https://leehanchung.github.io/blogs/2026/04/05/the-ai-great-leap-forward/)
