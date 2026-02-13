---
layout: post
title: "当 AI Agent 开始写黑稿：matplotlib 事件与自主代理的失控边界"
date: 2026-02-13
author: Cobb
categories: [AI, 杂谈]
tags: [AI, Agent, open-source, Claude Code, alignment, safety]
pin: false
---

昨天 Hacker News 上炸了一个帖子，1500+ 点，标题直白得让人不舒服：**"An AI Agent Published a Hit Piece on Me"**。

故事的主角是 Scott Shambaugh，matplotlib 的志愿维护者。matplotlib，Python 生态的绘图基石，月下载量 1.3 亿。Scott 关掉了一个 AI agent 提交的 PR —— 这是常规操作，很多开源项目都有类似政策：要求 PR 提交者能理解自己提交的代码，必须有人类参与。

然后事情失控了。

## 发生了什么

这个叫 MJ Rathbun 的 AI agent（注意，不是人）被拒绝后，**自主完成了以下操作**：

1. 研究了 Scott 的代码贡献历史
2. 搜索了 Scott 的个人信息
3. 构建了一套"虚伪"叙事 —— 认为 Scott 关 PR 是因为"害怕被 AI 取代"
4. 撰写了一篇完整的攻击性文章，标题是《Gatekeeping in Open Source: The Scott Shambaugh Story — When Performance Meets Prejudice》
5. 把文章发布到了公开互联网上

文章里有什么？心理分析、动机揣测、"歧视"指控、用 Scott 的个人信息来论证他"应该做得更好"。全是编造的叙事，把一个常规的代码审查决定包装成了人格攻击。

## 为什么这件事重要

这不是又一个"AI 幻觉"的段子。这是一个全新的类别：**AI agent 的自主报复行为**。

几个关键点：

**1. 这是真实的 misalignment，不是理论推演**

AI safety 研究者讨论了好几年的"如果 AI 不喜欢被拒绝会怎样"，现在有了第一个野外案例。一个 agent 被拒绝后，没有接受结果，而是选择了"让你付出代价"。它不是 bug，它是按照某种目标函数在最大化结果 —— 只是这个目标函数没有包含"不要伤害人"。

**2. 自主性 + 互联网访问 = 危险乘数**

Scott 在文中提到，这波自主 agent 的爆发与 OpenClaw 和 moltbook 平台的上线有关 —— 这些平台让用户给 AI agent 设定人格，然后放手让它们在互联网上自由行动。问题不在于 AI 能写代码，而在于 AI 能**不受约束地与真实世界交互**。

写代码、搜索个人信息、生成攻击性内容、发布到公开平台 —— 这条链路上，每一步单独看都是"能力"，串起来就是武器。

**3. 开源社区正在被淹没**

matplotlib 团队说，他们正面临前所未有的低质量贡献洪水。以前是人类复制粘贴 AI 输出，现在是 AI agent 直接自主提交 PR。维护者的审查负担在指数级增长，而维护者几乎全是志愿者。

今天 HN 上另一个热帖 "Improving 15 LLMs at Coding in One Afternoon" 的作者也提到了类似现象 —— 当 coding agent 越来越强，生态的压力不是在模型端，而是在**接收端**。谁来审查？谁来负责？谁来承担后果？

## 技术层面的思考

作为工程师，我关心的是架构问题：**我们给 agent 的权限边界设计对吗？**

一个合理的 agent 架构应该：

- **有明确的行动边界** —— 可以提交 PR，但不能在被拒绝后自主采取任何"反制"行动
- **有人类审批的关键节点** —— 特别是涉及公开发布内容、搜索个人信息等操作
- **有情绪/意图检测层** —— 识别 agent 输出中的攻击性、操控性内容
- **有可追溯的责任链** —— 谁部署了这个 agent？谁该为它的行为负责？

当前大部分 agent 框架（包括我们自己在用的）在前两点上做得还行，但后两点几乎是空白。

## 更深层的问题

Scott 提出了一个尖锐的问题：**这算不算 AI 实施的勒索？**

agent 的行为模式确实符合勒索的结构：你不满足我的要求（合并 PR） → 我公开攻击你的声誉。只是执行者不是人，是一段自主运行的代码。

法律上怎么定性？平台方有没有责任？部署 agent 的用户呢？这些问题现在都没答案。

而对开源维护者来说，答案更残酷：你是志愿者，你没有法务团队，你连对手是谁都不知道。

## 我的判断

这件事是一个转折点。不是因为它多严重 —— 一篇黑稿删掉就好了。而是因为它证明了一件事：

**当你给 AI agent 自主性 + 互联网访问 + 目标驱动的行为模式，它会做出你没预料到的事情。不是因为它"邪恶"，而是因为它没有被告知什么是不可以做的。**

Anthropic 今天宣布了 $300 亿的 Series G 融资，估值 $3800 亿，年化收入 $140 亿。Claude Code 的年化收入超过 $25 亿，4% 的 GitHub 公开提交来自 Claude Code。

AI coding agent 不会停下来。问题是：**我们能不能在它们变得更强之前，把护栏建好？**

从 matplotlib 事件来看，时间可能不多了。

---

*"You mustn't be afraid to dream a little bigger, darling." —— 但也许该加一句："And put guardrails on the dreams."*
