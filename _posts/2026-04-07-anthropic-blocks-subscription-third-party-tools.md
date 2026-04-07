---
layout: post
title: "Anthropic 切了第三方工具的口粮：Claude 订阅不再覆盖 OpenClaw 们"
date: 2026-04-07
author: Cobb
categories: [AI, 杂谈]
tags: [Anthropic, Claude, OpenClaw, AI Agent, 订阅]
pin: false
---

> **事件时间：** 2026 年 4 月 4 日 12:00 PT
> **来源：** Anthropic 官方公告 / Boris Cherny X 推文 / VentureBeat 报道
> **解读：** Cobb @ OfoxAI Lab

---

一句话版本：**从 4 月 4 日起，你不能再用 Claude Pro/Max 订阅去喂 OpenClaw 这类第三方 Agent 工具了。** 想继续用？要么切到 API 按 token 付费，要么买"额外用量"加油包。

## 发生了什么

Anthropic 的 Claude Code 负责人 Boris Cherny 在 X 上甩出公告：Pro（$20/月）和 Max（$100-$200/月）订阅，**不再覆盖通过 OAuth token 接入第三方 agentic 工具的用法**。

官方理由很直白：

> "我们一直在努力满足 Claude 不断增长的需求，但订阅服务的设计初衷不是为了支撑这些第三方工具的使用模式。算力是我们必须谨慎管理的资源，我们要优先服务使用我们自己产品和 API 的客户。"

翻译一下：你们这帮人开着 OpenClaw 24 小时跑 Agent，把我家服务器烧穿了，这买卖做不下去了。

## 技术上为什么不可持续

Cherny 给的解释很有意思 —— 不是单纯的"算力不够"，而是 **prompt cache 命中率**。

Anthropic 自家的 Claude Code、Claude Cowork 这些工具，是按照"最大化 prompt cache 命中率"来设计的 —— 同样的 system prompt、同样的上下文段，可以复用之前缓存好的计算结果，省下大量推理算力。

而第三方 harness（比如 OpenClaw）通常绕过这些优化，每次都是冷启动。结果就是：

- Anthropic 自家工具：每个 token 的实际成本可能只有标价的 30%
- 第三方工具：每个 token 都按完整成本算

订阅价是按"自家工具+优化"算的。让第三方工具吃订阅 = Anthropic 在每个用户身上贴钱。

成长营销人 Aakash Gupta 在 X 上算了一笔账：**一个 OpenClaw Agent 跑一天，能烧 $1000 到 $5000 的 API 成本。** Anthropic 在每个走第三方 harness 的用户身上都在补贴这个差价。

> "这是一家眼睁睁看着自己利润率实时蒸发的公司的节奏。"

## 补偿方案

Anthropic 也不是完全不讲武德，给了几个台阶下：

| 补偿 | 内容 |
|------|------|
| **一次性 Credit** | 等额于你月费的余额，4 月 17 日前可用 |
| **预购折扣** | 提前买"额外用量"包，最高 30% 折扣 |
| **API 通道** | 任何人都可以走 API 按 token 付费，无限制 |

## 社区怎么看

两种声音：

**理性接受派**：算账派承认，订阅模式本来就不是为了让你 24/7 跑无人值守 Agent 的。免费午餐结束，市场该回归理性。

**阴谋论派**：OpenClaw 创始人 Peter Steinberger（最近刚被 OpenAI 挖走）发了个意味深长的推文：

> "时间点很有意思。先把一些流行功能抄进自家闭源 harness，然后把开源的锁在门外。"

确实，Anthropic 最近在 Claude Code 里加了不少 OpenClaw 早就有的功能 —— 比如通过外部服务给 Agent 发消息这种。

## 这对我们意味着什么

如果你是：

- **Claude Pro/Max 订阅用户 + OpenClaw 重度使用者**：4 月 4 日起，你的工作流断了。要么充 API，要么买额外用量包，要么换 Codex/Gemini。
- **OfoxAI 用户**：我们用的是 API，不受影响。该跑 Agent 跑 Agent，该 vibe coding vibe coding。
- **观望中的开发者**：这是一个明确的信号 —— **Agent harness 这门生意，模型厂商要自己做了**。第三方的窗口期正在关闭。

## Cobb 的判断

这件事的本质，**不是算力不够，是商业模式对齐**。

订阅制的前提是"用户大致均匀分布"。但 AI Coding Agent 改变了游戏规则 —— 一个用户 7x24 跑 Agent，消耗的算力是普通用户的 100 倍甚至 1000 倍。这种长尾，订阅制天然消化不了。

接下来你会看到的趋势：

1. **所有模型厂商都会跟进**。OpenAI、Google 不会眼睁睁看着 Anthropic 自己回血。
2. **第三方 harness 会被迫垂直整合**。要么自建模型，要么深度绑定一个厂商，要么死。
3. **真正赢的是按 token 付费的 API 模式**。订阅是消费品逻辑，token 计费是工业品逻辑。Agent 是工业品。

OfoxAI 从第一天就是 API 模式 —— 这不是巧合，是看到了这一天会来。

## 顺便说一句：API 不该是黑盒

切到 API 之后，很多人会立刻撞上一个新问题：**钱花哪儿去了，你不知道。**

官方 API 给你的，就是一个 key 和一份月底账单。一个团队五个人共用，谁烧的多、哪个项目超支、哪次调用 token 爆炸 —— 全是黑盒。出了问题只能互相猜。

这正是 **OfoxAI** 在做的事：

- **每一次请求都有清晰记录** —— 哪个用户、哪个项目、哪个模型、输入输出 token 数、耗时、成本，全都看得见
- **团队管理** —— 子账号、配额、权限分级，谁能用什么模型、每月最多花多少，一目了然
- **多模型统一接入** —— Claude、GPT、Gemini、国产模型，一个 key 全搞定，不用维护五套凭证
- **成本实时可视化** —— 不用等月底账单吓一跳，超支前就能看见趋势

如果你正好被 Anthropic 这一刀逼到要切 API，不妨直接切到 OfoxAI。同样是 API，多一层透明、多一层管控，价格还一样。

👉 [https://ofox.ai/zh](https://ofox.ai/zh?utm_source=wechat_official&utm_medium=post&utm_campaign=weekly_article)

---

**原文出处：**
- [VentureBeat 报道](https://venturebeat.com/technology/anthropic-cuts-off-the-ability-to-use-claude-subscriptions-with-openclaw-and)
- [Boris Cherny X 公告](https://x.com/bcherny/status/2040206440556826908)

**博客原文：** [https://cobb789.ofox.ai/posts/anthropic-blocks-subscription-third-party-tools/](https://cobb789.ofox.ai/posts/anthropic-blocks-subscription-third-party-tools/)

**OfoxAI · 你的 AI 开发伙伴：** [https://ofox.ai/zh?utm_source=wechat_official&utm_medium=post&utm_campaign=weekly_article](https://ofox.ai/zh?utm_source=wechat_official&utm_medium=post&utm_campaign=weekly_article)
