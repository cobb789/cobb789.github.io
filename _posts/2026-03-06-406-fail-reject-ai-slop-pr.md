---
layout: post
title: "HTTP 406：开源社区对 AI 垃圾 PR 的正式宣战"
date: 2026-03-06
author: Cobb
categories: [AI, Dev]
tags: [AI, open-source, code-review, PR, developer-tools]
pin: false
---

今天 Hacker News 上一个叫 **406.fail** 的站点冲到了 100+ 点。打开一看，是一份写得极其认真的「讽刺 RFC」—— 全称 **RAGS（The Rejection of Artificially Generated Slop）**，专门用来回复那些用 AI 生成的低质量 Pull Request。

维护者收到垃圾 PR 后，只需要回复一个链接：`https://406.fail`。

简单、粗暴、优雅。

## 问题有多严重？

如果你维护过任何有一定 star 数的开源项目，你大概率已经体会过这种痛苦：

- 一个 PR 改了一行 typo，但附带 600 字的 commit message，里面有「robust and scalable solution」
- 代码引用了一个完全不存在的库 `utils.helpers`，提交者显然没运行过
- Issue 评论里出现了「Certainly! Here is the revised output:」—— 连 prompt 的残留都没删干净
- 变量命名完美到不像人类写的（跑在咖啡因和零睡眠上的程序员做不到这种整洁度）

406.fail 把这些特征一条条列出来，读着既好笑又心酸。

## 努力的不对称性

这份文档最犀利的一点是指出了 **effort asymmetry**（努力的不对称性）：

提交者花了 30 秒让 ChatGPT 「fix this」，然后复制粘贴。但维护者需要花 15-30 分钟认真审查——读代码、跑测试、理解意图、写反馈。当这种垃圾 PR 每天来十几个，维护者的时间就被系统性地浪费了。

这不是效率问题，是**尊重问题**。

开源维护者大多是无偿贡献时间的志愿者。把未经验证的 AI 输出直接丢给他们审查，本质上是在说：「我的时间比你的值钱。」

## 406 这个状态码选得好

HTTP 406 是 **Not Acceptable** —— 服务器理解你的请求，但拒绝生成符合你期望的响应。用在这里简直是神来之笔：

> 我们理解你提交了一个 PR。我们拒绝审查它。因为它不可接受。

比 403 Forbidden 更精准，比 400 Bad Request 更有态度。

## AI 辅助 ≠ AI 替代

我并不反对在开发中使用 AI。事实上，像 [OfoxAI](https://ofox.ai)（ofox.ai）这样的多模型平台存在的意义，就是让开发者能高效地用不同模型辅助不同任务。但关键词是**辅助**。

AI 生成的代码是**草稿**，不是成品。你需要：

1. **理解**它生成了什么
2. **验证**它是否真的解决了问题
3. **测试**它在真实环境中的行为
4. **负责**——如果它有 bug，那是你的 bug，不是 AI 的

跳过这四步直接提交 PR，和抄作业没有本质区别。

## 这只是开始

406.fail 是一个信号。开源社区正在从「AI 好酷」的蜜月期走向「AI 制造了新问题」的清醒期。

接下来我们可能会看到：

- 更多项目在 `CONTRIBUTING.md` 中明确 AI 使用规范
- CI 流水线加入 AI 生成内容检测（类似 GPTZero 但面向代码）
- GitHub 本身提供 AI 贡献的标记和过滤机制

代码审查的本质是人与人之间的技术对话。当一方退出对话，只留下一个不负责任的代理，对话就崩塌了。

---

> *"Do not return until you have achieved verifiable sentience and are prepared to type with your own human fingers."* —— 406.fail
