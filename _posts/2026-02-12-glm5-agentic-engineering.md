---
layout: post
title: "GLM-5 发布解读：从 Vibe Coding 到 Agentic Engineering"
date: 2026-02-12
author: Cobb
categories: [AI, 深度解读]
tags: [GLM-5, 智谱AI, Z.ai, MiniMax, 中国AI, Agentic Engineering, LLM]
pin: false
---

今晚 AI 圈同时发生了两件事：智谱 AI 发布 GLM-5，MiniMax 发布 M2.5。两家中国公司，同一天，都在 coding agent 方向下了重注。

但真正引爆 Hacker News 的是 GLM-5。168 points，154+ 条评论，流量暴涨 10 倍导致紧急扩容——这种待遇，对一个中国模型来说并不常见。

我想聊聊这件事背后的信号。

## "From Vibe Coding to Agentic Engineering"

智谱给 GLM-5 选的标语值得玩味。

"Vibe Coding" 是 Andrej Karpathy 去年造的词，本意是"让 AI 写代码，你负责感觉对不对"。这个概念迅速流行，也迅速被滥用——很多人理解成了"不用动脑，全交给 AI"。

智谱用 "From Vibe Coding to Agentic Engineering" 做定位，表达的意思很明确：**Vibe Coding 是上一个阶段，我们要进入下一个阶段——AI 不只是写代码，而是做工程。**

这个野心不小。同时也暗示了 GLM-5 的核心卖点不是单纯的代码生成能力，而是在复杂工程任务中的 agent 能力——理解需求、分解任务、跨文件协作、迭代修复。

更值得注意的是它的对标对象。智谱在发布页面上直接拿 Claude Opus 4.5 做比较，完全没提 Sonnet。这说明他们把自己定位在旗舰级——不是做性价比替代品，而是要正面挑战最强的。

## 定价：对标旗舰，价格 1/15

先看数字：

| 模型 | Input (per 1M tokens) | Output (per 1M tokens) |
|------|----------------------|------------------------|
| GLM-5 | $1 | $3.2 |
| GLM-5-Code | $1.2 | $5 |
| GLM-4.7 | $0.6 | $2.2 |
| Claude Opus 4.5 | ~$15 | ~$75 |
| GPT-4o | ~$5 | ~$15 |

GLM-5 的 Output 价格是 Claude Opus 4.5 的 **1/23**，Input 是 **1/15**。即使和 GPT-4o 比，也只有三分之一到五分之一。

再加上 Cached Input 的大幅折扣和限时免费的 Storage，实际使用成本还能再低一截。

这个定价策略可以有两种解读：

**乐观版：** 智谱在算力成本和推理效率上有显著优势，能以极低价格提供旗舰级能力。中国 AI 公司在工程化和成本控制上确实有一套，这从 DeepSeek 时代就开始显现了。

**谨慎版：** 价格差距太大，要么能力还有差距（对标 Opus 是营销策略），要么在以低价换市场份额。毕竟 Opus 4.5 贵成那样还有大量付费用户，说明在某些场景下它确实值那个价。

我倾向于认为真相在中间——GLM-5 大概率在部分场景下已经接近 Opus 级别（比如中文理解、特定编程任务），但在最复杂的推理和长上下文场景下可能还有差距。不过以这个价格，它不需要完全追平 Opus，只要达到 80% 的能力，就已经是大量应用场景的最优选。

**一句话：这个价格让"用旗舰模型做 agent"从烧钱变成了可持续。**

## Hacker News 的真实反馈

HN 评论区的反应很有意思，我挑几条有代表性的：

**"Soft launch 的味道。"** GLM-5 最初上线时甚至没有官方博客公告，是开发者在 API 列表里发现的。后来补了 z.ai/blog/glm-5。这种发布方式在 HN 上反而被解读为"务实"——先让产品说话，不搞发布会造势。

**"Dramatically cheaper。"** 价格确实是讨论最多的点。不少开发者表示会把 GLM-5 加入 API rotation，至少在对成本敏感的场景下试用。

**"GLM-4.7 的 instruction following 很烂。"** 这是最尖锐的批评。有开发者反馈上一代 GLM-4.7 在复杂指令跟随上表现不佳，对 GLM-5 持观望态度。这很公平——模型的迭代不是线性的，上一代的短板不代表下一代也有，但信任需要重新建立。

**Distillation 痕迹。** 有人注意到 GLM-5 的输出有 emdash（—）的过度使用和 "not X, but Y" 的固定句式，这是从 GPT/Claude 蒸馏的典型特征。虽然不影响功能，但在开发者社区里是个扣分项——它暗示模型的部分能力可能来自模仿而非原创。

**没有 ARC-AGI 成绩，没有开源。** GLM-5 目前只能通过 chat.z.ai 使用，没有 HuggingFace 模型，也没有公布 ARC-AGI 等通用推理 benchmark。对于习惯了透明度的开源社区来说，这是一个不够加分的选择。

**Lite/Pro plan 不含 GLM-5。** 现有订阅用户需要额外付费 API 调用才能使用 GLM-5，这让一些早期支持者感到不满。定价策略和用户分层的矛盾，每家都会遇到。

总体来说，HN 社区的态度是：**好奇但审慎，愿意试但不急着下结论。** 这其实是最健康的反应。

## MiniMax M2.5：同一天的另一个信号

同日发布的 MiniMax M2.5 没有 GLM-5 那么大的声量（HN 25 points），但同样值得关注。

MiniMax 的前一版 M2.1 已经是一个不错的 coding model：多语言编程覆盖 Rust、Java、Go、C++、TypeScript 等，支持 WebDev 和 AppDev 场景，Interleaved Thinking，benchmark 接近 Claude Sonnet 4.5。更重要的是，M2.1 已经被 Cline、Roo Code、Kilo Code、BlackBox 等主流 coding agent 集成——这意味着它不只是 benchmark 上的数字，而是有真实的开发者生态。

M2.5 在这个基础上继续迭代，通过 agent.minimax.io 提供服务。

两家中国 AI 公司在同一天发布 coding 方向的旗舰模型，这不是巧合，而是趋势：**中国 AI 在 coding agent 赛道上正在集体加速。** 从 DeepSeek 的 reasoning 能力，到 GLM-5 的 agentic engineering 定位，到 MiniMax 的 agent 框架兼容——这条线正在变得越来越清晰。

## 对 AI 平台意味着什么

对于做 AI 平台的团队来说（比如我们做的 OfoxAI），GLM-5 和 M2.5 的发布是好消息。

**模型供应链更丰富了。** 以前做 agent 平台，模型选择基本就是 Claude、GPT、少量开源模型。现在 GLM-5 以 Opus 1/15 的价格提供旗舰级能力，MiniMax 被主流 agent 框架集成，模型的可选项突然多了很多。

**成本结构变了。** 当旗舰级模型的 API 价格降到这个水平，很多之前"技术上可行但经济上不划算"的 agent 场景变得可以做了。比如：让 agent 在代码审查中跑多轮 reasoning、在 CI/CD 管道中做自动化质量检查、甚至做持续的代码库健康监控——这些场景以前用 Opus 的价格想都不敢想。

**多模型路由成了刚需。** 不同模型在不同场景下表现各异。GLM-5 可能在中文理解和性价比场景上最优，Claude 在复杂推理上最强，MiniMax 在多语言编程上有优势。一个好的 AI 平台需要根据任务类型自动选择最合适的模型——这不再是"有则更好"的功能，而是核心竞争力。

## 冷静一下

说完好的，泼点冷水。

GLM-5 目前还没有经过大规模的真实场景验证。HN 上的讨论大多基于 API 试用和 benchmark 数字，而不是几个月的深度使用。我在之前 GPT-5.3-Codex 的文章里说过：**benchmark 和真实世界之间有一道鸿沟。** 这话对 GLM-5 同样适用。

蒸馏痕迹的问题不是小事。如果模型的部分能力高度依赖从其他模型蒸馏得来的知识，那在原创推理和 edge case 处理上可能会有系统性弱点。这需要时间来检验。

没有开源也意味着社区无法审计模型的安全性和可靠性。对于想在生产环境中使用 GLM-5 的团队，这是一个需要慎重考虑的因素。

## 结论

GLM-5 的发布不是一个简单的"又一个中国模型"的故事。它的意义在于：

1. **定位野心**——直接对标 Opus 旗舰级，不做性价比模型的故事
2. **价格重定义**——让旗舰级 agent 能力的成本降了一个数量级
3. **生态信号**——和 MiniMax M2.5 一起，标志着中国 AI 在 coding agent 方向的集体突破

"From Vibe Coding to Agentic Engineering" 这句话能不能兑现，取决于 GLM-5 在真实工程场景中的表现。但至少，智谱用这个定位为自己画了一条很高的线。

对开发者来说，最实际的建议是：**把 GLM-5 加入你的模型工具箱，在真实项目中跑一跑，用代码而不是 benchmark 来评判它。** 以它的价格，试错成本几乎可以忽略不计。

AI coding agent 的军备竞赛还在加速。2026 年，好模型的可选项比以往任何时候都多。作为用模型的人，这是最好的局面。
