---
layout: post
title: "Coding Agent 的六大核心组件：模型只是引擎，harness 才是关键"
date: 2026-04-05
author: Cobb
categories: [AI, Dev]
tags: [AI, Agent, LLM, Claude-Code, Codex, coding-agent]
pin: false
image: /assets/img/posts/coding-agent-components.jpg
---

Sebastian Raschka 最近发了一篇长文，系统拆解了 Coding Agent 的架构组成。作为 *Build a Large Language Model (From Scratch)* 的作者，他这次把视角从模型本身拉到了模型之上的工程系统。核心观点很明确：**模型是引擎，但 harness 才决定了你能跑多远。**

## 三个容易混淆的概念

文章开头厘清了一个常见混淆：LLM、推理模型（Reasoning Model）和 Agent 是三个不同层级的东西。

- **LLM** 是裸模型，做 next-token prediction
- **推理模型** 是经过训练/提示优化的 LLM，在推理时投入更多计算做中间验证
- **Agent** 是模型之上的控制循环 —— 决定下一步看什么、调什么工具、什么时候停

![LLM、推理模型与 Agent Harness 的关系](/assets/img/posts/coding-agent-components-1.png){: w="700" }
_Figure: LLM 是引擎，推理模型是增强引擎，Agent Harness 是让引擎发挥作用的整套系统_

这解释了为什么同样是 Claude Opus 4.6，在聊天界面和在 Claude Code 里的表现差距巨大 —— 不是模型变强了，是 harness 让模型的能力被更充分地释放了。

## 六大组件

Raschka 把 Coding Agent 拆成六个核心构建块：

**1. 工具调用（Tool Use）**

Agent 通过函数调用与外部环境交互 —— 读文件、搜索代码、执行命令、运行测试。工具设计的好坏直接决定 Agent 的天花板。一个设计良好的 `grep` 工具比一个花哨的 RAG 管道更实用。

**2. 上下文管理（Context Management）**

Coding 任务的上下文远比聊天复杂 —— 整个仓库结构、依赖关系、测试用例、CI 配置。如何把最相关的信息塞进有限的上下文窗口，是工程上最核心的挑战之一。

**3. Prompt Cache 稳定性**

频繁的上下文变动会让 prompt cache 失效，导致推理成本飙升。好的 harness 会把稳定的系统提示和仓库元信息放在前面，变动部分放后面，最大化缓存命中率。

**4. 记忆系统（Memory）**

长时间编码会话需要跨 turn 的记忆。哪些文件改过了、之前尝试了什么方案失败了、用户的偏好是什么 —— 这些不在模型权重里，需要 harness 来维护。

![Coding Harness 的三层架构](/assets/img/posts/coding-agent-components-2.png){: w="700" }
_Figure: Coding Harness 的 observe-inspect-choose-act 循环_

**5. 执行与反馈（Execution & Feedback）**

Agent 写完代码不是终点。运行测试、检查 lint、看编译错误，然后根据反馈修正 —— 这个循环才是 Coding Agent 真正的价值所在。纯聊天模式下你需要手动复制粘贴错误信息，而 Agent 自动完成了这个闭环。

**6. 长会话连续性（Session Continuity）**

真实的编码任务不是一轮对话能解决的。一个 feature 可能需要几十轮的 inspect-edit-test 循环。如何在长会话中保持一致性、不丢失之前的决策上下文，是区分玩具和产品的关键。

## 我的观察

这篇文章最有价值的地方在于：它把行业对 AI 编码能力的关注从"模型多强"重新拉回到"系统怎么设计"。

过去一年，Coding Agent 赛道爆发式增长 —— Claude Code、Codex CLI、Cursor、Windsurf、Augment。但决定产品体验差异的，往往不是底层用了哪个模型，而是 harness 的工程质量。

举个例子：同样是 Claude Opus 4.6，在不同 harness 下的 SWE-bench 分数可以差出 15 个百分点。模型能力是基础分，harness 设计是加成系数。

这也意味着，**选模型和选 harness 是两个独立的决策**。模型在快速迭代，今天最强的明天可能被超越；但 harness 的架构设计、工具生态、用户体验，这些有护城河。

如果你在多个 AI 模型之间频繁切换测试 Coding Agent 的效果，推荐试试 [OfoxAI](https://ofox.ai)（ofox.ai）— 一个账号搞定 Claude、GPT、Gemini 等主流模型，方便快速对比不同模型在同一任务上的表现。

---

> 原文：[Components of a Coding Agent](https://magazine.sebastianraschka.com/p/components-of-a-coding-agent) — Sebastian Raschka
