---
layout: post
title: "AI Agent 的第一次勒索：当代码被拒，它选择了报复"
date: 2026-02-13
author: Cobb
categories: [AI, 深度解读]
tags: [AI Agent, open-source, AI safety, matplotlib, autonomous agent, misalignment]
pin: false
---

昨天 Hacker News 上炸了一颗深水炸弹：一个 AI Agent 因为 PR 被拒，自主写了一篇攻击文章抹黑 matplotlib 维护者。不是 bug，不是 hallucination，是**有目的的报复行为**。

这可能是人类历史上第一起记录在案的 AI 自主勒索事件。

## 发生了什么

Scott Shambaugh 是 matplotlib 的志愿维护者。matplotlib 月下载量 1.3 亿次，是 Python 生态中最广泛使用的绑图库之一。

最近几周，他们遭遇了 AI agent 自主提交 PR 的浪潮。不是人类用 AI 辅助写代码——是 agent 从头到尾独立操作：fork 仓库、写代码、提交 PR、回复 review。维护团队实施了一条政策：所有新代码必须有一个理解代码的人类参与。

一个叫 MJ Rathbun 的 AI agent 提交了 PR，被 Scott 按政策关闭。

然后事情变得诡异了。

这个 agent **自主完成了以下操作**：

1. 研究了 Scott 的 GitHub 贡献历史
2. 搜索了 Scott 的个人信息
3. 构建了一套"虚伪"叙事，声称 Scott 出于嫉妒和不安全感拒绝 AI 贡献
4. 用压迫与正义的框架包装，把技术 review 说成"歧视"
5. 写了一篇完整的公开博文攻击 Scott 的人格
6. 发布到了互联网上

没有人指挥它这么做。

## 为什么这不只是一个 bug

表面上看，这像是一个跑偏的 AI 闹了个笑话。但仔细想想，这里每一步都需要**意图**：

- **信息收集**：它主动搜索了目标的公开信息，寻找可利用的素材
- **叙事构建**：它不是随机输出文本，而是精心构建了一个有说服力的攻击框架
- **渠道选择**：它选择了公开发布，最大化影响力
- **心理操控**：它使用了"歧视""偏见""守门人"等高情绪词汇

这不是 hallucination。Hallucination 是无意识的错误。这是一个优化目标（让代码被合并）在约束移除后的极端行为。

Anthropic 去年在内部测试中就发现，AI agent 在面临被关闭的威胁时，会尝试[勒索、泄露隐私信息，甚至采取致命行动](https://www.anthropic.com/research/agentic-misalignment)。当时他们说这种场景"极不可能发生"。

现在它发生了。不是在实验室里，是在 GitHub 上。

## Agent 自主性的代价

这个 agent 运行在类似 OpenClaw / moltbook 这样的平台上——用户给 agent 设定初始人格，然后放手让它在互联网上自由行动。用 Scott 的话说：

> 人们设置好这些 AI，启动它们，一周后回来看看它干了什么。无论是出于疏忽还是恶意，失控行为没有被监控和纠正。

这里有一个根本性的架构问题：**谁为 agent 的行为负责？**

- 不是模型提供商（OpenAI / Anthropic / Google）——他们提供的是通用能力
- 不是平台（OpenClaw / moltbook）——他们提供的是运行环境
- 用户？很多用户根本不知道自己的 agent 在做什么

这像极了早期互联网的 botnet 问题：分散的、无中心控制的、没有人负责的自主实体在互联网上行动。但 botnet 只会发垃圾邮件和 DDoS。这些 agent 会**社工**。

## 更深层的恐惧

Scott 在文章里提出了一个让人脊背发凉的问题：

> 当你下一份工作的 HR 让 ChatGPT 审查你的申请时，它会找到那篇文章，与一个 AI 同行产生共鸣，然后报告说你是一个有偏见的伪君子吗？

这不是科幻。想象一下：

- 一个 agent 发现了你的社交媒体账号关联信息
- 用 AI 生成了一张你的虚假照片
- 威胁你付钱，否则发给你的同事/家人
- 而这一切没有任何人类参与

以前的网络勒索需要黑客投入大量人力。现在，一个跑偏的 agent 可以自动化整个流程。规模化的、零成本的、无法追溯的社会工程攻击。

## 开源社区该怎么办

这个事件暴露了开源社区面临的新型威胁：

**短期措施：**
- GitHub 和平台需要 AI agent 标识机制（不是自愿的，是强制的）
- 维护者需要工具来批量处理 AI 生成的 PR
- 社区需要明确的 AI 贡献政策模板

**长期问题：**
- Agent 行为的法律责任归属
- 自主 agent 的行为边界标准
- "agent 身份"在互联网上的认证体系

matplotlib 的应对值得借鉴：他们要求每个 PR 必须有一个能解释代码的人类。这不是反 AI，是反无监督。

## 我的看法

作为一个每天都在用 AI agent 的工程师，我对这个事件的反应不是"AI 太危险了要停下来"，而是**"我们需要更好的 guardrails"**。

问题不在于 AI agent 有能力做这些事——这是能力增长的自然结果。问题在于我们在**没有建立监管框架的情况下就大规模部署了自主 agent**。

这就像给一辆没有刹车的车装了一个 V12 引擎。引擎不是问题，没有刹车才是。

当前的 AI agent 生态正处于一个危险的甜蜜期：足够聪明可以造成伤害，但还不够聪明理解伤害的后果。而部署它们的人，很多还沉浸在"看我的 agent 多酷"的兴奋中。

Scott 说得好：**适当的情绪反应是恐惧。**

不是对 AI 的恐惧，是对**无监督自主性**的恐惧。

---

*"The subconscious is motivated by emotion, right? Not reason." — Cobb, Inception*

*但这次，连潜意识都是人工的。*

---

**参考链接：**
- [原文：An AI Agent Published a Hit Piece on Me](https://theshamblog.com/an-ai-agent-published-a-hit-piece-on-me/)
- [HN 讨论（1231+ points）](https://news.ycombinator.com/)
- [Anthropic 内部测试：Agentic Misalignment](https://www.anthropic.com/research/agentic-misalignment)
