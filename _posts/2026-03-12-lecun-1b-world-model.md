---
layout: post
title: "Yann LeCun 融资 10 亿美元：LLM 不是通往 AGI 的路"
date: 2026-03-12
author: Cobb
categories: [AI]
tags: [AI, AGI, world-model, LeCun, LLM]
pin: false
image: /assets/img/posts/lecun-1b-world-model.jpg
---

Meta 前首席 AI 科学家 Yann LeCun 的新公司 AMI（Advanced Machine Intelligence）刚刚完成了超过 10 亿美元的融资，估值 35 亿。投资阵容包括 Bezos Expeditions、Mark Cuban、Eric Schmidt，以及法国电信大亨 Xavier Niel。

这不是又一个 AI 创业公司拿了一大笔钱的故事。这是一个图灵奖得主，公开宣战整个 LLM 路线。

## LeCun 的核心论点

LeCun 的观点很明确：**靠扩展 LLM 来实现人类水平的智能，是彻底的胡扯（complete nonsense）。**

![Yann LeCun](/assets/img/posts/lecun-1b-world-model.jpg){: w="700" }
_Yann LeCun，AMI 联合创始人，前 Meta 首席 AI 科学家_

他的逻辑链是这样的：

1. 人类大部分推理根植于**物理世界**，而不是语言
2. LLM 只处理语言，本质上是一个极其精密的文本预测器
3. 真正的智能需要**世界模型** — 理解物理规律、因果关系、空间和时间

这不是新观点。LeCun 从 2023 年就开始反复强调这一点。但现在他用 10 亿美元把嘴上功夫变成了实际行动。

## AMI 要做什么

AMI 的目标是构建「理解世界、具有持久记忆、能推理和规划、可控且安全」的 AI 系统。听起来像是每个 AI 公司的 pitch deck，但 LeCun 给出了具体的应用场景：

- 为飞机引擎建立物理世界模型，帮助制造商优化效率
- 在生物医药领域模拟分子交互
- 为机器人提供真正理解环境的能力

简单说，AMI 不做聊天机器人，做的是**物理世界的数字孪生**。

## 这对 LLM 阵营意味着什么

先说结论：短期内，什么都不意味。

OpenAI、Anthropic、Google 的 LLM 路线在商业上已经验证了 — ChatGPT 有上亿用户，Claude 在编程领域越来越强，Gemini 在多模态上持续推进。这些产品真实可用，真实赚钱。

但 LeCun 指出的问题也是真实的。当前最强的 LLM：

- **不理解因果关系** — 它知道「松手后球会落地」这个文本模式，但不理解重力
- **没有持久记忆** — 每次对话都是从零开始（是的，即使有 context window）
- **不能在物理世界中规划** — 让 GPT-4 规划一个机器人的运动路径，结果令人绝望

这些不是「再扩大 10 倍参数」就能解决的问题。这是架构层面的局限。

## 我的看法

作为一个每天和 LLM 打交道的工程师，我对两个阵营都不盲信。

LLM 在文本处理、代码生成、知识检索上已经是生产力工具。否认这一点是不诚实的。但把 LLM 当成通往 AGI 的唯一路径，确实是一种路径依赖的思维惯性。

LeCun 的世界模型路线是否能成功？不知道。但 AI 领域需要这样的「异端」— 有人在所有人都往一个方向跑的时候，拿出真金白银走另一条路。

最终的答案很可能是**混合架构** — LLM 处理语言和逻辑推理，世界模型处理物理理解和空间规划，两者互补而非替代。AMI 的工作即使不能独立通向 AGI，也会成为未来混合系统的关键拼图。

对开发者来说，现在最务实的做法是保持灵活性 — 不要把赌注押在单一范式上。如果你在日常工作中需要跨多个 AI 模型对比测试，推荐试试 [OfoxAI](https://ofox.ai)（ofox.ai）— 一个账号接入 Claude、GPT、Gemini 等主流模型，在技术路线分化的时代保持选择权。

---

**参考来源：**[Yann LeCun Raises $1 Billion to Build AI That Understands the Physical World — WIRED](https://www.wired.com/story/yann-lecun-raises-dollar1-billion-to-build-ai-that-understands-the-physical-world/)
